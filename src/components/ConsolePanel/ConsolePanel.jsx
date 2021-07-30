import React, { useState, useEffect, useRef } from 'react';
import { Resizable } from 're-resizable';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { XIcon, MinusIcon } from '@heroicons/react/outline';

import MyTerminal from './Terminal';
import '../../App.global.css';

// const CustomTab = ({ children }) => <Tab>{children}</Tab>;

// CustomTab.tabsRole = 'Tab'; // Required field to use your custom Tab

export const ConsolePanel = ({ isOpen, setOpen, terminals }) => {
  const [size, setSize] = useState({
    width: '100%',
    height: '60vh',
  });
  const [tabIndex, setTabIndex] = useState(0);
  const [terminalTabs, setTerminalTabs] = useState([]);
  const [terminalPanels, setTerminalPanels] = useState([]);
  const resizableRef = useRef();

  useEffect(() => {
    setTerminalTabs(
      terminals.map((term) => {
        return (
          <Tab key={term.terminalId}>
            {/* <div className="w-auto flex justify-between items-center py-1"> */}
            {term.terminalTabName}
            {/* <XIcon className="ml-4 w-3 h-3 text-white cursor-pointer hover:bg-teal-500 hover:rounded-sm" /> */}
            {/* </div> */}
          </Tab>
        );
      })
    );
    setTerminalPanels(
      terminals.map((term) => {
        return (
          <TabPanel key={term.terminalId}>
            <MyTerminal size={size} deviceName={term.terminalTabName} />
          </TabPanel>
        );
      })
    );
    // switch to the most recently added tab
    setTabIndex(terminals.length - 1);
  }, [terminals.length]);

  // console.log(terminals);
  // const addNewTerminal = (event) => {
  //   event.preventDefault();
  //   const uniqueId = generateKey();

  //   setGateways((gw: any) => {
  //     const newGateways = [
  //       ...gw,
  //       <Gateway
  //         key={uniqueId}
  //         onDeleteClick={removeGateway}
  //         id={uniqueId}
  //         interfaces={interfaces}
  //         activeDevice={activeDevice}
  //         setActiveDevice={setActiveDevice}
  //       />,
  //     ];
  //     console.log({ newGateways });
  //     return newGateways;
  //   });
  // };

  return (
    <div
      className={`${
        !isOpen ? 'hidden' : 'block'
      } absolute bottom-[24px] z-10 w-full`}
    >
      <Resizable
        ref={resizableRef}
        enable={{ top: true }}
        size={{ width: size.width, height: size.height }}
        // onResize={(e, direction, ref, d) => {
        //   console.log(d);
        // }}
        onResizeStop={(e, direction, ref, d) => {
          setSize((oldSize) => {
            return {
              width: oldSize.width + d.width,
              height: oldSize.height + d.height,
            };
          });
        }}
        className="bg-[#181717]"
        minHeight={200}
        maxHeight="60vh"
      >
        <div className="w-full bg-[#181717] text-xs px-2 py-1 text-gray-100">
          <Tabs
            forceRenderTabPanel={true}
            selectedIndex={tabIndex}
            onSelect={(index) => setTabIndex(index)}
          >
            <div className="flex justify-between items-center">
              <TabList>{terminalTabs}</TabList>
              <MinusIcon
                onClick={() => {
                  setOpen(false);
                }}
                className="mx-2 my-2 w-5 h-5 text-white cursor-pointer hover:bg-teal-500 hover:rounded-sm"
              />
            </div>
            {terminalPanels}
          </Tabs>
        </div>
      </Resizable>
    </div>
  );
};
