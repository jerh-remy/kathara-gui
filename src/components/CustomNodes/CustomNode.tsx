import React, { FC, memo } from 'react';
import {
  Connection,
  Edge,
  Handle,
  NodeProps,
  Position,
} from 'react-flow-renderer';

import { getImage } from '../../utilities';

const onConnect = (params: Connection | Edge) =>
  console.log('handle onConnect', params);

const CustomNode: FC<NodeProps> = ({ data }) => {
  const deviceType = data.deviceType;
  // console.log({ deviceType, data });

  return (
    <div className="space-y-2">
      <div className="flex flex-col justify-center items-center p-[2px]">
        <Handle
          id="a"
          type="source"
          position={Position.Left}
          onConnect={onConnect}
        />
        <Handle
          id="b"
          type="source"
          position={Position.Right}
          onConnect={onConnect}
        />
        <Handle
          id="c"
          type="source"
          position={Position.Top}
          onConnect={onConnect}
        />
        <Handle
          id="d"
          type="source"
          position={Position.Bottom}
          onConnect={onConnect}
        />
        <img
          // draggable="false"
          className="h-[60px] w-[60px] object-scale-down"
          src={getImage(deviceType)}
          onDragStart={(event) => event.preventDefault()}
          alt="The type of network device"
        />
      </div>
      {/* <div className="flex justify-center items-center text-sm text-gray-800">
        {deviceType}
      </div> */}
    </div>
  );
};

export default memo(CustomNode);
