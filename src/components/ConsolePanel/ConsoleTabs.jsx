import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Terminal from './Terminal';
import '../../App.global.css';

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
        {/* <Tab>Output 2</Tab> */}
      </TabList>

      <TabPanel>
        <Terminal size={terminalSize} />
      </TabPanel>
      {/* <TabPanel>
        <Terminal size={terminalSize} />
      </TabPanel> */}
    </Tabs>
  );
};
