import React, { FC, useEffect, useState } from 'react';
import { useKatharaConfig } from '../../contexts/katharaConfigContext';
import { Heading2 } from '../Heading2';

type Props = {
  device: any;
  activeDevice: any;
};

export const WebServerConfigurationInfo: FC<Props> = ({
  device,
  activeDevice,
}) => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  // const [activeDevice, setActiveDevice] = useState(
  //   katharaConfig.machines.find((machine: any) => machine.id === device.id)
  // );

  console.log({ device }, { activeDevice });

  const [userdir, setUserDir] = useState<boolean>(
    katharaConfig.machines.find((machine: any) => {
      return machine.id === activeDevice.id;
    }).ws.userdir
  );
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.type);
    setUserDir(event.target.checked);
  }
  console.log({ userdir }, { katharaConfig });

  useEffect(() => {
    setKatharaConfig((config: any) => {
      let webServer = config.machines.find((machine: any) => {
        return machine.id === activeDevice.id;
      });
      const { ws, ...rest } = webServer;
      const newWebServer = {
        ...rest,
        ws: {
          userdir,
        },
      };
      console.log({ newWebServer });

      let filteredMachines = config.machines.filter((machine: any) => {
        return machine.id !== activeDevice.id;
      });
      // webServer.ws.userdir = userdir;

      return {
        ...config,
        machines: [...filteredMachines, newWebServer],
      };
    });
  }, [userdir]);

  return (
    <div>
      <div className="px-4 sm:px-6 mb-2">
        <Heading2 text="Additional functions" />
      </div>
      <label className="px-4 sm:px-6 mt-1 mb-3">
        <input
          className="mr-2"
          type="checkbox"
          id="userdir"
          name="userdir"
          onChange={handleChange}
          checked={userdir}
        />
        <p className="inline text-sm text-gray-800">
          Enable
          <span className="text-sm text-gray-900 font-semibold"> userdir </span>
          module
        </p>
      </label>
    </div>
  );
};
