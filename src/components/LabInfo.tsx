import { Disclosure, Transition } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { useKatharaConfig } from '../contexts/katharaConfigContext';
import { Heading } from './Heading';

export const LabInfo = () => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const { labInfo } = katharaConfig;

  const handleChange = (event: any) => {
    console.log(event.target.name);

    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    const propertyName = event.target.name;

    setKatharaConfig((config: any) => ({
      ...config,
      labInfo: {
        ...config.labInfo,
        [propertyName]: value,
      },
    }));
  };

  return (
    <div className="mt-4 mb-4">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full focus:outline-none">
              <div className="w-auto bg-gray-700 rounded-lg flex justify-between items-center">
                <Heading className="flex-1" text="Lab Information" />
                <ChevronRightIcon
                  className={`${
                    open ? 'transform rotate-90' : ''
                  } w-5 h-5 text-teal-600 mr-2`}
                />
              </div>
            </Disclosure.Button>
            <Transition
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Disclosure.Panel>
                <form className="mt-2 mb-0 space-y-3" action="#" method="post">
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm text-gray-300"
                    >
                      Description
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="description"
                        name="description"
                        disabled={labInfo.description.length > 0}
                        onChange={handleChange}
                        value={labInfo.description}
                        placeholder={`Exam ${new Date().getFullYear()}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="version"
                      className="block text-sm text-gray-300"
                    >
                      Version
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="version"
                        name="version"
                        onChange={handleChange}
                        value={labInfo.version}
                        placeholder="1.0"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="author"
                      className="block text-sm text-gray-300"
                    >
                      Author(s)
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="author"
                        name="author"
                        onChange={handleChange}
                        value={labInfo.author}
                        placeholder="Jeremy Offori"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm text-gray-300"
                    >
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={handleChange}
                        value={labInfo.email}
                        placeholder="jeremy.offori@gmail.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="web"
                      className="block text-sm text-gray-300"
                    >
                      Website
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="web"
                        name="web"
                        onChange={handleChange}
                        value={labInfo.web}
                        placeholder="http://lboro.ac.uk"
                      />
                    </div>
                  </div>
                </form>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  );
};
