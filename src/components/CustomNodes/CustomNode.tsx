import React, { FC, memo } from 'react';
import {
  Connection,
  Edge,
  Handle,
  NodeProps,
  Position,
  HandleProps,
} from 'react-flow-renderer';

import { getImage } from '../../utilities/utilities';

const onConnect = (params: Connection | Edge) =>
  console.log('handle onConnect', params);

const CustomNode: FC<NodeProps> = ({ data }) => {
  const deviceLabel = data.label;
  const deviceType = data.deviceType;
  // console.log({ deviceType, data });

  return (
    <>
      <div className="relative">
        <div className="flex flex-col justify-center items-center p-[2px] ">
          <Handle
            id="eth3"
            type="source"
            position={Position.Left}
            style={{ top: 35, background: '#555' }}
            onConnect={onConnect}
            children={
              <div className="inline-flex whitespace-nowrap bg-gray-200 rounded-lg px-1 py-[2px] text-[8px] text-gray-500 absolute right-2 -top-2">
                eth3
              </div>
            }
          />
          <Handle
            id="eth1"
            type="source"
            position={Position.Right}
            style={{ top: 35, background: '#555' }}
            onConnect={onConnect}
            children={
              <div className="inline-flex whitespace-nowrap bg-gray-200 rounded-lg px-1 py-[2px] text-[8px] text-gray-500 absolute left-2 -top-2">
                eth1
              </div>
            }
          />
          <Handle
            id="eth2"
            type="source"
            position={Position.Top}
            style={{ top: 0, background: '#555' }}
            onConnect={onConnect}
            children={
              <div className="inline-flex whitespace-nowrap bg-gray-200 rounded-lg px-1 py-[2px] text-[8px] text-gray-500 absolute -left-2 bottom-2">
                eth2
              </div>
            }
          />
          <Handle
            id="eth0"
            type="source"
            position={Position.Bottom}
            style={{ bottom: -2, background: '#555' }}
            onConnect={onConnect}
            children={
              <div className="inline-flex whitespace-nowrap bg-gray-200 rounded-lg px-1 py-[2px] text-[8px] text-gray-500 absolute -left-2 top-2">
                eth0
              </div>
            }
          />
          <img
            // draggable="false"
            className="h-[60px] w-[60px] object-scale-down"
            src={getImage(deviceType)}
            onDragStart={(event) => event.preventDefault()}
            alt="The type of network device"
          />
        </div>
        <div className="absolute flex justify-center items-center whitespace-nowrap -bottom-12 left-0 right-0 text-sm text-center text-gray-500">
          {deviceLabel}
        </div>
      </div>
    </>
  );
};

export default CustomNode;
