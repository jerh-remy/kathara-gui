/* This example requires Tailwind CSS v2.0+ */
import React, { FC, Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { ConfigurationInfo } from './ConfigurationInfo/ConfigurationInfo';
import { Heading } from './Heading';

type Props = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onPanelClose: () => void;
  activeDevice: any;
  interfaces: [];
};

export const ConfigurationPanel: FC<Props> = ({
  isOpen,
  setOpen,
  onPanelClose,
  activeDevice,
  interfaces,
}) => {
  // const setOpen = () => {
  //   console.log('clicked');
  // };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed inset-0 z-20 overflow-hidden"
        open={isOpen}
        onClose={() => {
          onPanelClose();
          setOpen(false);
        }}
      >
        <div className="absolute inset-0 overflow-hidden ">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-gray-400 bg-opacity-70 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-y-0 right-0 max-w-full flex ">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-200 sm:duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200 sm:duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative w-screen max-w-[26rem]">
                <div className="h-full flex flex-col py-4 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-5 sm:px-7">
                    <Dialog.Title className="text-lg font-medium text-gray-900">
                      Configuration Panel
                    </Dialog.Title>
                  </div>
                  <div className="relative flex-1 ">
                    <div className="absolute inset-0 ">
                      <div className="h-full" aria-hidden="true">
                        <ConfigurationInfo
                          device={activeDevice}
                          interfaces={interfaces}
                        />
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
