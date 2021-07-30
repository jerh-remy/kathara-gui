import React, { useEffect } from 'react';
import { useRef } from 'react';
import { ConsolePanel } from './ConsolePanel/ConsolePanel';
import { Device } from './Device';
import { Heading } from './Heading';
import { LabInfo } from './LabInfo';

export const DeviceSelectionColumn = () => {
  const myRef = useRef<any>(null);

  useEffect(() => {
    if (myRef.current !== null) {
      console.log(myRef.current!.getBoundingClientRect());
    }
  }, []);
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
            <Device deviceType="Other" />

            {/* <Device deviceType="OpenFlow Ryu Controller" /> */}
          </div>
          <LabInfo />
        </aside>
      </div>
    </>
  );
};
