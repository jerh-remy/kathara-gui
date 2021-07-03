import React, { useState } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { KatharaConfigProvider } from '../contexts/katharaConfigContext';
import { DeviceSelectionColumn } from './DeviceSelectionColumn';
import { Workspace } from './Workspace';
import { Navbar } from './Navbar';
import { Statusbar } from './Statusbar';

export const Home = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <KatharaConfigProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex flex-1">
            <DeviceSelectionColumn />
            <Workspace
              openConfigurationPanel={setOpen}
              isConfigurationPanelOpen={open}
            />
          </div>
          <Statusbar />
        </div>
      </KatharaConfigProvider>
    </>
  );
};
