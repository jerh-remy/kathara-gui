import { Disclosure, Transition } from '@headlessui/react';
import { ChevronRightIcon, TrashIcon } from '@heroicons/react/outline';
import React, { FC, useEffect, useState } from 'react';

import { useKatharaConfig } from '../../contexts/katharaConfigContext';
import { Heading2 } from '../Heading2';
import { MessageWithBorder } from '../MessageWithBorder';

type Props = {
  interfaces: [];
  activeDevice: any;
  setActiveDevice: React.Dispatch<any>;
};
export const RouterConfigurationInfo: FC<Props> = ({
  activeDevice,
  interfaces,
  setActiveDevice,
}) => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();

  const [dynamicRouting, setDynamicRouting] = useState({
    isis: activeDevice.routing.isis.en,
    bgp: activeDevice.routing.bgp.en,
    rip: activeDevice.routing.rip.en,
  });

  const handleChange = (event: any) => {
    console.log(event.target.name);

    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    const propertyName = event.target.name;

    switch (propertyName) {
      case 'name':
        setActiveDevice((device: any) => ({
          ...device,
          [propertyName]: value,
        }));
        break;
      case 'startup':
        setActiveDevice((device: any) => {
          const newDevice = { ...device };
          newDevice.interfaces.free = value;
          return newDevice;
        });
        break;
      case 'isis':
        setDynamicRouting({
          ...dynamicRouting,
          [propertyName]: value,
        });
        setActiveDevice((device: any) => {
          const newDevice = {
            ...device,
            routing: {
              ...device.routing,
              isis: {
                ...device.routing.isis,
                en: value,
              },
            },
          };
          return newDevice;
        });
        break;
      case 'bgp':
        setDynamicRouting({
          ...dynamicRouting,
          [propertyName]: value,
        });
        setActiveDevice((device: any) => {
          const newDevice = {
            ...device,
            routing: {
              ...device.routing,
              bgp: {
                ...device.routing.bgp,
                en: value,
              },
            },
          };
          return newDevice;
        });
        break;
      case 'rip':
        setDynamicRouting({
          ...dynamicRouting,
          [propertyName]: value,
        });
        setActiveDevice((device: any) => {
          const newDevice = {
            ...device,
            routing: {
              ...device.routing,
              rip: {
                ...device.routing.rip,
                en: value,
              },
            },
          };
          return newDevice;
        });
        break;

      default:
        break;
    }
  };

  return (
    <>
      <div className="px-5 sm:px-7">
        <Heading2 text="Additional functions" />
      </div>
      <div className="px-5 sm:px-7 mt-1 mb-2 flex justify-between items-center">
        <span className="text-sm text-gray-800">Dynamic routing</span>
        <div className="flex justify-start space-x-5">
          <label>
            <input
              type="checkbox"
              id="isis"
              name="isis"
              className="mr-2"
              checked={dynamicRouting.isis}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-800">IS-IS</span>
          </label>
          <label>
            <input
              type="checkbox"
              id="bgp"
              name="bgp"
              className="mr-2"
              checked={dynamicRouting.bgp}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-800">BGP</span>
          </label>
          <label>
            <input
              type="checkbox"
              id="rip"
              name="rip"
              className="mr-2"
              checked={dynamicRouting.rip}
              onChange={handleChange}
            />
            <span className="text-sm text-gray-800">RIP</span>
          </label>
        </div>
      </div>

      {!dynamicRouting.isis && !dynamicRouting.bgp && !dynamicRouting.rip && (
        <MessageWithBorder message="Configure IS-IS, BGP and/or RIP on this router" />
      )}

      {dynamicRouting.isis && (
        <IsisConfiguration
          interfaces={interfaces}
          activeDevice={activeDevice}
          setActiveDevice={setActiveDevice}
        />
      )}
      {dynamicRouting.bgp && (
        <BgpConfiguration
          interfaces={interfaces}
          activeDevice={activeDevice}
          setActiveDevice={setActiveDevice}
        />
      )}
      {dynamicRouting.rip && (
        <RipConfiguration
          interfaces={interfaces}
          activeDevice={activeDevice}
          setActiveDevice={setActiveDevice}
        />
      )}
    </>
  );
};

type IsisProps = {
  interfaces: [];
  activeDevice: any;
  setActiveDevice: React.Dispatch<any>;
};

export const IsisConfiguration: FC<IsisProps> = ({
  interfaces,
  activeDevice,
  setActiveDevice,
}) => {
  const isisConfig = activeDevice.routing.isis;

  let interfaceSelectionSection;

  if (interfaces.length > 0) {
    interfaceSelectionSection = (
      <>
        <label
          htmlFor="interfaces"
          className="mt-2 mb-[6px] block text-sm text-gray-800"
        >
          Select interfaces to be configured
        </label>
        <div className="flex flex-wrap">
          {interfaces.map((intf) => {
            return (
              <label
                key={intf}
                className="mb-[6px] mr-3 flex justify-center items-center rounded-lg border border-1 px-2 py-2"
              >
                <input
                  className="mr-[5px] mt-[1.5px]"
                  type="checkbox"
                  onChange={(e) => handleChange(e, intf)}
                  checked={isisConfig.interfaces.includes(intf)}
                  name="intf"
                />
                <span className="text-sm text-gray-800">{intf}</span>
              </label>
            );
          })}
        </div>
      </>
    );
  } else {
    interfaceSelectionSection = (
      <MessageWithBorder message="No router interfaces have been configured." />
    );
  }

  const handleChange = (event: any, intf?: any) => {
    console.log(event.target.name);

    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    const propertyName = event.target.name;

    switch (propertyName) {
      case 'loopback':
        setActiveDevice((device: any) => {
          const newDevice = {
            ...device,
            routing: {
              ...device.routing,
              isis: {
                ...device.routing.isis,
                loopback: value,
              },
            },
          };
          return newDevice;
        });
        break;
      case 'word':
        setActiveDevice((device: any) => {
          const newDevice = {
            ...device,
            routing: {
              ...device.routing,
              isis: {
                ...device.routing.isis,
                word: value,
              },
            },
          };
          return newDevice;
        });
        break;
      case 'afi':
        setActiveDevice((device: any) => {
          const newDevice = {
            ...device,
            routing: {
              ...device.routing,
              isis: {
                ...device.routing.isis,
                afi: value,
              },
            },
          };
          return newDevice;
        });
        break;
      case 'area-id':
        setActiveDevice((device: any) => {
          const newDevice = {
            ...device,
            routing: {
              ...device.routing,
              isis: {
                ...device.routing.isis,
                areaId: value,
              },
            },
          };
          return newDevice;
        });
        break;
      case 'intf':
        console.log(`${intf} ${value}`);
        if (value) {
          setActiveDevice((device: any) => {
            const newIntfArr = device.routing.isis.interfaces.concat([intf]);
            const newDevice = {
              ...device,
              routing: {
                ...device.routing,
                isis: {
                  ...device.routing.isis,
                  interfaces: newIntfArr,
                },
              },
            };
            return newDevice;
          });
        } else {
          setActiveDevice((device: any) => {
            const filteredIntfArr = device.routing.isis.interfaces.filter(
              (el: any) => {
                return el !== intf;
              }
            );
            const newDevice = {
              ...device,
              routing: {
                ...device.routing,
                isis: {
                  ...device.routing.isis,
                  interfaces: filteredIntfArr,
                },
              },
            };
            return newDevice;
          });
        }
        break;

      default:
        break;
    }
  };

  return (
    <>
      <div className="mt-6 mx-4 px-2 py-2 bg-teal-50 rounded-md flex justify-center items-center">
        <span className="text-teal-600 text-">IS-IS Configuration</span>
      </div>
      <div className="mt-2 mb-4 mx-4 px-2 border-2 border-dashed rounded-md py-2">
        <label htmlFor="loopback" className="block text-sm text-gray-800">
          Loopback address
        </label>
        <div className="mt-1 mb-2">
          <input
            type="text"
            id="loopback"
            name="loopback"
            placeholder="0.0.0.0/0"
            value={typeof isisConfig !== 'undefined' ? isisConfig.loopback : ''}
            onChange={handleChange}
          />
        </div>
        <label htmlFor="word" className="block text-sm text-gray-800">
          IS-IS word
        </label>
        <div className="mt-1 mb-2">
          <input
            type="text"
            id="word"
            name="word"
            placeholder="WORD"
            value={typeof isisConfig !== 'undefined' ? isisConfig.word : ''}
            onChange={handleChange}
          />
        </div>
        <label htmlFor="afi" className="block text-sm text-gray-800">
          Authority and Format ID (AFI)
        </label>
        <div className="mt-1 mb-2">
          <input
            type="text"
            id="afi"
            name="afi"
            placeholder="49"
            value={typeof isisConfig !== 'undefined' ? isisConfig.afi : ''}
            onChange={handleChange}
          />
        </div>
        <label htmlFor="area-id" className="mt-2 block text-sm text-gray-800">
          Area ID
        </label>
        <div className="mt-1 mb-2">
          <input
            type="text"
            id="area-id"
            name="area-id"
            placeholder="0001"
            value={typeof isisConfig !== 'undefined' ? isisConfig.areaId : ''}
            onChange={handleChange}
          />
        </div>
        {interfaceSelectionSection}
      </div>
    </>
  );
};

type RipNetworkProps = {
  onDeleteClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
  id: string;
  activeDevice: any;
  setActiveDevice: React.Dispatch<any>;
};

export const RipNetwork: FC<RipNetworkProps> = ({
  onDeleteClick,
  id,
  activeDevice,
  setActiveDevice,
}) => {
  const handleChange = (event: any) => {
    console.log(event.target.name);

    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    const propertyName = event.target.name;

    switch (propertyName) {
      case 'network':
        setActiveDevice((device: any) => {
          let filteredNetworksArr = device.routing.rip.network.filter(
            (elem: any) => {
              return elem.id !== id;
            }
          );

          let updatedNetwork = device.routing.rip.network.find((elem: any) => {
            return elem.id === id;
          });

          updatedNetwork.ip = value;

          const newDevice = {
            ...device,
            routing: {
              ...device.routing,
              rip: {
                ...device.routing.rip,
                network: [...filteredNetworksArr, updatedNetwork],
              },
            },
          };
          return newDevice;
        });
        break;

      default:
        break;
    }
  };

  const ripNetwork = activeDevice.routing.rip.network.find(
    (elem: any) => elem.id === id
  );

  return (
    <div className="mt-3 border-2 border-dashed rounded-md mx-4 px-2 py-2">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full focus:outline-none">
              <div className="w-auto px-2 py-2 bg-teal-50 rounded-md flex justify-between items-center">
                <span className="text-teal-600">Network</span>
                <ChevronRightIcon
                  className={`${
                    open ? 'transform rotate-90' : ''
                  } w-5 h-5 text-teal-600`}
                />
              </div>
            </Disclosure.Button>
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Disclosure.Panel>
                <label
                  htmlFor="network"
                  className="mt-2 block text-sm text-gray-800"
                >
                  Network address
                </label>
                <div className="mt-1 mb-2">
                  <input
                    type="text"
                    id="network"
                    name="network"
                    placeholder="0.0.0.0/0"
                    // value={bgpNetwork.ip}
                    value={
                      typeof ripNetwork !== 'undefined' ? ripNetwork.ip : ''
                    }
                    onChange={(event) => handleChange(event)}
                  />
                </div>
                <div className="mt-4 mb-1.5">
                  <button
                    onClick={(event) => onDeleteClick(event, id)}
                    className="group flex items-center justify-center rounded-md bg-red-100 hover:bg-red-600 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <TrashIcon
                      className="h-5 w-5 mr-1.5 text-red-600 group-hover:text-white "
                      aria-hidden="true"
                    />
                    <span className="text-red-600 group-hover:text-white font-semibold">
                      Delete
                    </span>
                  </button>
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};

const generateRipNetworkKey = () => {
  return `net_rip_${new Date().getTime()}`;
};

type RipProps = {
  interfaces: [];
  activeDevice: any;
  setActiveDevice: React.Dispatch<any>;
};

export const RipConfiguration: FC<RipProps> = ({
  activeDevice,
  setActiveDevice,
}) => {
  const [directInRipConf, setDirectInRipConf] = useState('no');

  const [networks, setNetworks] = useState<any>(
    activeDevice.routing.rip.network.map((elem: any) => {
      return (
        <RipNetwork
          key={elem.id}
          onDeleteClick={removeNetwork}
          id={elem.id}
          activeDevice={activeDevice}
          setActiveDevice={setActiveDevice}
        />
      );
    })
  );

  const addNewNetwork = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const uniqueId = generateRipNetworkKey();

    setNetworks((net: any) => {
      const newNetworks = [
        ...net,
        <RipNetwork
          key={uniqueId}
          onDeleteClick={removeNetwork}
          id={uniqueId}
          activeDevice={activeDevice}
          setActiveDevice={setActiveDevice}
        />,
      ];
      console.log({ newNetworks });
      return newNetworks;
    });

    setActiveDevice((activeDevice: any) => {
      let ripNetworkArr = activeDevice.routing.rip.network;
      ripNetworkArr.push({
        id: uniqueId,
      });
      console.log({ ripNetworkArr });
      const newDevice = {
        ...activeDevice,
        routing: {
          ...activeDevice.routing,
          rip: {
            ...activeDevice.routing.rip,
            network: [...ripNetworkArr],
          },
        },
      };
      return newDevice;
    });
  };

  function removeNetwork(
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) {
    event.preventDefault();
    if (confirm('Are you sure you want to remove this network?')) {
      setNetworks((net: any) => {
        console.log({ id });
        const newNetworks = net.filter((elem: any) => elem.props.id !== id);
        console.log({ newNetworks });
        return [...newNetworks];
      });

      setActiveDevice((activeDevice: any) => {
        let ripNetworkArr = activeDevice.routing.rip.network;
        const filteredRipNetworkArr = ripNetworkArr.filter((elem: any) => {
          return elem.id !== id;
        });
        console.log({ filteredRipNetworkArr });

        const newDevice = {
          ...activeDevice,
          routing: {
            ...activeDevice.routing,
            rip: {
              ...activeDevice.routing.rip,
              network: filteredRipNetworkArr,
            },
          },
        };
        console.log({ newDevice });
        return newDevice;
      });
    }
  }

  const handleChange = (event: any) => {
    console.log(event.target.name);

    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    const propertyName = event.target.name;

    switch (propertyName) {
      case 'rip-conf':
        setActiveDevice((device: any) => {
          const newDevice = {
            ...device,
            routing: {
              ...device.routing,
              rip: {
                ...device.routing.rip,
                free: value,
              },
            },
          };
          return newDevice;
        });
        break;
      case 'directInRip':
        setDirectInRipConf(value);
        break;
      default:
        break;
    }
  };

  let component;

  if (directInRipConf === 'no') {
    component = (
      <>
        <div className="flex justify-end items-center px-5 sm:px-7">
          <button
            className="rounded-md bg-teal-600 hover:bg-teal-700 px-4 py-[6px] text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              addNewNetwork(e)
            }
          >
            Add Network
          </button>
        </div>
        {networks.length > 0 ? (
          networks
        ) : (
          <div className="mt-3 flex items-center justify-center text-center border-2 border-dashed rounded-md mx-4 px-2 py-4 text-sm text-gray-700 ">
            Click the 'Add Network' button to get started
          </div>
        )}
      </>
    );
  } else {
    component = (
      <div className="px-5 sm:px-7">
        <label htmlFor="rip-conf" className="block text-sm text-gray-800">
          Directly in <span className="font-semibold">ripd</span>
          .conf
        </label>
        <div className="mt-1 mb-2 ">
          <textarea
            className="resize-none"
            id="rip-conf"
            name="rip-conf"
            value={activeDevice.routing.rip.free}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </div>
    );
  }

  console.log(activeDevice.routing.rip);

  return (
    <>
      <div className="mt-8 mx-4 px-2 py-2 bg-teal-50 rounded-md flex justify-center items-center">
        <span className="text-teal-600 text-">RIP Configuration</span>
      </div>

      <div className="flex justify-between items-center px-5 sm:px-7 mt-2 mb-4">
        <span className="text-sm text-gray-800">
          Configure directly in conf file?
        </span>
        <div className="flex justify-center items-center ">
          <label>
            <input
              className="mr-[5px] rounded-full"
              type="radio"
              id="directInRip"
              value="yes"
              onChange={handleChange}
              checked={directInRipConf === 'yes'}
              name="directInRip"
            />
            <span className="text-sm text-gray-800 mr-4">Yes</span>
          </label>
          <label>
            <input
              className="mr-[5px] rounded-full"
              type="radio"
              id="directInRip"
              value="no"
              onChange={handleChange}
              checked={directInRipConf === 'no'}
              name="directInRip"
            />
            <span className="text-sm text-gray-800">No</span>
          </label>
        </div>
      </div>
      {component}
    </>
  );
};

const generateNetworkKey = () => {
  return `net_${new Date().getTime()}`;
};
const generateNeighborKey = () => {
  return `neighbor_${new Date().getTime()}`;
};

type BgpProps = {
  interfaces: [];
  activeDevice: any;
  setActiveDevice: React.Dispatch<any>;
};
export const BgpConfiguration: FC<BgpProps> = ({
  activeDevice,
  setActiveDevice,
}) => {
  const [directInBgpConf, setDirectInBgpConf] = useState('no');

  const [networks, setNetworks] = useState<any>(
    activeDevice.routing.bgp.network.map((elem: any) => {
      return (
        <BGPNetwork
          key={elem.id}
          onDeleteClick={removeNetwork}
          id={elem.id}
          activeDevice={activeDevice}
          setActiveDevice={setActiveDevice}
        />
      );
    })
  );
  const [neighbors, setNeighbors] = useState<any>(
    activeDevice.routing.bgp.remote.map((elem: any) => {
      return (
        <BGPNeighbor
          key={elem.id}
          onDeleteClick={removeNeighbor}
          id={elem.id}
          activeDevice={activeDevice}
          setActiveDevice={setActiveDevice}
        />
      );
    })
  );

  const addNewNetwork = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const uniqueId = generateNetworkKey();

    setNetworks((net: any) => {
      const newNetworks = [
        ...net,
        <BGPNetwork
          key={uniqueId}
          onDeleteClick={removeNetwork}
          id={uniqueId}
          activeDevice={activeDevice}
          setActiveDevice={setActiveDevice}
        />,
      ];
      console.log({ newNetworks });
      return newNetworks;
    });

    setActiveDevice((activeDevice: any) => {
      let bgpNetworkArr = activeDevice.routing.bgp.network;
      bgpNetworkArr.push({
        id: uniqueId,
      });
      console.log({ bgpNetworkArr });
      const newDevice = {
        ...activeDevice,
        routing: {
          ...activeDevice.routing,
          bgp: {
            ...activeDevice.routing.bgp,
            network: [...bgpNetworkArr],
          },
        },
      };
      return newDevice;
    });
  };

  function removeNetwork(
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) {
    event.preventDefault();
    if (confirm('Are you sure you want to remove this network?')) {
      setNetworks((net: any) => {
        console.log({ id });
        const newNetworks = net.filter((elem: any) => elem.props.id !== id);
        console.log({ newNetworks });
        return [...newNetworks];
      });

      setActiveDevice((activeDevice: any) => {
        let bgpNetworkArr = activeDevice.routing.bgp.network;
        const filteredBgpNetworkArr = bgpNetworkArr.filter((elem: any) => {
          return elem.id !== id;
        });
        console.log({ filteredBgpNetworkArr });

        const newDevice = {
          ...activeDevice,
          routing: {
            ...activeDevice.routing,
            bgp: {
              ...activeDevice.routing.bgp,
              network: filteredBgpNetworkArr,
            },
          },
        };
        console.log({ newDevice });
        return newDevice;
      });
    }
  }

  const addNewNeighbor = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const uniqueId = generateNeighborKey();

    setNeighbors((nb: any) => {
      const newNeighbors = [
        ...nb,
        <BGPNeighbor
          key={uniqueId}
          onDeleteClick={removeNeighbor}
          id={uniqueId}
          activeDevice={activeDevice}
          setActiveDevice={setActiveDevice}
        />,
      ];
      console.log({ newNeighbors });
      return newNeighbors;
    });

    setActiveDevice((activeDevice: any) => {
      console.log(`The active device in bgp network section is: `, {
        activeDevice,
      });

      let bgpNeighborArr = activeDevice.routing.bgp.remote;
      bgpNeighborArr.push({
        id: uniqueId,
      });
      console.log({ bgpNeighborArr });
      const newDevice = {
        ...activeDevice,
        routing: {
          ...activeDevice.routing,
          bgp: {
            ...activeDevice.routing.bgp,
            remote: [...bgpNeighborArr],
          },
        },
      };
      return newDevice;
    });
  };

  function removeNeighbor(
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) {
    event.preventDefault();
    if (confirm('Are you sure you want to remove this neighbor?')) {
      setNeighbors((nb: any) => {
        console.log({ id });
        const newNb = nb.filter((elem: any) => elem.props.id !== id);
        return [...newNb];
      });

      setActiveDevice((activeDevice: any) => {
        let bgpNeighborArr = activeDevice.routing.bgp.remote;
        const filteredBgpNeighborArr = bgpNeighborArr.filter((elem: any) => {
          return elem.id !== id;
        });
        console.log({ filteredBgpNeighborArr });

        const newDevice = {
          ...activeDevice,
          routing: {
            ...activeDevice.routing,
            bgp: {
              ...activeDevice.routing.bgp,
              remote: filteredBgpNeighborArr,
            },
          },
        };
        console.log({ newDevice });
        return newDevice;
      });
    }
  }

  const handleChange = (event: any) => {
    console.log(event.target.name);

    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    const propertyName = event.target.name;

    switch (propertyName) {
      case 'as':
        setActiveDevice((device: any) => {
          const newDevice = {
            ...device,
            routing: {
              ...device.routing,
              bgp: {
                ...device.routing.bgp,
                as: value,
              },
            },
          };
          return newDevice;
        });
        break;
      case 'bgp-conf':
        setActiveDevice((device: any) => {
          const newDevice = {
            ...device,
            routing: {
              ...device.routing,
              bgp: {
                ...device.routing.bgp,
                free: value,
              },
            },
          };
          return newDevice;
        });
        break;
      case 'direct':
        setDirectInBgpConf(value);
        break;

      default:
        break;
    }
  };

  let component;

  if (directInBgpConf === 'no') {
    component = (
      <>
        <label
          htmlFor="as"
          className="mt-1 px-5 sm:px-7 block text-sm text-gray-800"
        >
          AS
        </label>
        <div className="mt-1 mb-5 px-5 sm:px-7">
          <input
            type="text"
            id="as"
            name="as"
            placeholder="0"
            value={activeDevice.routing.bgp.as}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end items-center px-5 sm:px-7">
          <button
            className="rounded-md bg-teal-600 hover:bg-teal-700 px-4 py-[6px] text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              addNewNetwork(e)
            }
          >
            Add Network
          </button>
        </div>
        {networks.length > 0 ? (
          networks
        ) : (
          <div className="mt-3 flex items-center justify-center text-center border-2 border-dashed rounded-md mx-4 px-2 py-4 text-sm text-gray-700 ">
            Click the 'Add Network' button to get started
          </div>
        )}
        <div className="mt-5 flex justify-end items-center px-5 sm:px-7">
          <button
            className="rounded-md bg-teal-600 hover:bg-teal-700 px-4 py-[6px] text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              addNewNeighbor(e)
            }
          >
            Add Neighbor
          </button>
        </div>
        {neighbors.length > 0 ? (
          neighbors
        ) : (
          <div className="mt-3 flex items-center justify-center text-center border-2 border-dashed rounded-md mx-4 px-2 py-4 text-sm text-gray-700 ">
            Click the 'Add Neighbor' button to get started
          </div>
        )}
      </>
    );
  } else {
    component = (
      <div className="px-5 sm:px-7">
        <label htmlFor="bgp-conf" className="block text-sm text-gray-800">
          Directly in <span className="font-semibold">bgpd</span>
          .conf
        </label>
        <div className="mt-1 mb-2 ">
          <textarea
            className="resize-none"
            id="bgp-conf"
            name="bgp-conf"
            value={activeDevice.routing.bgp.free}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </div>
    );
  }

  console.log(activeDevice.routing.bgp);

  return (
    <>
      <div className="mt-8 mx-4 px-2 py-2 bg-teal-50 rounded-md flex justify-center items-center">
        <span className="text-teal-600 text-">BGP Configuration</span>
      </div>

      <div className="flex justify-between items-center px-5 sm:px-7 mt-2 mb-4">
        <span className="text-sm text-gray-800">
          Configure directly in conf file?
        </span>
        <div className="flex justify-center items-center ">
          <label>
            <input
              className="mr-[5px] rounded-full"
              type="radio"
              id="direct"
              value="yes"
              onChange={handleChange}
              checked={directInBgpConf === 'yes'}
              name="direct"
            />
            <span className="text-sm text-gray-800 mr-4">Yes</span>
          </label>
          <label>
            <input
              className="mr-[5px] rounded-full"
              type="radio"
              id="direct"
              value="no"
              onChange={handleChange}
              checked={directInBgpConf === 'no'}
              name="direct"
            />
            <span className="text-sm text-gray-800">No</span>
          </label>
        </div>
      </div>
      {component}
    </>
  );
};

type BGPNetworkProps = {
  onDeleteClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
  id: string;
  activeDevice: any;
  setActiveDevice: React.Dispatch<any>;
};

export const BGPNetwork: FC<BGPNetworkProps> = ({
  onDeleteClick,
  id,
  activeDevice,
  setActiveDevice,
}) => {
  const [bgpNetwork, setBgpNetwork] = useState(
    activeDevice.routing.bgp.network.find((elem: any) => elem.id === id)
  );
  const handleChange = (event: any) => {
    console.log(event.target.name);

    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    const propertyName = event.target.name;

    switch (propertyName) {
      case 'network':
        setBgpNetwork({ ...bgpNetwork, ip: value });

        break;

      default:
        break;
    }
  };

  useEffect(() => {
    setActiveDevice((device: any) => {
      let filteredNetworksArr = device.routing.bgp.network.filter(
        (elem: any) => {
          return elem.id !== id;
        }
      );

      const newDevice = {
        ...device,
        routing: {
          ...device.routing,
          bgp: {
            ...device.routing.bgp,
            network: [...filteredNetworksArr, bgpNetwork],
          },
        },
      };
      return newDevice;
    });
  }, [bgpNetwork]);

  return (
    <div className="mt-3 border-2 border-dashed rounded-md mx-4 px-2 py-2">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full focus:outline-none">
              <div className="w-auto px-2 py-2 bg-teal-50 rounded-md flex justify-between items-center">
                <span className="text-teal-600">Network</span>
                <ChevronRightIcon
                  className={`${
                    open ? 'transform rotate-90' : ''
                  } w-5 h-5 text-teal-600`}
                />
              </div>
            </Disclosure.Button>
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Disclosure.Panel>
                <label
                  htmlFor="network"
                  className="mt-2 block text-sm text-gray-800"
                >
                  Network address
                </label>
                <div className="mt-1 mb-2">
                  <input
                    type="text"
                    id="network"
                    name="network"
                    placeholder="0.0.0.0/0"
                    // value={bgpNetwork.ip}
                    value={
                      typeof bgpNetwork !== 'undefined' ? bgpNetwork.ip : ''
                    }
                    onChange={(event) => handleChange(event)}
                  />
                </div>
                <div className="mt-4 mb-1.5">
                  <button
                    onClick={(event) => onDeleteClick(event, id)}
                    className="group flex items-center justify-center rounded-md bg-red-100 hover:bg-red-600 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <TrashIcon
                      className="h-5 w-5 mr-1.5 text-red-600 group-hover:text-white "
                      aria-hidden="true"
                    />
                    <span className="text-red-600 group-hover:text-white font-semibold">
                      Delete
                    </span>
                  </button>
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};

type BGPNeighborProps = {
  onDeleteClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
  id: string;
  activeDevice: any;
  setActiveDevice: React.Dispatch<any>;
};

export const BGPNeighbor: FC<BGPNeighborProps> = ({
  onDeleteClick,
  id,
  activeDevice,
  setActiveDevice,
}) => {
  const [bgpNeighbor, setBgpNeighbor] = useState(
    activeDevice.routing.bgp.remote.find((elem: any) => elem.id === id)
  );

  const handleChange = (event: any) => {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    const propertyName = event.target.name;

    console.log({ value });

    switch (propertyName) {
      case 'neighbor':
        setBgpNeighbor({ ...bgpNeighbor, neighbor: value });
        break;
      case 'remote-as':
        setBgpNeighbor({ ...bgpNeighbor, as: value });
        break;
      case 'desc':
        setBgpNeighbor({ ...bgpNeighbor, description: value });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setActiveDevice((device: any) => {
      let filteredNeighborsArr = device.routing.bgp.remote.filter(
        (elem: any) => {
          return elem.id !== id;
        }
      );

      const newDevice = {
        ...device,
        routing: {
          ...device.routing,
          bgp: {
            ...device.routing.bgp,
            remote: [...filteredNeighborsArr, bgpNeighbor],
          },
        },
      };
      return newDevice;
    });
  }, [bgpNeighbor]);

  console.log({ bgpNeighbor });

  return (
    <div className="mt-3 mb-4 mx-4 px-2 border-2 border-dashed rounded-md py-2">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full focus:outline-none">
              <div className="w-auto px-2 py-2 bg-teal-50 rounded-md flex justify-between items-center">
                <span className="text-teal-600">Neighbor</span>
                <ChevronRightIcon
                  className={`${
                    open ? 'transform rotate-90' : ''
                  } w-5 h-5 text-teal-600`}
                />
              </div>
            </Disclosure.Button>
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Disclosure.Panel>
                <label
                  htmlFor="neighbor"
                  className="mt-2 block text-sm text-gray-800"
                >
                  Neighbor network address
                </label>
                <div className="mt-1 mb-2">
                  <input
                    type="text"
                    id="neighbor"
                    name="neighbor"
                    placeholder="0.0.0.0/0"
                    value={
                      typeof bgpNeighbor !== 'undefined'
                        ? bgpNeighbor.neighbor
                        : ''
                    }
                    onChange={handleChange}
                  />
                </div>
                <label
                  htmlFor="remote-as"
                  className="mt-2 block text-sm text-gray-800"
                >
                  Remote AS
                </label>
                <div className="mt-1 mb-2">
                  <input
                    type="text"
                    id="remote-as"
                    name="remote-as"
                    placeholder="0"
                    value={
                      typeof bgpNeighbor !== 'undefined' ? bgpNeighbor.as : ''
                    }
                    onChange={handleChange}
                  />
                </div>
                <label
                  htmlFor="desc"
                  className="mt-2 block text-sm text-gray-800"
                >
                  Description
                </label>
                <div className="mt-1 mb-2">
                  <input
                    type="text"
                    id="desc"
                    name="desc"
                    placeholder=""
                    value={
                      typeof bgpNeighbor !== 'undefined'
                        ? bgpNeighbor.description
                        : ''
                    }
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-4 mb-1.5">
                  <button
                    onClick={(event) => onDeleteClick(event, id)}
                    className="group flex items-center justify-center rounded-md bg-red-100 hover:bg-red-600 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <TrashIcon
                      className="h-5 w-5 mr-1.5 text-red-600 group-hover:text-white "
                      aria-hidden="true"
                    />
                    <span className="text-red-600 group-hover:text-white font-semibold">
                      Delete
                    </span>
                  </button>
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};
