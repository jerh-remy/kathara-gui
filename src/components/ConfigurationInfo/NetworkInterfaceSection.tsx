import React, { FC, useState } from 'react';
import { useStoreActions, useStoreState } from 'react-flow-renderer';
import { toTitleCase } from '../../utilities/utilities';
import { Heading2 } from '../Heading2';

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

  return (
    <>
      <div className="px-4 sm:px-6">
        <Heading2 text="Network Interfaces" />
      </div>
      {intfs.length > 0 ? (
        intfs.map((intf) => (
          <NetworkInterface
            key={intf}
            interfaceNo={intf}
            activeDevice={activeDevice}
            handleChange={handleChange}
          />
        ))
      ) : (
        <div className="mt-2 flex items-center justify-center text-center border-2 border-dashed rounded-md mx-4 px-2 py-4 text-sm text-gray-700 ">
          Connect an interface to another device to get started
        </div>
      )}
      <div className="px-4 sm:px-6 mt-4">
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
    </>
  );
};

type NetworkInterfaceProps = {
  interfaceNo: any;
  activeDevice: any;
  handleChange: (event: any, interfaceNo?: any) => void;
};

export const NetworkInterface: FC<NetworkInterfaceProps> = ({
  interfaceNo,
  activeDevice,
  handleChange,
}) => {
  const interfaceNumberDigit = interfaceNo[interfaceNo.length - 1];
  return (
    <div className="mt-2  mb-4 border-2 border-dashed rounded-md mx-4 px-2 py-2">
      <label htmlFor="domain" className="mt-1 block text-sm text-gray-800">
        {`${toTitleCase(interfaceNo)} collision domain`}
      </label>
      <div className="mt-1 mb-2">
        <input
          type="text"
          id="domain"
          name="domain"
          value={activeDevice.interfaces.if.find(
            (intf: any) => intf.eth.number === interfaceNumberDigit
          )}
          onChange={(event) => handleChange(event, interfaceNumberDigit)}
          placeholder="A"
        />
      </div>
      <label htmlFor="ip-address" className="block text-sm text-gray-800">
        IP address/Net
      </label>
      <div className="mt-1 mb-2">
        <input
          type="text"
          id="ip-address"
          name="ip-address"
          placeholder="0.0.0.0/0"
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
        />
      </div>
    </div>
  );
};
