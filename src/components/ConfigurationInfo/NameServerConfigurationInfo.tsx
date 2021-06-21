import React, { FC, useEffect, useState } from 'react';
import { useKatharaConfig } from '../../contexts/katharaConfigContext';
import { Heading2 } from '../Heading2';

type Props = {
  device: any;
  activeDevice: any;
};
export const NameServerConfigurationInfo: FC<Props> = ({
  device,
  activeDevice,
}) => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();

  const [nameServer, setNameServer] = useState(
    katharaConfig.machines.find((machine: any) => {
      return machine.id === activeDevice.id;
    }).ns
  );

  console.log({ nameServer });
  console.log({ katharaConfig });

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.type);
    setNameServer((ns: any) => {
      const newNameServer = {
        ...ns,
        [event.target.name]: event.target.checked,
      };
      return newNameServer;
    });
  }

  useEffect(() => {
    setKatharaConfig((config: any) => {
      let oldNameServer = config.machines.find((machine: any) => {
        return machine.id === activeDevice.id;
      });
      const { ns, ...rest } = oldNameServer;
      console.log({ rest });
      const newNameServer = {
        ...rest,
        ns: {
          ...nameServer,
        },
      };
      console.log({ newNameServer });

      let filteredMachines = config.machines.filter((machine: any) => {
        return machine.id !== activeDevice.id;
      });

      return {
        ...config,
        machines: [...filteredMachines, newNameServer],
      };
    });
  }, [nameServer]);

  return (
    <div>
      <Heading2 text="Additional functions" />
      <div className="mt-1 mb-3">
        <input
          className="mr-2"
          type="checkbox"
          id="authority"
          onChange={handleChange}
          checked={nameServer.authority}
          name="authority"
        />
        <span className="text-sm text-gray-800">
          I am a Nameserver Authority
        </span>
      </div>
      {nameServer.authority && (
        <div>
          <label
            htmlFor="static-route"
            className="mt-1 block text-sm text-gray-800"
          >
            Zone (root is .)
          </label>
          <div className="mt-1 mb-1">
            <input type="text" id="zone" name="zone" placeholder=".com." />
          </div>
        </div>
      )}
      <div className="mb-2">
        <input
          className="mr-2"
          type="checkbox"
          id="recursion"
          onChange={handleChange}
          checked={nameServer.recursion}
          name="recursion"
        />
        <span className="text-sm text-gray-800">Enable recursive</span>
      </div>
    </div>
  );
};
