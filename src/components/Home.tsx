import React, { useState } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { ConfigurationPanel } from './ConfigurationPanel';
import { DeviceSelectionColumn } from './DeviceSelectionColumn';
import DnDFlow from './DndFlow';
import { EditorCanvasColumn } from './EditorCanvasColumn';
import { Navbar } from './Navbar';
import OverviewFlow from './OverviewFlow';
import Sidebar from './Sidebar/Sidebar';

export const Home = () => {
  const [open, setOpen] = useState(false);
  const [activeDevice, setActiveDevice] = useState();

  const onDeviceClicked = (device: any) => {
    console.log({ device });
    setActiveDevice(device);
  };

  return (
    <>
      <div className="flex flex-col h-screen overflow-y-hidden">
        <Navbar />
        <div className="flex flex-1">
          <ReactFlowProvider>
            <DeviceSelectionColumn />
            {/* <OverviewFlow /> */}
            {/* <DnDFlow /> */}
            <EditorCanvasColumn
              openConfigurationPanel={setOpen}
              onDeviceClicked={onDeviceClicked}
            />
            <ConfigurationPanel
              isOpen={open}
              setOpen={setOpen}
              activeDevice={activeDevice}
            />
          </ReactFlowProvider>
        </div>
      </div>
    </>
  );
};
