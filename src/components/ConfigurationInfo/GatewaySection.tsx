import React, { FC, useEffect, useState } from 'react';
import { ChevronRightIcon, TrashIcon } from '@heroicons/react/outline';
import { Heading2 } from '../Heading2';
import { Disclosure, Transition } from '@headlessui/react';

const generateKey = () => {
  return `gw_${new Date().getTime()}`;
};

type Props = {
  interfaces: [];
  activeDevice: any;
  setActiveDevice: React.Dispatch<any>;
};
export const GatewaySection: FC<Props> = ({
  interfaces,
  activeDevice,
  setActiveDevice,
}) => {
  // console.log({ interfaces });
  const [gateways, setGateways] = useState<any>(
    activeDevice.gateways.gw.map((elem: any) => {
      return (
        <Gateway
          key={elem.id}
          onDeleteClick={removeGateway}
          id={elem.id}
          interfaces={interfaces}
          activeDevice={activeDevice}
          setActiveDevice={setActiveDevice}
        />
      );
    })
  );

  const addNewGateway = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const uniqueId = generateKey();

    setGateways((gw: any) => {
      const newGateways = [
        ...gw,
        <Gateway
          key={uniqueId}
          onDeleteClick={removeGateway}
          id={uniqueId}
          interfaces={interfaces}
          activeDevice={activeDevice}
          setActiveDevice={setActiveDevice}
        />,
      ];
      console.log({ newGateways });
      return newGateways;
    });

    setActiveDevice((activeDevice: any) => {
      console.log(`The active device in gateway section is: `, {
        activeDevice,
      });

      let gatewayArr = activeDevice.gateways.gw;
      gatewayArr.push({
        id: uniqueId,
      });
      console.log({ gatewayArr });
      const newDevice = {
        ...activeDevice,
        gateways: {
          gw: gatewayArr,
        },
      };
      return newDevice;
    });
  };

  function removeGateway(
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) {
    event.preventDefault();
    if (confirm('Are you sure you want to remove this gateway?')) {
      setGateways((gw: any) => {
        console.log({ id });
        const newGw = gw.filter((elem: any) => elem.props.id !== id);
        return [...newGw];
      });

      setActiveDevice((activeDevice: any) => {
        let gatewayArr = activeDevice.gateways.gw;
        const filteredGatewayArr = gatewayArr.filter((elem: any) => {
          return elem.id !== id;
        });

        console.log({ filteredGatewayArr });
        const newDevice = {
          ...activeDevice,
          gateways: {
            gw: [...filteredGatewayArr],
          },
        };
        console.log({ newDevice });
        return newDevice;
      });
    }
  }

  return (
    <>
      <div className="flex justify-between items-center px-5 sm:px-7">
        <Heading2 text="Gateway (static)" />
        <button
          className="rounded-md bg-teal-600 hover:bg-teal-700 px-4 py-[6px] text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => addNewGateway(e)}
        >
          Add Gateway
        </button>
      </div>
      {gateways.length > 0 ? (
        gateways
      ) : (
        <div className="mt-4 flex items-center justify-center text-center border-2 border-dashed rounded-md mx-4 px-2 py-4 text-sm text-gray-700 ">
          Click the 'Add Gateway' button to get started
        </div>
      )}
    </>
  );
};

type GatewayProps = {
  onDeleteClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
  id: string;
  interfaces: [];
  activeDevice: any;
  setActiveDevice: React.Dispatch<any>;
};

export const Gateway: FC<GatewayProps> = ({
  onDeleteClick,
  id,
  interfaces,
  activeDevice,
  setActiveDevice,
}) => {
  console.log({ id });
  const [gateway, setGateway] = useState(
    activeDevice.gateways.gw.find((elem: any) => elem.id === id)
  );

  // let gateway = activeDevice.gateways.gw.find((elem: any) => elem.id === id);
  console.log(`THE TYPE OF GATEWAY IS: ${typeof gateway}`, { gateway });
  // console.log({ activeDevice });

  const handleChange = (event: any) => {
    console.log(event.target.name);

    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    const propertyName = event.target.name;

    switch (propertyName) {
      case 'static-route':
        setGateway({ ...gateway, route: value });
        // setGateway((elem: any) => {
        //   const newGw = { ...elem, route: value };
        //   return newGw;
        // });

        break;
      case 'gateway':
        setGateway({ ...gateway, gw: value });

        // setGateway((elem: any) => {
        //   const newGw = { ...elem, gw: value };
        //   return newGw;
        // });

        break;
      case 'interface':
        console.log({ value });

        setGateway({ ...gateway, if: value });

        // setGateway((elem: any) => {
        //   const newGw = { ...elem, if: value };
        //   return newGw;
        // });

        break;

      default:
        break;
    }
  };

  useEffect(() => {
    setActiveDevice((device: any) => {
      let filteredGatewaysArr = device.gateways.gw.filter((elem: any) => {
        return elem.id !== id;
      });

      const newDevice = {
        ...device,
        gateways: {
          gw: [...filteredGatewaysArr, gateway],
        },
      };
      return newDevice;
    });
  }, [gateway]);

  return (
    <div className="mt-4 border-2 border-dashed rounded-md mx-4 px-2 py-2">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full focus:outline-none">
              <div className="w-auto px-2 py-2 bg-teal-50 rounded-md flex justify-between items-center">
                <span className="text-teal-600">Gateway</span>
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
                  htmlFor="static-route"
                  className="mt-2 block text-sm text-gray-800"
                >
                  Route (leave empty for default gateway)
                </label>
                <div className="mt-1 mb-2">
                  <input
                    type="text"
                    id="static-route"
                    name="static-route"
                    placeholder="0.0.0.0/0"
                    value={typeof gateway !== 'undefined' ? gateway.route : ''}
                    // value={gateway.route}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="gateway"
                    className="block text-sm text-gray-800"
                  >
                    Gateway (leave empty to generate nothing)
                  </label>
                  <div className="mt-1 mb-2">
                    <input
                      type="text"
                      id="gateway"
                      name="gateway"
                      placeholder="0.0.0.0"
                      value={typeof gateway !== 'undefined' ? gateway.gw : ''}
                      // value={gateway.gw}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="interface"
                    className="block text-sm text-gray-800"
                  >
                    Interface
                  </label>
                  <div className="mt-1 mb-2">
                    <select
                      name="interface"
                      onChange={handleChange}
                      value={gateway.if}
                    >
                      {interfaces.map((intf) => {
                        return (
                          <option key={intf} value={intf}>
                            {intf}
                          </option>
                        );
                      })}
                    </select>
                  </div>
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
