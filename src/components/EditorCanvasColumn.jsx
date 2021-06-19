import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ElementId,
  isNode,
  isEdge,
  addEdge,
  Elements,
  removeElements,
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

export const EditorCanvasColumn = ({
  openConfigurationPanel,
  onDeviceClicked,
  isConfigurationPanelOpen,
  activeDevice,
  setActiveDevice,
}) => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();

  const [elements, setElements] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);

  const onConnectStart = useCallback((event, { nodeId, handleType }) => {
    console.log({ nodeId, handleType });
  }, []);

  // const onElementClick = (event, element) => {
  //   // console.log('click', element);
  //   onDeviceClicked(element);
  //   openConfigurationPanel(true);
  // };

  const onNodeDoubleClick = (event, node) => {
    // console.log('click', element);
    onDeviceClicked(node);
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
      let ids = elementsToRemove.map((el) => el.id);
      console.log({ ids });
      // console.log(
      //   katharaConfig.machines.filter((machine) => !ids.includes(machine.id))
      // );
      setElements((els) => removeElements(elementsToRemove, els));
      setKatharaConfig((config) => ({
        ...config,
        machines: config.machines.filter(
          (machine) => !ids.includes(machine.id)
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
        // console.log({ es });
        const newArr = es.concat(newNode);
        return newArr;
      });

      setKatharaConfig((config) => ({
        ...config,
        machines: [
          ...config.machines,
          {
            ...device,
            id: newNode.id,
            type: dt,
          },
        ],
      }));
    }
  };

  return (
    <ReactFlowProvider>
      <div className="flex-1 bg-gray-50 p-1" ref={reactFlowWrapper}>
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
          activeDevice={activeDevice}
          setActiveDevice={setActiveDevice}
        />
      </div>
    </ReactFlowProvider>
  );
};
