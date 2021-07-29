import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import { ConsoleTabs } from './ConsoleTabs';
// import { FitAddon } from 'xterm-addon-fit';

export const ConsolePanel = () => {
  const [size, setSize] = useState({
    width: `100%`,
    height: 200,
  });

  return (
    <div className="absolute bottom-[24px] z-10 w-full">
      <Resizable
        enable={{ top: true }}
        size={{ width: size.width, height: size.height }}
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
          <ConsoleTabs terminalSize={size} />
        </div>
      </Resizable>
    </div>
  );
};
