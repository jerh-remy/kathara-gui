import React, { useState, useEffect, useRef } from 'react';
import { Resizable } from 're-resizable';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { XIcon, MinusIcon } from '@heroicons/react/outline';

import MyTerminal from './Terminal';
import '../../App.global.css';

import { useKatharaLabStatus } from '../../contexts/katharaLabStatusContext';

const LabOutput = () => {
  const [katharaLabStatus, setKatharaLabStatus] = useKatharaLabStatus();
  const [output, setOutput] = useState('');

  useEffect(() => {
    setOutput((prev) => prev + katharaLabStatus.output);
    return () => {
      setOutput('');
    };
  }, [katharaLabStatus.output]);

  return (
    <textarea
      className="bg-[#181717] text-sm focus:outline-none focus:border-none focus:ring-transparent min-h-[60vh] w-full text-white border-none"
      name="output"
      id="output"
      readOnly
      value={output}
    />
  );
};

export const ConsolePanel = () => {
  const [size, setSize] = useState({
    width: '100%',
    height: '60vh',
  });
  const [tabIndex, setTabIndex] = useState(0);
  const [katharaLabStatus, setKatharaLabStatus] = useKatharaLabStatus();
  const [terminalTabs, setTerminalTabs] = useState([
    <Tab key="output-term">Output</Tab>,
  ]);
  const [terminalPanels, setTerminalPanels] = useState([
    <TabPanel key="output-term-panel">
      <LabOutput />
    </TabPanel>,
  ]);

  const resizableRef = useRef();

  useEffect(() => {
    setTerminalTabs((tabs) => {
      const newTabs = katharaLabStatus.terminals.map((term) => {
        return (
          <Tab key={term.terminalId}>
            {/* <div className="w-auto flex justify-between items-center py-1"> */}
            {term.terminalTabName}
            {/* <XIcon className="ml-4 w-3 h-3 text-white cursor-pointer hover:bg-teal-500 hover:rounded-sm" /> */}
            {/* </div> */}
          </Tab>
        );
      });

      return [tabs[0], ...newTabs];
    });
    setTerminalPanels((terms) => {
      const newTerminalPanels = katharaLabStatus.terminals.map((term) => {
        return (
          <TabPanel key={term.terminalId}>
            <MyTerminal size={size} deviceName={term.terminalTabName} />
          </TabPanel>
        );
      });
      return [terms[0], ...newTerminalPanels];
    });
    // switch to the most recently added tab
    if (katharaLabStatus.terminals.length > 0) {
      setTabIndex(katharaLabStatus.terminals.length - 1);
    }
  }, [katharaLabStatus.terminals.length]);

  let consolePanel;
  if (katharaLabStatus.killTerminals) {
    consolePanel = null;
  } else {
    consolePanel = (
      <div
        className={`${
          !katharaLabStatus.isConsoleOpen ? 'hidden' : 'block'
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
                <div className="flex items-center">
                  <MinusIcon
                    onClick={() => {
                      setKatharaLabStatus((status) => {
                        const newStatus = {
                          ...status,
                          isConsoleOpen: false,
                          killTerminals: false,
                        };
                        return newStatus;
                      });
                    }}
                    className="mx-2 my-2 w-5 h-5 text-white cursor-pointer hover:bg-teal-500 hover:rounded-sm"
                  />
                  <XIcon
                    onClick={() => {
                      setKatharaLabStatus((status) => {
                        const newStatus = {
                          ...status,
                          isConsoleOpen: false,
                          killTerminals: true,
                        };
                        return newStatus;
                      });
                    }}
                    className="mx-2 my-2 w-5 h-5 text-white cursor-pointer hover:bg-teal-500 hover:rounded-sm"
                  />
                </div>
              </div>
              {terminalPanels}
            </Tabs>
          </div>
        </Resizable>
      </div>
    );
  }

  return consolePanel;
};
