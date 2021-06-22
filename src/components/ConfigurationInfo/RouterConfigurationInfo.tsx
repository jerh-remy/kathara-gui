import React, { FC, useEffect, useState } from 'react';
import {
  useStoreState,
  useStoreActions,
  ReactFlowProps,
  Elements,
} from 'react-flow-renderer';
import { useKatharaConfig } from '../../contexts/katharaConfigContext';
import { Heading2 } from '../Heading2';

type Props = {
  device: any;
};
export const RouterConfigurationInfo: FC<Props> = ({ device }) => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const [activeDevice, setActiveDevice] = useState(
    katharaConfig.machines.find((machine: any) => machine.id === device.id)
  );

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
            <span className="text-sm text-gray-800">isis</span>
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
            <span className="text-sm text-gray-800">bgp</span>
          </label>
        </div>
      </div>

      {!dynamicRouting.isis && !dynamicRouting.bgp && (
        <div className="mt-4 flex items-center justify-center text-center border-2 border-dashed rounded-md mx-4 px-2 py-4 text-sm text-gray-700 ">
          Configure IS-IS and/or BGP on this router
        </div>
      )}

      {dynamicRouting.isis && <IsisConfiguration />}
      {dynamicRouting.bgp && <BgpConfiguration />}
    </>
  );
};

export const IsisConfiguration = () => {
  return (
    <>
      <div className="mt-6 mx-4 px-2 py-2 bg-teal-50 rounded-md flex justify-center items-center">
        <span className="text-teal-600 text-">IS-IS Configuration</span>
      </div>
      <div className="mt-2 mb-4 mx-4 px-2 border-2 border-dashed rounded-md py-2">
        <label
          htmlFor="loopback-address"
          className="block text-sm text-gray-800"
        >
          Loopback address/Net
        </label>
        <div className="mt-1 mb-2">
          <input
            type="text"
            id="loopback-address"
            name="loopback-address"
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
        <label
          htmlFor="interfaces"
          className="mt-2 mb-[6px] block text-sm text-gray-800"
        >
          Select interfaces to be configured
        </label>
        <div className="flex flex-wrap">
          {[1, 2, 3, 4, 5].map((el) => {
            console.log({ el });
            return (
              // <li key={el}>
              <label
                key={el}
                className="mb-[6px] mx-1 flex justify-center items-center rounded-lg border border-1 px-2 py-2"
              >
                <input
                  className="mr-[5px] mt-[1px]"
                  type="checkbox"
                  value="yes"
                  // onChange={handleChange}
                  // checked={directInStartup === 'yes'}
                  name="direct-startup"
                />
                <span className="text-sm text-gray-800">{`Yes ${el}`}</span>
              </label>
              // </li>
            );
          })}
        </div>
      </div>
    </>
  );
};
export const BgpConfiguration = () => {
  return (
    <>
      <div className="mt-10 mx-4 px-2 py-2 bg-teal-50 rounded-md flex justify-center items-center">
        <span className="text-teal-600 text-">BGP Configuration</span>
      </div>
      <div className="mt-2 mb-4 mx-4 px-2 border-2 border-dashed rounded-md py-2">
        <label
          htmlFor="loopback-address"
          className="block text-sm text-gray-800"
        >
          Loopback address/Net
        </label>
        <div className="mt-1 mb-2">
          <input
            type="text"
            id="loopback-address"
            name="loopback-address"
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
      </div>
    </>
  );
};
