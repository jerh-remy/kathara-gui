import React, { useState } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { KatharaConfigProvider } from '../contexts/katharaConfigContext';
import { ConfigurationPanel } from './ConfigurationPanel';
import { DeviceSelectionColumn } from './DeviceSelectionColumn';
import { EditorCanvasColumn } from './EditorCanvasColumn';
import { Navbar } from './Navbar';

export const Home = () => {
  const [open, setOpen] = useState(false);
  const [activeDevice, setActiveDevice] = useState();

  const onDeviceClicked = (device: any) => {
    console.log({ device });
    setActiveDevice(device);
  };

  console.log({ activeDevice });

  return (
    <>
      <div className="flex flex-col h-screen overflow-y-hidden">
        <Navbar />
        <div className="flex flex-1">
          <KatharaConfigProvider>
            <DeviceSelectionColumn />
            <EditorCanvasColumn
              openConfigurationPanel={setOpen}
              isConfigurationPanelOpen={open}
              onDeviceClicked={onDeviceClicked}
              activeDevice={activeDevice}
              setActiveDevice={setActiveDevice}
            />
            {/* <ConfigurationPanel
              isOpen={open}
              setOpen={setOpen}
              activeDevice={activeDevice}
              setActiveDevice={setActiveDevice}
            /> */}
          </KatharaConfigProvider>
        </div>
      </div>
    </>
  );
};
