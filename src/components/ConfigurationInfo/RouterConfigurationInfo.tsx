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

      default:
        break;
    }
  };

  return (
    <div>
      <Heading2 text="Additional functions" />
      <label htmlFor="ref-ns" className="mt-1 block text-sm text-gray-800">
        Dynamic routing
      </label>
      <div className="mt-1 flex justify-between">
        <div>
          <input type="checkbox" id="rip" name="rip" className="mr-2" />
          <span className="text-sm text-gray-800">rip</span>
        </div>
        <div>
          <input type="checkbox" id="ospf" name="ospf" className="mr-2" />
          <span className="text-sm text-gray-800">ospf</span>
        </div>
        <div>
          <input type="checkbox" id="bgp" name="bgp" className="mr-2" />
          <span className="text-sm text-gray-800">bgp</span>
        </div>
      </div>
    </div>
  );
};
