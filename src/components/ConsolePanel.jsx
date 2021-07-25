import React, { useState } from 'react';
import { Resizable } from 're-resizable';

export const ConsolePanel = () => {
  const [size, setSize] = useState({
    width: `100%`,
    height: 200,
  });
  return (
    <div className="absolute bottom-0 z-10 w-full">
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
        className="bg-gray-700"
        minHeight={200}
        maxHeight="60vh"
      >
        <div className="w-full bg-gray-700 text-xs px-2 py-1 divide-y-2 divide-gray-100 text-gray-100">
          Console
        </div>
      </Resizable>
    </div>
  );
};
