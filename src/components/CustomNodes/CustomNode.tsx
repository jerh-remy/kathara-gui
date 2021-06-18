import React, { FC, memo } from 'react';
import {
  Connection,
  Edge,
  Handle,
  NodeProps,
  Position,
  HandleProps,
} from 'react-flow-renderer';

import { getImage } from '../../utilities';

const onConnect = (params: Connection | Edge) =>
  console.log('handle onConnect', params);

const CustomNode: FC<NodeProps> = ({ data }) => {
  const deviceLabel = data.label;
  const deviceType = data.deviceType;
  // console.log({ deviceType, data });

  return (
    <div className="space-y-2">
      <div className="flex flex-col justify-center items-center p-[2px] ">
        <Handle
          id="eth0"
          type="source"
          position={Position.Left}
          style={{ top: 35, background: '#555' }}
          onConnect={onConnect}
          // children={
          //   <div className="text-lightBlue-600">
          //     Heelloo
          //   </div>
          // }
        />
        <Handle
          id="eth1"
          type="source"
          position={Position.Right}
          style={{ top: 35, background: '#555' }}
          onConnect={onConnect}
        />
        <Handle
          id="eth2"
          type="source"
          position={Position.Top}
          style={{ top: 0, background: '#555' }}
          onConnect={onConnect}
        />
        <Handle
          id="eth3"
          type="source"
          position={Position.Bottom}
          style={{ bottom: 25, background: '#555' }}
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
      <div className="flex justify-center items-center text-sm text-gray-800">
        {deviceLabel}
      </div>
    </div>
  );
};

export default CustomNode;
