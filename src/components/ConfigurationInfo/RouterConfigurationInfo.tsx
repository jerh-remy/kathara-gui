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
    isis: false,
    bgp: false,
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
        break;
      case 'bgp':
        setDynamicRouting({
          ...dynamicRouting,
          [propertyName]: value,
        });
        break;

      default:
        break;
    }
  };

  return (
    <>
      <div className="px-4 sm:px-6">
        <Heading2 text="Additional functions" />
      </div>
      <div className="px-4 sm:px-6 mt-1 mb-2 flex justify-between items-center">
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
        </div>
      </div>

      {!dynamicRouting.isis && !dynamicRouting.bgp && (
        <MessageWithBorder message="Configure IS-IS and/or BGP on this router" />
      )}

      {dynamicRouting.isis && <IsisConfiguration interfaces={interfaces} />}
      {dynamicRouting.bgp && (
        <BgpConfiguration
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
  // activeDevice: any;
  // setActiveDevice: React.Dispatch<any>;
};

export const IsisConfiguration: FC<IsisProps> = ({ interfaces }) => {
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
            console.log({ intf });
            return (
              <label
                key={intf}
                className="mb-[6px] mr-3 flex justify-center items-center rounded-lg border border-1 px-2 py-2"
              >
                <input
                  className="mr-[5px] mt-[1.5px]"
                  type="checkbox"
                  value={intf}
                  // onChange={handleChange}
                  // checked={directInStartup === 'yes'}
                  name="direct-startup"
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

  return (
    <>
      <div className="mt-6 mx-4 px-2 py-2 bg-teal-50 rounded-md flex justify-center items-center">
        <span className="text-teal-600 text-">IS-IS Configuration</span>
      </div>
      <div className="mt-2 mb-4 mx-4 px-2 border-2 border-dashed rounded-md py-2">
        <label htmlFor="as" className="block text-sm text-gray-800">
          Loopback address/Net
        </label>
        <div className="mt-1 mb-2">
          <input
            type="text"
            id="as"
            name="as"
            placeholder="0.0.0.0/0"
            // pattern="(^$)|(((^|\.)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]?\d))){4}/[0-9]+$)"
          />
        </div>
        <label htmlFor="afi" className="block text-sm text-gray-800">
          Authority and Format ID (AFI)
        </label>
        <div className="mt-1 mb-2">
          <input type="text" id="afi" name="afi" placeholder="49" />
        </div>
        <label htmlFor="domain" className="mt-2 block text-sm text-gray-800">
          Area ID
        </label>
        <div className="mt-1 mb-2">
          <input type="text" id="domain" name="domain" placeholder="0001" />
        </div>
        {interfaceSelectionSection}
      </div>
    </>
  );
};

type BgpProps = {
  interfaces: [];
  activeDevice: any;
  setActiveDevice: React.Dispatch<any>;
};
export const BgpConfiguration: FC<BgpProps> = ({
  interfaces,
  activeDevice,
  setActiveDevice,
}) => {
  const [directInConf, setDirectInConf] = useState('no');

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
      case 'direct':
        setDirectInConf(value);
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

  let component;

  if (directInConf === 'no') {
    component = (
      <div className="mt-2 mb-4 mx-4 px-2 border-2 border-dashed rounded-md py-2">
        <label htmlFor="as" className="block text-sm text-gray-800">
          AS
        </label>
        <div className="mt-1 mb-2">
          <input
            type="text"
            id="as"
            name="as"
            placeholder="0"
            // pattern="(^$)|(((^|\.)((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]?\d))){4}/[0-9]+$)"
          />
        </div>
        <label htmlFor="afi" className="block text-sm text-gray-800">
          Network
        </label>
        <div className="mt-1 mb-2">
          <input type="text" id="afi" name="afi" placeholder="49" />
        </div>
        <label htmlFor="domain" className="mt-2 block text-sm text-gray-800">
          Neighbor
        </label>
        <div className="mt-1 mb-2">
          <input type="text" id="domain" name="domain" placeholder="0001" />
        </div>
      </div>
    );
  } else {
    component = (
      <div className="px-4 sm:px-6">
        <label htmlFor="startup" className="block text-sm text-gray-800">
          Directly in <span className="font-semibold">bgpd</span>
          .conf
        </label>
        <div className="mt-1 mb-2 ">
          <textarea
            className="resize-none"
            id="startup"
            name="startup"
            value={activeDevice.routing.bgp.free}
            onChange={handleChange}
            rows={4}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 mx-4 px-2 py-2 bg-teal-50 rounded-md flex justify-center items-center">
        <span className="text-teal-600 text-">BGP Configuration</span>
      </div>

      <div className="flex justify-between items-center px-4 sm:px-6 mt-2 mb-4">
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
              checked={directInConf === 'yes'}
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
              checked={directInConf === 'no'}
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
