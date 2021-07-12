import React, { FC, memo, useState } from 'react';
import {
  Connection,
  Edge,
  Handle,
  NodeProps,
  Position,
  HandleProps,
  useStoreState,
  getIncomers,
  getOutgoers,
} from 'react-flow-renderer';

import { getImage } from '../../utilities/utilities';

const generateHandleKey = () => {
  return `handle_${new Date().getTime()}`;
};

const CustomNode: FC<NodeProps> = ({ data, id, xPos, yPos, ...rest }) => {
  const deviceLabel = data.label;
  const deviceType = data.deviceType;
  console.log({ id, xPos, yPos });

  const [handles, setHandles] = useState<any>([]);

  const onMouseEnter = (event: any) => {
    console.log({ event });
    const rect = event.target.getBoundingClientRect();
    console.log({ rect });
    const x = event.clientX - rect.left; //x position within the element.
    const y = event.clientY - rect.top; //y position within the element.
    console.log('Left: ' + x + ' ; Top: ' + y);

    // calculate the percentages to use for positioning in css
    const left = Math.abs(x / rect.width) * 100;
    const top = Math.abs(y / rect.height) * 100;

    console.log({ left }, { top });

    // if ((x < 2 || x > 126) && (y < 20 || y > 126)) {
    setHandles((handleArr: any) => {
      return handleArr.concat(
        <Handle
          // id="eth1"
          id={generateHandleKey()}
          key={generateHandleKey()}
          type="source"
          position={Position.Top}
          style={{
            top: `${top}%`,
            left: `${left}%`,
            background: '#464545',
            border: '1px solid white',
            width: '5px',
            height: '5px',
            transform: `translate(-${100 - left}%, -${100 - top}%)`,
          }}
          onConnect={onConnect}
          // children={
          //   <div className="inline-flex whitespace-nowrap bg-gray-200 rounded-lg px-1 py-[2px] text-[8px] text-gray-500 absolute left-2 -top-2">
          //     eth1
          //   </div>
          // }
        />
      );
    });
    // }
  };

  const onConnect = (params: Connection | Edge) =>
    console.log('handle onConnect', params);

  return (
    <>
      <div className="relative border border-black" onMouseEnter={onMouseEnter}>
        <div className="flex flex-col justify-center items-center p-[2px]  ">
          {handles}
          {/* <Handle
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
          /> */}
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

// const elements = useStoreState((store) => [...store.nodes, ...store.edges]);
// const myNode = elements.filter((el) => el.id === id)[0];

// const returnHandles = () => {
//   const incomers = getIncomers(myNode, elements);
//   const outgoers = getOutgoers(myNode, elements);
//   const incomersLen = incomers.length;
//   const joinedArr = [...incomers, ...outgoers];

//   return joinedArr.map((element, index) => {
//     const handleType = index < incomersLen ? 'target' : 'source';
//     const calculatedHandlePosition = calculateHandlePosition(
//       myNode,
//       element,
//       handleType
//     );
//     const { handlePosition, positionDeviation } = calculatedHandlePosition;
//     const positionStyleObj = {
//       top: 'left',
//       bottom: 'left',
//       left: 'top',
//       right: 'top',
//     };
//     const handleStyle = {
//       [positionStyleObj[handlePosition]]: `${positionDeviation}%`,
//       opacity: 0,
//     };

//     const handleId = `${handleType}-${id}-${element.id}`;
//     return (
//       <Handle
//         type={handleType}
//         position={handlePosition}
//         style={handleStyle}
//         id={handleId}
//         key={handleId}
//       />
//     );
//   });
// };
