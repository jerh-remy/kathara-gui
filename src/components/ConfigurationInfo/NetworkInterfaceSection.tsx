import React, { FC, useState } from 'react';
import { Disclosure, Transition } from '@headlessui/react';

import { toTitleCase } from '../../utilities/utilities';
import { Heading2 } from '../Heading2';
import { ChevronRightIcon } from '@heroicons/react/outline';

type Props = {
  activeDevice: any;
  setActiveDevice: React.Dispatch<any>;
  interfaces: [];
};

export const NetworkInterfaceSection: FC<Props> = ({
  activeDevice,
  setActiveDevice,
  interfaces,
}) => {
  const [intfs] = useState(interfaces);
  const [directInStartup, setDirectInStartup] = useState('no');

  const handleChange = (event: any, interfaceNo?: any) => {
    console.log(event.target.name);

    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    const propertyName = event.target.name;

    switch (propertyName) {
      case 'domain':
        setActiveDevice((device: any) => {
          let filteredInterfaceArr = device.interfaces.if.filter(
            (intf: any) => {
              return intf.eth.number !== interfaceNo;
            }
          );
          const newDevice = {
            ...device,
            interfaces: {
              ...device.interfaces,
              if: [
                ...filteredInterfaceArr,
                {
                  eth: {
                    number: interfaceNo,
                    domain: value,
                  },
                  ip: '',
                },
              ],
            },
          };
          return newDevice;
        });
        break;
      case 'direct-startup':
        setDirectInStartup(value);
        break;
      case 'startup':
        setActiveDevice((device: any) => {
          const newDevice = {
            ...device,
            interfaces: {
              ...device.interfaces,
              ['free']: value,
            },
          };
          return newDevice;
        });
        break;

      default:
        break;
    }
  };

  console.log({ activeDevice });

  let component;

  if (directInStartup === 'no') {
    component =
      intfs.length > 0 ? (
        intfs.map((intf) => (
          <NetworkInterface
            key={intf}
            interfaceNo={intf}
            activeDevice={activeDevice}
            setActiveDevice={setActiveDevice}
          />
        ))
      ) : (
        <div className="mt-2 flex items-center justify-center text-center border-2 border-dashed rounded-md mx-4 px-2 py-4 text-sm text-gray-700 ">
          Connect an interface to another device to get started
        </div>
      );
  } else {
    component = (
      <div className="px-4 sm:px-6">
        <label htmlFor="startup" className="block text-sm text-gray-800">
          Directly in <span className="font-semibold">{activeDevice.name}</span>
          .startup
        </label>
        <div className="mt-1 mb-2 ">
          <textarea
            className="resize-none"
            id="startup"
            name="startup"
            value={activeDevice.interfaces.free}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 sm:px-6">
        <Heading2 text="Network Interfaces" />
      </div>
      <div className="flex justify-between items-center px-4 sm:px-6 mt-2 mb-4">
        <span className="text-sm text-gray-800">
          Configure directly in startup file?
        </span>
        <div className="flex justify-center items-center ">
          <label>
            <input
              className="mr-[5px] rounded-full"
              type="radio"
              id="direct-startup"
              value="yes"
              onChange={handleChange}
              checked={directInStartup === 'yes'}
              name="direct-startup"
            />
            <span className="text-sm text-gray-800 mr-4">Yes</span>
          </label>
          <label>
            <input
              className="mr-[5px] rounded-full"
              type="radio"
              id="direct-startup"
              value="no"
              onChange={handleChange}
              checked={directInStartup === 'no'}
              name="direct-startup"
            />
            <span className="text-sm text-gray-800">No</span>
          </label>
        </div>
      </div>
      {component}
    </>
  );
};

type NetworkInterfaceProps = {
  interfaceNo: any;
  activeDevice: any;
  setActiveDevice: React.Dispatch<any>;
};

export const NetworkInterface: FC<NetworkInterfaceProps> = ({
  interfaceNo,
  activeDevice,
  setActiveDevice,
}) => {
  const interfaceNumberDigit = interfaceNo[interfaceNo.length - 1];
  // const [device] = useState(activeDevice);

  const handleChange = (event: any, interfaceNo?: any) => {
    console.log(event.target.name);

    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    const propertyName = event.target.name;

    switch (propertyName) {
      case 'domain':
        setActiveDevice((activeDevice: any) => {
          let filteredInterfaceArr = activeDevice.interfaces.if.filter(
            (intf: any) => {
              return intf.eth.number !== interfaceNo;
            }
          );
          const newDevice = {
            ...activeDevice,
            interfaces: {
              ...activeDevice.interfaces,
              if: [
                ...filteredInterfaceArr,
                {
                  eth: {
                    number: interfaceNo,
                    domain: value,
                  },
                },
              ],
            },
          };
          return newDevice;
        });
        break;
      case 'ip-address':
        setActiveDevice((activeDevice: any) => {
          let filteredInterfaceArr = activeDevice.interfaces.if.filter(
            (intf: any) => {
              return intf.eth.number !== interfaceNo;
            }
          );

          let networkIntf = activeDevice.interfaces.if.find(
            (intf: any) => intf.eth.number === parseInt(interfaceNo)
          );

          networkIntf.eth.ip = value;

          const newDevice = {
            ...activeDevice,
            interfaces: {
              ...activeDevice.interfaces,
              if: [
                ...filteredInterfaceArr,
                {
                  ...networkIntf,
                },
              ],
            },
          };
          return newDevice;
        });
        break;
      case 'dns':
        setActiveDevice((activeDevice: any) => {
          let filteredInterfaceArr = activeDevice.interfaces.if.filter(
            (intf: any) => {
              return intf.eth.number !== interfaceNo;
            }
          );

          let networkIntf = activeDevice.interfaces.if.find(
            (intf: any) => intf.eth.number === parseInt(interfaceNo)
          );

          networkIntf.dns = value;

          const newDevice = {
            ...activeDevice,
            interfaces: {
              ...activeDevice.interfaces,
              if: [
                ...filteredInterfaceArr,
                {
                  ...networkIntf,
                },
              ],
            },
          };
          return newDevice;
        });
        break;

      default:
        break;
    }
  };

  let networkIntf = activeDevice.interfaces.if.find(
    (intf: any) => intf.eth.number === parseInt(interfaceNumberDigit)
  );
  console.log(typeof networkIntf);
  console.log({ activeDevice });

  return (
    <div className="mt-2 mb-4 border-2 border-dashed rounded-md mx-4 px-2 py-2">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full focus:outline-none">
              <div className="w-auto px-2 py-2 bg-teal-50 rounded-md flex justify-between items-center">
                <span className="text-teal-600">
                  {toTitleCase(interfaceNo)}
                </span>
                <ChevronRightIcon
                  className={`${
                    open ? 'transform rotate-90' : ''
                  } w-5 h-5 text-teal-600`}
                />
              </div>
            </Disclosure.Button>
            <Transition
              enter="transition duration-200 ease-in-out"
              enterFrom="transform scale-95 opacity-70"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-150 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-70"
            >
              <Disclosure.Panel>
                <label
                  htmlFor="domain"
                  className="mt-2 block text-sm text-gray-800"
                >
                  {`${toTitleCase(interfaceNo)} collision domain`}
                </label>
                <div className="mt-1 mb-2">
                  <input
                    type="text"
                    id="domain"
                    name="domain"
                    value={
                      typeof networkIntf !== 'undefined'
                        ? networkIntf.eth.domain
                        : ''
                    }
                    onChange={(event) =>
                      handleChange(event, parseInt(interfaceNumberDigit))
                    }
                    placeholder="A"
                  />
                </div>
                <label
                  htmlFor="ip-address"
                  className="block text-sm text-gray-800"
                >
                  IP address/Net
                </label>
                <div className="mt-1 mb-2">
                  <input
                    type="text"
                    id="ip-address"
                    name="ip-address"
                    placeholder="0.0.0.0/0"
                    // pattern="(^$)|(((^|\.)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]?\d))){4}/[0-9]+$)"
                    value={
                      typeof networkIntf !== 'undefined'
                        ? networkIntf.eth.ip
                        : ''
                    }
                    onChange={(event) =>
                      handleChange(event, parseInt(interfaceNumberDigit))
                    }
                  />
                </div>
                <label htmlFor="dns" className="block text-sm text-gray-800">
                  Complete DNS name
                </label>
                <div className="mt-1 mb-2">
                  <input
                    type="text"
                    id="dns"
                    name="dns"
                    placeholder="www.x.y or ROOT-SERVER"
                    value={
                      typeof networkIntf !== 'undefined' ? networkIntf.dns : ''
                    }
                    onChange={(event) =>
                      handleChange(event, parseInt(interfaceNumberDigit))
                    }
                  />
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};
