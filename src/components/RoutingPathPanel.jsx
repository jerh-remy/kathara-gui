import React, { useEffect, useState } from 'react';
import { useKatharaConfig } from '../contexts/katharaConfigContext';
import { useKatharaLabStatus } from '../contexts/katharaLabStatusContext';
import { Heading2 } from './Heading2';

export const RoutingPathPanel = () => {
  const [routingType, setRoutingType] = useState('bgp');
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const [katharaLabStatus, setKatharaLabStatus] = useKatharaLabStatus();

  const [machines, setMachines] = useState(
    katharaConfig.machines.map((machine) => {
      return machine.name;
    })
  );

  useEffect(() => {
    setMachines(
      katharaConfig.machines.map((machine) => {
        return machine.name;
      })
    );
  }, [katharaConfig.machines]);
  console.log({ machines });

  const [sourceNode, setSourceNode] = useState(machines[0]);
  const [destinationNode, setDestinationNode] = useState(machines[0]);

  return (
    <div
      className={`${
        !katharaLabStatus.isRoutingPathPanelOpen ? 'hidden' : 'block'
      } absolute z-[5] top-[10px] right-[10px] h-auto w-full max-w-[16rem] px-5 py-4 bg-white shadow-md rounded-sm`}
    >
      <div className="flex justify-between items-center space-x-4">
        <Heading2 text={`Routing Path`} />
        <button
          type="button"
          aria-label="Hide routing path overlay"
          onClick={(e) => {
            e.preventDefault();
            if (!katharaLabStatus.isRoutingPathPanelOpen) {
              setKatharaLabStatus((status) => {
                const newStatus = {
                  ...status,
                  isRoutingPathPanelOpen: true,
                };
                return newStatus;
              });
            } else {
              setKatharaLabStatus((status) => {
                const newStatus = {
                  ...status,
                  isRoutingPathPanelOpen: false,
                };
                return newStatus;
              });
            }
          }}
          className="w-auto flex whitespace-nowrap items-center px-2 py-1 text-xs font-normal tracking-normal rounded-sm text-gray-500 border hover:border-teal-500 hover:bg-teal-50 hover:text-teal-600 focus:outline-none focus:ring-1  focus:ring-teal-50"
        >
          Hide
        </button>
      </div>
      <div className="flex mt-2 ">
        <label className="flex items-center w-1/2">
          <input
            className="mr-[5px] rounded-full"
            type="radio"
            id="direct-startup"
            value="bgp"
            onChange={(e) => {
              setRoutingType(e.target.value);
            }}
            checked={routingType === 'bgp'}
            name="direct-startup"
          />
          <span className="text-sm text-gray-800 mr-4">BGP</span>
        </label>
        <label className="flex items-center w-1/2">
          <input
            className="mr-[5px] rounded-full"
            type="radio"
            id="direct-startup"
            value="isis"
            onChange={(e) => {
              setRoutingType(e.target.value);
            }}
            checked={routingType === 'isis'}
            name="direct-startup"
          />
          <span className="text-sm text-gray-800">IS-IS</span>
        </label>
      </div>
      <div className="mt-3 border-2 border-dashed rounded-md -mx-2 px-2 py-2">
        <label htmlFor="interface" className="block text-sm text-gray-800">
          Source node
        </label>
        <div className="mt-1 mb-2">
          <select
            name="interface"
            onChange={(e) => {
              setSourceNode(e.target.value);
            }}
          >
            {machines
              .filter((machine) => {
                return machine !== destinationNode;
              })
              .map((name) => {
                return (
                  <option key={name} value={name}>
                    {name}
                  </option>
                );
              })}
          </select>
        </div>
        <label htmlFor="interface" className="block text-sm text-gray-800">
          Destination node
        </label>
        <div className="mt-1 mb-2">
          <select
            name="interface"
            onChange={(e) => {
              setDestinationNode(e.target.value);
            }}
          >
            {machines
              .filter((machine) => {
                return machine !== sourceNode;
              })
              .map((name) => {
                return (
                  <option key={name} value={name}>
                    {name}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
    </div>
  );
};
