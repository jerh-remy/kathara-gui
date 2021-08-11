import React, { useEffect, useState } from 'react';
import { useKatharaConfig } from '../contexts/katharaConfigContext';
import { useKatharaLabStatus } from '../contexts/katharaLabStatusContext';
import { Heading2 } from './Heading2';
import { getNetworkFromIpNet } from '../utilities/ipAddressing';

export const RoutingPathPanel = () => {
  const [routingType, setRoutingType] = useState('bgp');
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const [katharaLabStatus, setKatharaLabStatus] = useKatharaLabStatus();

  const [machines, setMachines] = useState(katharaConfig.machines);
  const [sourceNode, setSourceNode] = useState(katharaConfig.machines[0]);
  const [destinationNode, setDestinationNode] = useState(
    katharaConfig.machines[1]
  );

  const [
    destinationNetworkInterfaces,
    setDestinationNetworkInterfaces,
  ] = useState([]);
  const [destinationIPAddress, setDestinationIPAddress] = useState();
  const [
    convertedIPtoNetworkAddress,
    setconvertedIPtoNetworkAddress,
  ] = useState();

  // this runs whenever the machines array in kathara config changes
  // will occur normally when an existing lab is imported
  useEffect(() => {
    setMachines(katharaConfig.machines);
    setSourceNode(katharaConfig.machines[0]);
    setDestinationNode(katharaConfig.machines[1]);
  }, [katharaConfig.machines]);

  useEffect(() => {
    if (destinationNode) {
      setDestinationNetworkInterfaces(() => {
        return destinationNode.interfaces.if;
      });
    }
  }, [destinationNode]);

  // after selecting a destination device, set the first interfaces
  // in the array as default
  useEffect(() => {
    if (destinationNetworkInterfaces.length > 0) {
      setDestinationIPAddress(() => {
        return destinationNetworkInterfaces[0].eth.ip;
      });
    }
  }, [destinationNetworkInterfaces]);

  // convert the destination ip address to the network address it belongs to
  useEffect(() => {
    if (destinationIPAddress) {
      setconvertedIPtoNetworkAddress(() => {
        return getNetworkFromIpNet(destinationIPAddress);
      });
    }
  }, [destinationIPAddress]);

  console.log({ sourceNode });
  console.log({ destinationNode });
  console.log({ destinationIPAddress });
  console.log({ convertedIPtoNetworkAddress });

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

      {machines.length > 1 ? (
        <>
          <div className="flex mt-2 ">
            <label className="flex items-center w-1/2">
              <input
                className="mr-[5px] rounded-full"
                type="radio"
                id="routing-type"
                value="bgp"
                onChange={(e) => {
                  setRoutingType(e.target.value);
                }}
                checked={routingType === 'bgp'}
                name="routing-type"
              />
              <span className="text-sm text-gray-800 mr-4">BGP</span>
            </label>
            <label className="flex items-center w-1/2">
              <input
                className="mr-[5px] rounded-full"
                type="radio"
                id="routing-type"
                value="isis"
                onChange={(e) => {
                  setRoutingType(e.target.value);
                }}
                checked={routingType === 'isis'}
                name="routing-type"
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
                  setSourceNode(() => {
                    const source = machines.find((el) => {
                      return el.name === e.target.value;
                    });
                    return source;
                  });
                }}
              >
                {machines
                  .filter((machine) => {
                    return machine.name !== destinationNode.name;
                  })
                  .map((machine) => {
                    return (
                      <option key={machine.name} value={machine.name}>
                        {machine.name}
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
                  setDestinationNode(() => {
                    const dest = machines.find((el) => {
                      return el.name === e.target.value;
                    });
                    return dest;
                  });
                }}
              >
                {machines
                  .filter((machine) => {
                    return machine.name !== sourceNode.name;
                  })
                  .map((machine) => {
                    return (
                      <option key={machine.name} value={machine.name}>
                        {machine.name}
                      </option>
                    );
                  })}
              </select>
            </div>

            <label htmlFor="interface" className="block text-sm text-gray-800">
              Destination IP address
            </label>
            <div className="mt-1 mb-2">
              <select
                name="interface"
                onChange={(e) => {
                  console.log(e.target.value);
                  setDestinationIPAddress(e.target.value);
                }}
              >
                {destinationNetworkInterfaces.map((intf) => {
                  return (
                    <option key={intf.eth.number} value={intf.eth.ip}>
                      {`${intf.eth.ip} - eth${intf.eth.number}`}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </>
      ) : (
        <div className="block text-center mt-2">
          <p className="text-sm text-gray-500">
            You can only find the routing path for more than one device
          </p>
        </div>
      )}
    </div>
  );
};
