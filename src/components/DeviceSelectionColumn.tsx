import React from 'react';
import { Device } from './Device';

export const DeviceSelectionColumn = () => {
  return (
    <div className=" bg-[#2E3748] shadow-2xl w-72 text-white px-5 py-4">
      <aside>
        <div className="text-gray-50 text-base">Components</div>
        <div className="mt-4 grid grid-cols-2 gap-y-10 justify-end  justify-items-center">
          <Device deviceType="Terminal" />
          <Device deviceType="Router" />
          <Device deviceType="Name Server" />
          <Device deviceType="Web Server" />
          <Device deviceType="Other" />
          {/* <Device deviceType="OpenFlow Ryu Controller" /> */}
        </div>
      </aside>
    </div>
  );
};
