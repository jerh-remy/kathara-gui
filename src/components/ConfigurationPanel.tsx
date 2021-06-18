/* This example requires Tailwind CSS v2.0+ */
import React, { FC, Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { ConfigurationInfo } from './ConfigurationInfo/ConfigurationInfo';
import { Heading } from './Heading';

type Props = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeDevice: any;
  setActiveDevice: React.Dispatch<React.SetStateAction<any>>;
};

export const ConfigurationPanel: FC<Props> = ({
  isOpen,
  setOpen,
  activeDevice,
  setActiveDevice,
}) => {
  // const setOpen = () => {
  //   console.log('clicked');
  // };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-10 overflow-hidden"
        open={isOpen}
        onClose={() => {
          setOpen(false);
          setActiveDevice(null);
        }}
      >
        <div className="absolute inset-0 overflow-hidden ">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-400 bg-opacity-70 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-y-0 right-0 max-w-full flex ">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300 sm:duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300 sm:duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative w-screen max-w-sm">
                {/* <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                    <button
                      className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close panel</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child> */}
                <div className="h-full flex flex-col py-4 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6">
                    <Dialog.Title className="text-lg font-medium text-gray-900">
                      Configuration Panel
                    </Dialog.Title>
                  </div>
                  <div className="relative flex-1 px-4 sm:px-6">
                    <div className="absolute inset-0 px-4 sm:px-6">
                      <div className="h-full" aria-hidden="true">
                        <ConfigurationInfo device={activeDevice} />
                        {/* // className="h-full border-2 border-dashed
                        border-gray-200 " */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
