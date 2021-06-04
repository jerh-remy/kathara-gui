import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, {
  ElementId,
  isNode,
  isEdge,
  addEdge,
  Elements,
  removeElements,
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
} from 'react-flow-renderer';

import { nodeTypes } from '../custom_nodes';

// console.log({ nodeTypes });

const initialElements = [
  {
    id: '1',
    type: 'custom',
    data: { deviceType: 'Router' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'input', // input node
    data: { label: 'Input Node' },
    position: { x: 850, y: 25 },
  },
  {
    id: '22',
    type: 'special', // input node
    data: { label: 'Color Node' },
    position: { x: 350, y: 25 },
  },
  // // default node
  // {
  //   id: '2',
  //   // you can also pass a React component as a label
  //   data: { label: <div>Default Node</div> },
  //   position: { x: 100, y: 125 },
  // },
  // {
  //   id: '3',
  //   type: 'output', // output node
  //   data: { label: 'Output Node' },
  //   position: { x: 250, y: 250 },
  // },
  // // animated edge
  // { id: 'e1-2', source: '1', target: '2', animated: true },
  // { id: 'e2-3', source: '2', target: '3' },
];

const snapGrid = [16, 16];

const onDragOver = (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
};

const onNodeDragStop = (event, node) => {
  console.log({ event });
  console.log('drag stop', node);
};
const onElementClick = (event, element) => console.log('click', element);

let id = 0;
const getId = () => `dndnode_${id++}`;

export const EditorCanvasColumn = () => {
  const [elements, setElements] = useState(initialElements);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);

  const onConnect = useCallback(
    (params) => setElements((els) => addEdge(params, els)),
    []
  );

  // const onConnect = (params) =>
  //   setElements((els) =>
  //     addEdge({ ...params, animated: true, style: { stroke: '#fff' } }, els)
  //   );

  // const onElementsRemove = (elementsToRemove) =>
  //   setElements((els) => removeElements(elementsToRemove, els));

  // useEffect(() => {
  //   if (reactFlowInstance && elements.length > 0) {
  //     reactFlowInstance.fitView();
  //   }
  // }, [reactFlowInstance, elements.length]);

  const onElementsRemove = useCallback(
    (elementsToRemove) =>
      setElements((els) => removeElements(elementsToRemove, els)),
    []
  );

  const onLoad = useCallback(
    (rfi) => {
      if (!reactFlowInstance) {
        setReactFlowInstance(rfi);
        console.log('flow loaded:', rfi);
      }
    },
    [reactFlowInstance]
  );

  // const onLoad = (reactFlowInstance) => {
  //   console.log('onLoad called');
  //   setReactFlowInstance(reactFlowInstance);
  //   console.log({ reactFlowInstance });
  // };

  const onDrop = (event) => {
    event.preventDefault();
    console.log({ event });

    if (reactFlowInstance) {
      const data = event.dataTransfer.getData('application/reactflow');
      console.log({ data });
      const type = data.split('|')[0];
      const deviceType = data.split('|')[1];
      const position = reactFlowInstance.project({
        x: event.clientX,
        y: event.clientY - 40,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${deviceType}`, deviceType: deviceType },
      };

      console.log({ newNode });

      setElements((es) => es.concat(newNode));
    }
  };

  return (
    <div
      className="flex-1 bg-gray-50 p-1 reactflow-wrapper"
      ref={reactFlowWrapper}
    >
      <ReactFlow
        elements={elements}
        snapGrid={snapGrid}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        deleteKeyCode={46}
        onLoad={onLoad}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
        onNodeDragStop={onNodeDragStop}
        // onPaneClick={onPaneClick}
        // onPaneScroll={onPaneScroll}
        // onPaneContextMenu={onPaneContextMenu}
        // onNodeDragStart={onNodeDragStart}
        // onNodeDrag={onNodeDrag}
        // onNodeDoubleClick={onNodeDoubleClick}
        // onSelectionDragStart={onSelectionDragStart}
        // onSelectionDrag={onSelectionDrag}
        // onSelectionDragStop={onSelectionDragStop}
        // onSelectionContextMenu={onSelectionContextMenu}
        // onSelectionChange={onSelectionChange}
        // onMoveEnd={onMoveEnd}
        // connectionLineStyle={connectionLineStyle}
        // snapToGrid={true}
        // snapGrid={snapGrid}
        // onEdgeContextMenu={onEdgeContextMenu}
        // onEdgeMouseEnter={onEdgeMouseEnter}
        // onEdgeMouseMove={onEdgeMouseMove}
        // onEdgeMouseLeave={onEdgeMouseLeave}
        // onEdgeDoubleClick={onEdgeDoubleClick}
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};
