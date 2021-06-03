import React from 'react';
import { ReactFlowProvider } from 'react-flow-renderer';
import { DeviceSelectionColumn } from './DeviceSelectionColumn';
import DnDFlow from './DndFlow';
import { EditorCanvasColumn } from './EditorCanvasColumn';
import { Navbar } from './Navbar';
import OverviewFlow from './OverviewFlow';
import Sidebar from './Sidebar/Sidebar';

export const Home = () => {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1">
          <ReactFlowProvider>
            <DeviceSelectionColumn />
            {/* <OverviewFlow /> */}
            {/* <DnDFlow /> */}
            <EditorCanvasColumn />
          </ReactFlowProvider>
        </div>
      </div>
    </>
  );
};
