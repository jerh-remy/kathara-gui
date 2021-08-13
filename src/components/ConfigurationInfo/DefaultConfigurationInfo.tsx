import React, { FC, useEffect, useState } from 'react';

import { useKatharaConfig } from '../../contexts/katharaConfigContext';
import { AdditionalFunctions } from './AdditionalFunctions';
import { GatewaySection } from './GatewaySection';
import { NetworkInterfaceSection } from './NetworkInterfaceSection';
import { sortInterfacesString } from '../../utilities/utilities';
import { Heading2 } from '../Heading2';

type Props = {
  device: any;
  interfaces: [];
};
export const DefaultConfigurationInfo: FC<Props> = ({ device, interfaces }) => {
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

  useEffect(() => {
    setKatharaConfig((config: any) => {
      let filteredMachines = config.machines.filter((machine: any) => {
        return machine.id !== activeDevice.id;
      });

      return {
        ...config,
        machines: [...filteredMachines, activeDevice],
      };
    });

    console.log({ activeDevice }, { katharaConfig });
  }, [activeDevice]);

  return (
    <div className="mt-4 mb-4">
      <form className="space-y-8">
        <div className="px-5 sm:px-7">
          <Heading2 text={`Machine Information (${device.data.deviceType})`} />
          <label htmlFor="name" className="mt-1 block text-sm text-gray-800">
            Device name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              name="name"
              value={activeDevice.name}
              onChange={handleChange}
              placeholder={`${device.data.deviceType}1`}
            />
          </div>
        </div>
        <div>
          <NetworkInterfaceSection
            activeDevice={activeDevice}
            setActiveDevice={setActiveDevice}
            interfaces={sortInterfacesString(interfaces)}
          />
        </div>
        <div>
          <GatewaySection
            activeDevice={activeDevice}
            setActiveDevice={setActiveDevice}
            interfaces={sortInterfacesString(interfaces)}
          />
        </div>
        <AdditionalFunctions
          device={device}
          activeDevice={activeDevice}
          setActiveDevice={setActiveDevice}
          interfaces={sortInterfacesString(interfaces)}
        />

        <div className="invisible">
          <p>Should not require this workaround</p>
        </div>
      </form>
    </div>
  );
};
