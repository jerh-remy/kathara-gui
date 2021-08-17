import React, { useState, FC, memo } from 'react';
import { useRef } from 'react';
import {
  Connection,
  Edge,
  Handle,
  NodeProps,
  Position,
  HandleProps,
} from 'react-flow-renderer';
import ReactTooltip from 'react-tooltip';
import { useKatharaConfig } from '../../contexts/katharaConfigContext';

import { getImage } from '../../utilities/utilities';

const onConnect = (params: Connection | Edge) =>
  console.log('handle onConnect', params);

const CustomNode: FC<NodeProps> = ({ data, id, ...rest }) => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const toolTipRef = useRef<HTMLDivElement | null>(null);

  const deviceLabel = data.label;
  const deviceType = data.deviceType;
  // console.log({ rest });

  const nodeData = katharaConfig.machines.find((elem: any) => elem.id === id);
  // console.log({ showToolTip });

  let tooltip;
  if (nodeData?.interfaces.if.length > 0) {
    tooltip = (
      <ReactTooltip
        type="light"
        id={id}
        place="top"
        effect="solid"
        className="shadow-md"
      >
        <div className="mt-2 mb-2 space-y-2">
          {nodeData.interfaces.if
            .sort((a: any, b: any) => {
              return a.eth.number - b.eth.number;
            })
            .map((intf: any) => {
              const interfaceNumber = `eth${intf.eth.number}`;
              const interfaceDomain = intf.eth.domain;
              const interfaceIp = intf.eth.ip;
              return (
                <div
                  key={intf.eth.number}
                  className="border border-dashed border-gray-300 px-4 py-2 rounded-md w-[200px] min-w-max"
                >
                  <div className="">
                    <div className="flex justify-between items-center">
                      <p>Interface: </p>
                      <p className="text-teal-500">{interfaceNumber}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p>Domain: </p>
                      <p className="text-teal-500">{interfaceDomain}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p>IP address: </p>
                      <p className="text-teal-500">{interfaceIp}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </ReactTooltip>
    );
  } else {
    tooltip = null;
  }

  return (
    <>
      <div
        className="relative"
        onContextMenu={(e) => {
          e.preventDefault();
          ReactTooltip.hide(toolTipRef.current!);
        }}
      >
        <div
          ref={toolTipRef}
          data-tip
          data-for={id}
          className="flex flex-col justify-center items-center p-[2px] "
        >
          <Handle
            id="eth3"
            type="source"
            position={Position.Left}
            style={{ top: 35, background: '#555' }}
            onConnect={onConnect}
            children={
              <div className="inline-flex whitespace-nowrap bg-gray-200 rounded-lg px-1 py-[2px] text-[8px] text-gray-500 absolute right-1 -top-5">
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
              <div className="inline-flex whitespace-nowrap bg-gray-200 rounded-lg px-1 py-[2px] text-[8px] text-gray-500 absolute left-1 -bottom-5">
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
              <div className="inline-flex whitespace-nowrap bg-gray-200 rounded-lg px-1 py-[2px] text-[8px] text-gray-500 absolute left-2 bottom-1">
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
              <div className="inline-flex whitespace-nowrap bg-gray-200 rounded-lg px-1 py-[2px] text-[8px] text-gray-500 absolute right-2 top-1">
                eth0
              </div>
            }
          />
          <img
            // draggable="false"
            className="transition-all h-[60px] w-[60px] object-scale-down hover:scale-105"
            src={getImage(deviceType)}
            onDragStart={(event) => event.preventDefault()}
            alt="The type of network device"
          />
        </div>
        <div className="absolute flex justify-center items-center whitespace-nowrap -bottom-12 left-0 right-0 text-sm text-center text-gray-500 font-medium tracking-wide">
          {deviceLabel}
        </div>
      </div>
      {tooltip}
    </>
  );
};

export default CustomNode;
