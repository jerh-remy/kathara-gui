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
  const [openConfigPanel, setOpenConfigPanel] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const onNewProjectCreate = () => {
    console.log('Creating new Project');
    setShowNewProjectModal(true);
  };

  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <KatharaConfigProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar
              showNewProjectModal={showNewProjectModal}
              setShowNewProjectModal={setShowNewProjectModal}
            />
            <div className="flex flex-1">
              <DeviceSelectionColumn />
              <ReactFlowProvider>
                <Workspace
                  openConfigurationPanel={setOpenConfigPanel}
                  isConfigurationPanelOpen={openConfigPanel}
                  onNewProjectCreate={onNewProjectCreate}
                />
              </ReactFlowProvider>
            </div>
            <Statusbar />
          </div>
        </KatharaConfigProvider>
      </ErrorBoundary>
    </>
  );
};
