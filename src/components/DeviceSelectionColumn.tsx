import React, { useEffect } from 'react';
import { useRef } from 'react';
import { Device } from './Device';
import { Heading } from './Heading';
import { LabInfo } from './LabInfo';

export const DeviceSelectionColumn = () => {
  const myRef = useRef<any>(null);

  return (
    <>
      <div
        ref={myRef}
        className=" bg-[#2E3748] shadow-2xl w-[18rem] full-screen text-white px-5 py-4 overflow-y-auto"
      >
        <aside>
          <Heading text="Components" />
          <div className="mt-4 mb-10 grid grid-cols-2 gap-y-10 justify-end justify-items-center">
            <Device deviceType="Terminal" />
            <Device deviceType="Router" />
            <Device deviceType="Name Server" />
            <Device deviceType="Web Server" />
            <Device deviceType="Custom" />
            {/* <Device deviceType="OpenFlow Ryu Controller" /> */}
          </div>
          <LabInfo />
        </aside>
      </div>
    </>
  );
};
