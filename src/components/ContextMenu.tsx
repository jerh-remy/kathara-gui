import { Transition } from '@headlessui/react';
import React, { Children, FC, Fragment, ReactNode } from 'react';
import useContextMenu from '../hooks/useContextMenu';

type Props = {
  children: ReactNode;
};

export const ContextMenu: FC<Props> = ({ children }) => {
  const { xPos, yPos, showMenu } = useContextMenu();
  // console.log(xPos, yPos, showMenu);

  return (
    <Transition
      show={showMenu}
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <div
        className="absolute bg-white mt-2 mb-2 w-auto h-auto z-30 rounded-md shadow-md px-2 py-2"
        style={{
          top: yPos,
          left: xPos,
        }}
      >
        {children}
      </div>
    </Transition>
  );
};
