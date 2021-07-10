import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  ReactFlowProvider,
} from 'react-flow-renderer';

import { nodeTypes } from '../custom_nodes';
import { ConfigurationPanel } from './ConfigurationPanel';
import { useKatharaConfig } from '../contexts/katharaConfigContext';
import { labInfo, device } from '../models/network';
import { getDefaultDeviceLabel } from '../utilities/utilities';

import { ErrorFallback } from '../components/Home';
import { ErrorBoundary } from 'react-error-boundary';

const snapGrid = [16, 16];

const onEdgeContextMenu = (event, edge) => {
  console.log({ event, edge });
};

const onDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

const onNodeDragStop = (event, node) => {
  // console.log({ event });
  console.log('drag stop', node);
};

let id = 0;
const getId = () => `node_${+new Date()}`;

export const Workspace = ({
  openConfigurationPanel,
  isConfigurationPanelOpen,
}) => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const [elements, setElements] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);
  const [activeDevice, setActiveDevice] = useState();
  const [activeDeviceInterfaces, setActiveDeviceInterfaces] = useState([]);

  const onConnectStart = useCallback((event, { nodeId, handleType }) => {
    console.log({ nodeId, handleType });
  }, []);

  // const onElementClick = (event, element) => {
  //   // console.log('click', element);
  //   onDeviceClicked(element);
  //   openConfigurationPanel(true);
  // };

  useEffect(() => {
    setKatharaConfig((config) => {
      return {
        ...config,
        elements,
      };
    });
  }, [elements]);

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

  const onConnect = useCallback((params) => {
    // console.log({
    //   ...params,
    //   label: 'styled label',
    //   labelStyle: { fill: 'red', fontWeight: 700 },
    //   animated: true,
    //   type: 'straight',
    // });
    setElements((els) =>
      addEdge(
        {
          ...params,
          // label: 'styled label',
          // labelStyle: { fill: 'red', fontWeight: 700 },
          // animated: true,
          // type: 'straight',
          type: 'default',
        },
        els
      )
    );
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>
      setElements((els) => updateEdge(oldEdge, newConnection, els)),
    []
  );

  useEffect(() => {
    if (reactFlowInstance) {
      // reactFlowInstance.fitView();
      console.table({ elements });
      console.log({ katharaConfig });
    }
  }, [reactFlowInstance, elements.length]);

  const onElementsRemove = useCallback(
    (elementsToRemove) => {
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
          const filteredMachines = katharaConfig.machines.filter((machine) => {
            return listOfNodeIdsAndCorrespondingNodeInterfaces.some(
              (e) => e.nodeId === machine.id
            );
          });

          console.log({ filteredMachines });

          filteredMachines.forEach((machine) => {
            return listOfNodeIdsAndCorrespondingNodeInterfaces.forEach(
              (elem) => {
                if (elem.nodeId === machine.id) {
                  const newInterfacesArr = machine.interfaces.if.filter((e) => {
                    return (
                      parseInt(elem.nodeIntf[elem.nodeIntf.length - 1]) !==
                      e.eth.number
                    );
                  });

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
                  elem.id !== interfacesToDeleteInConnectedDeviceConfig[0].node
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
    },
    [elements]
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
        // console.log({ lab });
        return lab;
      });
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

    // // update the label on the corresponding element as well
    // setKatharaConfig((config) => {
    //   const existingElement = katharaConfig.elements.find(
    //     (element) => element.id === rfNodeId
    //   );

    //   existingElement.data.label = updatedLabel;

    //   const filteredElementList = config.elements.filter((element) => {
    //     return element.id !== rfNodeId;
    //   });

    //   return {
    //     ...config,
    //     elements: [...filteredeElements, existingElement],
    //   };
    // });
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ReactFlowProvider>
        <div className="flex-1 bg-gray-50 p-1" ref={reactFlowWrapper}>
          <ReactFlow
            elements={katharaConfig.elements || elements}
            snapGrid={snapGrid}
            // onElementClick={onElementClick}
            onElementsRemove={onElementsRemove}
            onConnect={onConnect}
            deleteKeyCode={46}
            onLoad={onLoad}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            nodesDraggable={true}
            onNodeDragStop={onNodeDragStop}
            connectionMode={ConnectionMode.Loose}
            onEdgeUpdate={onEdgeUpdate}
            onConnectStart={onConnectStart}
            // onPaneClick={onPaneClick}
            // onPaneScroll={onPaneScroll}
            // onPaneContextMenu={onPaneContextMenu}
            // onNodeDragStart={onNodeDragStart}
            // onNodeDrag={onNodeDrag}
            onNodeDoubleClick={onNodeDoubleClick}
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
        </div>
      </ReactFlowProvider>
    </ErrorBoundary>
  );
};
