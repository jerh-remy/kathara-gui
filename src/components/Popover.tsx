import { Popover, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  FolderAddIcon,
  UploadIcon,
} from '@heroicons/react/outline';
import React, { FC, useRef } from 'react';

type Props = {
  onItemClicked: (item: string) => void;
};

const MyPopover: FC<Props> = ({ onItemClicked }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <Popover className="relative mr-3">
      {({ open }) => (
        <>
          <Popover.Button ref={buttonRef}>
            <div className="w-max flex px-4 py-1 text-sm  font-bold tracking-wide text-gray-300 rounded-md bg-gray-700 hover:bg-gray-600">
              <span className="text-white">New / Import</span>
              <ChevronDownIcon
                className={`${
                  open ? 'transform rotate-180' : ''
                } w-5 h-5 text-white ml-2 -mr-1 mt-[1px]`}
              />
            </div>
          </Popover.Button>

          <Transition
            // show={open}
            // as={Fragment}
            enter="transition duration-100 ease-in-out"
            enterFrom="transform scale-10 opacity-80"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-100 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-10 opacity-80"
          >
            <Popover.Panel className="absolute z-10 origin-top-right right-0 mt-[5px]">
              <div className="flex flex-col bg-white rounded-md px-3 py-3 shadow-xl w-auto h-auto">
                <>
                  <button
                    type="button"
                    aria-label="Create Lab"
                    onClick={(e) => {
                      e.preventDefault();
                      buttonRef.current?.click();
                      onItemClicked('NEW');
                    }}
                    className="w-full flex whitespace-nowrap px-2 py-2 text-sm font-normal tracking-normal rounded-sm text-gray-900 hover:border-transparent hover:bg-gray-100 focus:outline-none focus:ring-1  focus:ring-gray-200"
                  >
                    <FolderAddIcon className="text-gray-900 w-5 h-5 mr-[5px] mt-[1.2px]" />
                    <span>Create new lab</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Import Lab"
                    onClick={(e) => {
                      e.preventDefault();
                      buttonRef.current?.click();
                      onItemClicked('IMPORT');
                    }}
                    className="w-full flex whitespace-nowrap px-2 py-2 text-sm font-normal tracking-normal rounded-sm text-gray-900 hover:border-transparent hover:bg-gray-100 focus:outline-none focus:ring-1  focus:ring-gray-200"
                  >
                    <UploadIcon className="text-gray-900 w-5 h-5 mr-[5px] mt-[1.2px]" />
                    <span>Import existing lab</span>
                  </button>
                </>
              </div>

              {/* <img src="/solutions.jpg" alt ="" /> */}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default MyPopover;
