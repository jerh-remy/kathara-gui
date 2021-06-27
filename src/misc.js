const initialElements = [
  // {
  //   id: '1',
  //   type: 'custom',
  //   data: { deviceType: 'Router' },
  //   position: { x: 250, y: 5 },
  // },
  // {
  //   id: '2',
  //   type: 'input', // input node
  //   data: { label: 'Input Node' },
  //   position: { x: 850, y: 25 },
  // },
  // {
  //   id: '22',
  //   type: 'special', // input node
  //   data: { label: 'Color Node' },
  //   position: { x: 350, y: 25 },
  // },
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

import React, { memo, FC, CSSProperties } from 'react';

import {
  Handle,
  Position,
  NodeProps,
  Connection,
  Edge,
} from 'react-flow-renderer';

const targetHandleStyle: CSSProperties = { background: '#555' };
const sourceHandleStyleA: CSSProperties = { ...targetHandleStyle, top: 10 };
const sourceHandleStyleB: CSSProperties = {
  ...targetHandleStyle,
  bottom: 10,
  top: 'auto',
};

const onConnect = (params: Connection | Edge) =>
  console.log('handle onConnect', params);

const ColorSelectorNode: FC<NodeProps> = ({ data }) => {
  return (
    <div className="react-flow__node-selectorNode">
      <Handle
        type="target"
        position={Position.Left}
        style={targetHandleStyle}
        onConnect={onConnect}
      />
      <div>
        Custom Color Picker Node: <strong>{data.color}</strong>
      </div>
      <input
        className="nodrag"
        type="color"
        onChange={data.onChange}
        defaultValue={data.color}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={sourceHandleStyleA}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={sourceHandleStyleB}
      />
    </div>
  );
};

export default memo(ColorSelectorNode);
