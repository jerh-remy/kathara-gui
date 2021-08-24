import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  TerminalIcon,
  PencilAltIcon,
  TrashIcon,
} from '@heroicons/react/outline';
// import {deepCopy} from 'lodash';
import _ from 'lodash';
import ReactFlow, {
  ElementId,
  isNode,
  isEdge,
  addEdge,
  Elements,
  removeElements,
  getConnectedEdges,
  getOutgoers,
  updateEdge,
  SnapGrid,
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  FlowElement,
  OnLoadParams,
  FlowTransform,
  Connection,
  ReactFlowProps,
  ConnectionMode,
  useZoomPanHelper,
} from 'react-flow-renderer';

import { nodeTypes } from '../custom_nodes';
import { edgeTypes } from '../custom_edges';
import { ConfigurationPanel } from './ConfigurationPanel';
import { useKatharaLabStatus } from '../contexts/katharaLabStatusContext';
import { useKatharaConfig } from '../contexts/katharaConfigContext';
import { labInfo, device } from '../models/network';
import { getDefaultDeviceLabel } from '../utilities/utilities';

import { ContextMenu } from './ContextMenu';
import { ConsolePanel } from './ConsolePanel/ConsolePanel';
import { RoutingPathPanel } from './RoutingPathPanel';

const snapGrid = [16, 16];

const onEdgeContextMenu = (event, edge) => {
  console.log({ event, edge });
};

const onDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

const onNodeDragStop = (event, node) => {
  console.log('drag stop', node);
};

let id = 0;
const getId = () => `node_${+new Date()}`;

export const Workspace = ({
  openConfigurationPanel,
  isConfigurationPanelOpen,
  onNewProjectCreate,
}) => {
  const [katharaLabStatus, setKatharaLabStatus] = useKatharaLabStatus();
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const [elements, setElements] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);
  const [activeDevice, setActiveDevice] = useState();
  const [activeDeviceInterfaces, setActiveDeviceInterfaces] = useState([]);
  const { transform } = useZoomPanHelper();

  useEffect(() => {
    if (reactFlowInstance) {
      console.table({ elements });
      console.log({ katharaConfig });

      const rfInstance = reactFlowInstance.toObject();
      console.log({ rfInstance });
      // anytime I call setKatharaConfig it autosaves given 'autosaveEnabled' == true
      setKatharaConfig((config) => {
        return {
          ...config,
          ...rfInstance,
        };
      });
    }
  }, [reactFlowInstance, elements.length]);

  console.log({ katharaConfig }, { reactFlowInstance });

  // this is a hack to save the zoom and position of the
  // reactflow object to kathara config every 5 secs
  useEffect(() => {
    const interval = setInterval(() => {
      if (reactFlowInstance) {
        const rfInstance = reactFlowInstance.toObject();
        // console.log(
        //   'Autosave enabled? ',
        //   katharaConfig.labInfo.autosaveEnabled
        // );
        if (katharaConfig.labInfo.autosaveEnabled === true) {
          // console.log('This will run every 5 seconds!', { rfInstance });
          console.log('Saving after every 5 seconds!');
          setKatharaConfig((config) => {
            return {
              ...config,
              ...rfInstance,
            };
          });
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [reactFlowInstance, katharaConfig]);

  // this effect runs when a lab is imported
  useEffect(() => {
    // console.log(`RUNNING THIS SHID!!`);

    if (reactFlowInstance) {
      // setElements(
      //   katharaConfig.elements.map((el) => {
      //     if (isEdge(el) && el.type === 'default') {
      //       return {
      //         ...el,
      //         type: 'custom',
      //         arrowHeadType: 'arrowclosed',
      //       };
      //     } else {
      //       return el;
      //     }
      //   }) || []
      // );
      setElements(katharaConfig.elements || []);
      if (katharaConfig.position) {
        const [x = 0, y = 0] = katharaConfig.position;
        transform({ x, y, zoom: katharaConfig.zoom || 0 });
      }
    }

    return () => {
      console.log('CLEANING UP WORKSPACE!!');
      setElements(() => []);
    };
  }, [katharaConfig.elements, reactFlowInstance]);

  console.log(`isLabRunning? ${katharaLabStatus.isLabRunning}`);

  const onConnectStart = useCallback((event, { nodeId, handleType }) => {
    console.log({ nodeId, handleType });
  }, []);

  const onNodeDoubleClick = (event, node) => {
    const connectedEdges = getConnectedEdges(
      [node],
      elements.filter((element) => isEdge(element))
    );
    console.log({ connectedEdges });
    const interfaces = [];
    connectedEdges.forEach((edge) => {
      if (node.id === edge.source) {
        interfaces.push(edge.sourceHandle);
      } else if (node.id === edge.target) {
        interfaces.push(edge.targetHandle);
      }
    });
    console.log({ interfaces });
    setActiveDevice(node);
    setActiveDeviceInterfaces(interfaces);
    openConfigurationPanel(true);
  };

  const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    setActiveDevice(node);
  };

  const onConnect = useCallback((params) => {
    // console.log({
    //   ...params,
    //   label: 'styled label',
    //   labelStyle: { fill: 'red', fontWeight: 700 },
    //   animated: true,
    //   type: 'straight',
    // });
    if (katharaLabStatus.isLabRunning === true) {
      alert(
        'Please stop the running lab before making changes to the topology.'
      );
    } else {
      setElements((els) =>
        addEdge(
          {
            ...params,
            // label: 'styled label',
            // labelStyle: { fill: 'red', fontWeight: 700 },
            type: 'default',
            // data: { text: 'custom edge' },
            // arrowHeadType: 'arrowclosed',
          },
          els
        )
      );
    }
  }, []);

  // const onEdgeUpdate = useCallback(
  //   (oldEdge, newConnection) =>
  //     setElements((els) => updateEdge(oldEdge, newConnection, els)),
  //   []
  // );

  const onElementsRemove = useCallback(
    (elementsToRemove) => {
      if (katharaLabStatus.isLabRunning) {
        alert(
          'Please stop the running lab before making changes to the topology.'
        );
      } else {
        if (confirm(`Are you sure you want to delete?`)) {
          let idsOfElementsToRemove = elementsToRemove.map((el) => el.id);
          console.log({ idsOfElementsToRemove }, { elementsToRemove });

          setElements((els) => removeElements(elementsToRemove, els));

          // remove the element from the elements array in katharaConfig object
          setKatharaConfig((config) => {
            let filteredeElements = config.elements.filter((element) => {
              return !idsOfElementsToRemove.includes(element.id);
            });

            return {
              ...config,
              elements: [...filteredeElements],
            };
          });

          elementsToRemove.forEach((elem) => {
            if (isEdge(elem)) {
              const listOfNodeIdsAndCorrespondingNodeInterfaces = [
                {
                  nodeId: elem.source,
                  nodeIntf: elem.sourceHandle,
                },
                {
                  nodeId: elem.target,
                  nodeIntf: elem.targetHandle,
                },
              ];

              // filter out those machines connected together by the now deleted edge
              const filteredMachines = katharaConfig.machines.filter(
                (machine) => {
                  return listOfNodeIdsAndCorrespondingNodeInterfaces.some(
                    (e) => e.nodeId === machine.id
                  );
                }
              );

              console.log({ filteredMachines });

              filteredMachines.forEach((machine) => {
                return listOfNodeIdsAndCorrespondingNodeInterfaces.forEach(
                  (elem) => {
                    if (elem.nodeId === machine.id) {
                      const newInterfacesArr = machine.interfaces.if.filter(
                        (e) => {
                          return (
                            parseInt(
                              elem.nodeIntf[elem.nodeIntf.length - 1]
                            ) !== e.eth.number
                          );
                        }
                      );

                      console.log({ newInterfacesArr });

                      // mutate the interfaces array of the device
                      machine.interfaces.if = newInterfacesArr;

                      // remove that interface from is-is config if applicable
                      if (machine.routing.isis.en) {
                        const arr = machine.routing.isis.interfaces;

                        const index = arr.indexOf(elem.nodeIntf);
                        if (index > -1) {
                          arr.splice(index, 1);
                        }
                      }

                      setKatharaConfig((config) => {
                        // filter out the machine from the original array
                        // and add the modified version back
                        const filteredMachinesArr = config.machines.filter(
                          (elem) => {
                            return elem.id !== machine.id;
                          }
                        );

                        const newConfig = {
                          ...config,
                          machines: [...filteredMachinesArr, machine],
                        };
                        return newConfig;
                      });
                    }
                  }
                );
              });
            } else {
              const connectedEdges = getConnectedEdges(
                [elem],
                elements.filter((element) => isEdge(element))
              );
              const interfacesToDeleteInConnectedDeviceConfig = [];
              connectedEdges.forEach((edge) => {
                if (elem.id === edge.source) {
                  interfacesToDeleteInConnectedDeviceConfig.push({
                    node: edge.target,
                    interface: edge.targetHandle,
                  });
                } else if (elem.id === edge.target) {
                  interfacesToDeleteInConnectedDeviceConfig.push({
                    node: edge.source,
                    interface: edge.sourceHandle,
                  });
                }

                // remove the appropriate interfaces from the connected node.
                // the deleted device in question will be removed entirely from kathara
                // config so no need to filter out the interfaces specifically
                setKatharaConfig((config) => {
                  const machineToRemoveInterfaceFrom = config.machines.find(
                    (elem) => {
                      return (
                        elem.id ===
                        interfacesToDeleteInConnectedDeviceConfig[0].node
                      );
                    }
                  );

                  const newIntfArr = machineToRemoveInterfaceFrom.interfaces.if.filter(
                    (intf) => {
                      const interfaceName =
                        interfacesToDeleteInConnectedDeviceConfig[0].interface;
                      const interfaceNo = parseInt(
                        interfaceName[interfaceName.length - 1]
                      );
                      // console.log({ interfaceName }, { interfaceNo }, { intf });
                      return intf.eth.number !== interfaceNo;
                    }
                  );

                  // filter out the machine from the original array
                  // and add the modified version back
                  const filteredMachinesArr = config.machines.filter((elem) => {
                    return (
                      elem.id !==
                      interfacesToDeleteInConnectedDeviceConfig[0].node
                    );
                  });

                  // mutate the interfaces array of the connected device
                  machineToRemoveInterfaceFrom.interfaces.if = newIntfArr;

                  const newConfig = {
                    ...config,
                    machines: [
                      ...filteredMachinesArr,
                      machineToRemoveInterfaceFrom,
                    ],
                  };
                  return newConfig;
                });
              });
            }
          });

          // this deletes the selected device in question entirely from kathara config
          setKatharaConfig((config) => ({
            ...config,
            machines: config.machines.filter(
              (machine) => !idsOfElementsToRemove.includes(machine.id)
            ),
          }));
        }
      }
    },
    [elements, katharaLabStatus.isLabRunning]
  );

  const onLoad = useCallback(
    (rfi) => {
      if (!reactFlowInstance) {
        setReactFlowInstance(rfi);
        console.log('flow loaded:', rfi);
        console.log('katharaConfig loaded:', katharaConfig);
      }
    },
    [reactFlowInstance]
  );

  const onDrop = (event) => {
    event.preventDefault();
    if (!katharaConfig.labInfo.description) {
      console.log('You need to create a new project first');
      onNewProjectCreate();
    } else if (katharaLabStatus.isLabRunning) {
      alert('Please stop the running lab before adding a new device');
    } else {
      if (reactFlowInstance) {
        const data = event.dataTransfer.getData('application/reactflow');
        console.log({ data });
        const type = data.split('|')[0];
        const dt = data.split('|')[1];
        const deviceType = data.split('|')[2];
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        const newNode = {
          id: getId(),
          type,
          position,
          data: { label: `${deviceType}`, deviceType: dt },
        };

        setElements((es) => {
          const newArr = es.concat(newNode);
          return newArr;
        });

        setKatharaConfig((config) => {
          const machine = _.cloneDeep(device);
          console.log({ machine });
          const lab = {
            ...config,
            machines: [
              ...config.machines,
              {
                ...machine,
                id: newNode.id,
                type: dt,
              },
            ],
            elements: elements.concat(newNode),
          };
          return lab;
        });
      }
    }
  };

  const updateActiveDeviceLabel = () => {
    const rfNodeId = activeDevice.id;
    const updatedLabel = katharaConfig.machines.find(
      (machine) => machine.id === rfNodeId
    ).name;

    setElements((oldElements) => {
      const newArr = oldElements.filter((element) => {
        return element.id !== rfNodeId;
      });
      const rfNode = oldElements.find((node) => {
        return node.id === rfNodeId;
      });
      console.log({ rfNode });
      if (updatedLabel) {
        rfNode.data.label = updatedLabel;
      } else {
        rfNode.data.label = getDefaultDeviceLabel(rfNode.data.deviceType);
      }

      return newArr.concat(rfNode);
    });

    setKatharaConfig((config) => {
      const lab = {
        ...config,
        elements: elements,
      };
      return lab;
    });
  };

  return (
    <div
      className="relative flex-1 bg-gray-50 overflow-hidden"
      // className="relative flex-1 bg-gray-50 "
      ref={reactFlowWrapper}
    >
      <ReactFlow
        elements={elements}
        snapGrid={snapGrid}
        // onElementClick={onElementClick}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        deleteKeyCode={46}
        onLoad={onLoad}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={true}
        onNodeDragStop={onNodeDragStop}
        connectionMode={ConnectionMode.Loose}
        // onEdgeUpdate={onEdgeUpdate}
        onConnectStart={onConnectStart}
        // onPaneClick={onPaneClick}
        // onPaneScroll={onPaneScroll}
        // onPaneContextMenu={onPaneContextMenu}
        // onNodeDragStart={onNodeDragStart}
        // onNodeDrag={onNodeDrag}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeContextMenu={onNodeContextMenu}
        // onSelectionDragStart={onSelectionDragStart}
        // onSelectionDrag={onSelectionDrag}
        // onSelectionDragStop={onSelectionDragStop}
        // onSelectionContextMenu={onSelectionContextMenu}
        // onSelectionChange={onSelectionChange}
        // onMoveEnd={onMoveEnd}
        // connectionLineStyle={connectionLineStyle}
        // snapToGrid={true}
        // snapGrid={snapGrid}
        onEdgeContextMenu={onEdgeContextMenu}
        // onEdgeMouseEnter={onEdgeMouseEnter}
        // onEdgeMouseMove={onEdgeMouseMove}
        // onEdgeMouseLeave={onEdgeMouseLeave}
        // onEdgeDoubleClick={onEdgeDoubleClick}
      >
        <Controls />
        <Background color="#aaaaaae2" gap={16} />
      </ReactFlow>
      <ConfigurationPanel
        isOpen={isConfigurationPanelOpen}
        setOpen={openConfigurationPanel}
        onPanelClose={updateActiveDeviceLabel}
        activeDevice={activeDevice}
        interfaces={activeDeviceInterfaces}
      />
      <ConsolePanel />
      <ContextMenu>
        <div className="space-y-2">
          <button
            type="button"
            disabled={katharaLabStatus.isLabRunning === false}
            className={`w-full flex whitespace-nowrap text-sm px-2 py-1 font-normal tracking-normal rounded-sm ${
              katharaLabStatus.isLabRunning
                ? 'text-gray-600 focus:outline-none focus:ring-1  focus:ring-gray-200  hover:text-teal-600'
                : 'text-gray-200'
            } hover:border-transparent hover:bg-gray-100`}
            onClick={(e) => {
              e.preventDefault();
              setKatharaLabStatus((status) => {
                const newStatus = {
                  ...status,
                  isConsoleOpen: true,
                  killTerminals: false,
                };
                return newStatus;
              });

              if (
                !katharaLabStatus.terminals.some(
                  (value) => value.terminalId == activeDevice?.id
                )
              ) {
                setKatharaLabStatus((status) => {
                  const newStatus = {
                    ...status,
                    terminals: [
                      ...status.terminals,
                      {
                        terminalId: activeDevice?.id,
                        terminalTabName: activeDevice?.data.label,
                      },
                    ],
                  };

                  return newStatus;
                });
              } else {
                console.log('Already there');
              }
            }}
          >
            <TerminalIcon
              className={`${
                katharaLabStatus.isLabRunning
                  ? 'text-gray-600'
                  : 'text-gray-200'
              } w-5 h-5 mr-2`}
            />
            <span>Open in console</span>
          </button>
          <button
            type="button"
            disabled={katharaLabStatus.isLabRunning === true}
            className={`w-full flex whitespace-nowrap text-sm px-2 py-1 font-normal tracking-normal rounded-sm ${
              !katharaLabStatus.isLabRunning
                ? 'text-gray-600 focus:outline-none focus:ring-1  focus:ring-gray-200  hover:text-teal-600'
                : 'text-gray-200'
            } hover:border-transparent hover:bg-gray-100`}
            onClick={(e) => {
              e.preventDefault();
              // if (
              //   confirm(
              //     `Are you sure you want to delete device: ${activeDevice.data.label}?`
              //   )
              // ) {
              const device = elements.find((el) => el.id === activeDevice.id);
              onElementsRemove([device]);
              // }
            }}
          >
            <TrashIcon className="text-gray-600 w-5 h-5 mr-2" />
            <span> {`Delete ${activeDevice?.data.label}`}</span>
          </button>
        </div>
      </ContextMenu>
      {/* {katharaConfig.machines.length > 1 && ( */}
      <RoutingPathPanel />
      {/* )} */}
    </div>
  );
};
