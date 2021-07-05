import React, { FC, useState } from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { KatharaConfigProvider } from '../contexts/katharaConfigContext';
import { DeviceSelectionColumn } from './DeviceSelectionColumn';
import { Workspace } from './Workspace';
import { Navbar } from './Navbar';
import { Statusbar } from './Statusbar';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
  error: any;
};
export const ErrorFallback: FC<Props> = ({ error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

export const Home = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <KatharaConfigProvider>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
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
        </ErrorBoundary>
      </KatharaConfigProvider>
    </>
  );
};
