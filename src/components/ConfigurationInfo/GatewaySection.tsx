import React, { FC, useState } from 'react';
import { TrashIcon } from '@heroicons/react/outline';

const generateKey = () => {
  return `gw_${new Date().getTime()}`;
};

export const GatewaySection = () => {
  const [gateways, setGateways] = useState<any>([
    <Gateway
      key={generateKey()}
      onDeleteClick={removeGateway}
      id={generateKey()}
    />,
  ]);

  const addNewGateway = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setGateways((gw: any) => {
      console.log({ gw });
      const newGateways = [
        ...gw,
        <Gateway
          key={generateKey()}
          onDeleteClick={removeGateway}
          id={generateKey()}
        />,
      ];
      console.log({ newGateways });
      return newGateways;
    });
  };

  function removeGateway(
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) {
    event.preventDefault();
    setGateways((gw: any) => {
      console.log({ id });
      const newGw = gw.filter((elem: any) => elem.props.id !== id);
      return [...newGw];
    });
  }

  console.log({ gateways });

  return (
    <>
      <div className="flex justify-between items-center px-4 sm:px-6">
        <span className="text-teal-600">Gateway (static) </span>
        <button
          className="rounded-md bg-teal-600 hover:bg-teal-700 px-2 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => addNewGateway(e)}
        >
          Add Gateway
        </button>
        {/* <button
          className="rounded-md bg-teal-600  px-2 py-2 text-white text-sm"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => removeGateway(e)}
        >
          Remove Gateway
        </button> */}
      </div>
      {gateways.length > 0 ? (
        gateways
      ) : (
        <div className="mt-4 flex items-center justify-center border-2 border-dashed rounded-md mx-4 px-2 py-4 text-sm text-gray-700 ">
          Click the Add Gateway button to get started
        </div>
      )}
    </>
  );
};

type Props = {
  onDeleteClick: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
  id: string;
};

export const Gateway: FC<Props> = ({ onDeleteClick, id }) => {
  return (
    <div className="mt-4 border-2 border-dashed rounded-md mx-4 px-2 py-2">
      <label
        htmlFor="static-route"
        className="mt-1 block text-sm text-gray-800"
      >
        Route (leave empty for default gateway)
      </label>
      <div className="mt-1 mb-2">
        <input
          type="text"
          id="static-route"
          name="static-route"
          placeholder="0.0.0.0/0"
        />
      </div>
      <div>
        <label htmlFor="gateway" className="block text-sm text-gray-800">
          Gateway (leave empty to generate nothing)
        </label>
        <div className="mt-1 mb-2">
          <input
            type="text"
            id="gateway"
            name="gateway"
            placeholder="0.0.0.0"
          />
        </div>
      </div>
      <div>
        <label htmlFor="interface" className="block text-sm text-gray-800">
          Interface
        </label>
        <div className="mt-1 mb-2">
          <select>
            <option>eth0</option>
            <option>eth1</option>
            <option>eth2</option>
            <option>eth3</option>
          </select>
        </div>
      </div>
      <div className="mt-4 mb-1.5">
        <button
          onClick={(event) => onDeleteClick(event, id)}
          className="group flex items-center justify-center rounded-md bg-red-100 hover:bg-red-600 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <TrashIcon
            className="h-5 w-5 mr-1.5 text-red-600 group-hover:text-white "
            aria-hidden="true"
          />
          <span className="text-red-600 group-hover:text-white font-semibold">
            Delete
          </span>
        </button>

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
      </div>
    </div>
  );
};
