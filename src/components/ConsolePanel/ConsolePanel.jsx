import React, { useState, useRef } from 'react';
import { Resizable } from 're-resizable';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { XIcon, MinusIcon } from '@heroicons/react/outline';

import MyTerminal from './Terminal';
import '../../App.global.css';

export const ConsolePanel = ({ isOpen, setOpen }) => {
  const [size, setSize] = useState({
    width: '100%',
    height: '60vh',
  });

  const [tabIndex, setTabIndex] = useState(0);
  const resizableRef = useRef();

  // console.log(size.height, isOpen);

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
        onResize={(e, direction, ref, d) => {
          console.log(d);
        }}
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
              <TabList>
                <Tab>Output</Tab>
                <Tab>Output 2</Tab>
                <Tab>Output 3</Tab>
              </TabList>

              <MinusIcon
                onClick={() => {
                  setOpen(false);
                }}
                className="mx-2 my-2 w-5 h-5 text-white cursor-pointer hover:bg-teal-500 hover:rounded-sm"
              />
            </div>
            <TabPanel>
              <MyTerminal size={size} />
            </TabPanel>
            <TabPanel>
              <MyTerminal size={size} />
            </TabPanel>
            <TabPanel>
              <MyTerminal size={size} />
            </TabPanel>
          </Tabs>
        </div>
      </Resizable>
    </div>
  );
};
