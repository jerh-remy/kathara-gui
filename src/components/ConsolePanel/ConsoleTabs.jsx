import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import MyTerminal from './Terminal';
import '../../App.global.css';
import { LabInfo } from '../LabInfo';

export const ConsoleTabs = ({ terminalSize }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Tabs
      forceRenderTabPanel={true}
      selectedIndex={tabIndex}
      onSelect={(index) => setTabIndex(index)}
    >
      <TabList>
        <Tab>Output</Tab>
        <Tab>Output 2</Tab>
        {/* <Tab>Output 3</Tab> */}
      </TabList>

      <TabPanel>
        <MyTerminal size={terminalSize} />
      </TabPanel>
      <TabPanel>
        <MyTerminal size={terminalSize} />
      </TabPanel>
      {/* <TabPanel>
        <Terminal size={terminalSize} />
      </TabPanel> */}
    </Tabs>
  );
};
