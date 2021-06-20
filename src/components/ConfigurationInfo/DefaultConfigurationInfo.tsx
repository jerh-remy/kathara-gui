import React, { FC, useEffect, useState } from 'react';
import {
  useStoreState,
  useStoreActions,
  ReactFlowProps,
  Elements,
} from 'react-flow-renderer';
import { useKatharaConfig } from '../../contexts/katharaConfigContext';
import { AdditionalFunctions } from './AdditionalFunctions';
import { GatewaySection } from './GatewaySection';

type Props = {
  device: any;
};
export const DefaultConfigurationInfo: FC<Props> = ({ device }) => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const [activeDevice, setActiveDevice] = useState(
    katharaConfig.machines.find((machine: any) => machine.id === device.id)
  );

  // console.log(Object.keys(activeDevice));
  // console.log({ katharaConfig }, { activeDevice });
  console.log({ activeDevice });

  const nodes = useStoreState((store) => store.nodes);
  const edges = useStoreState((store) => store.edges);
  const elements = [...nodes, ...edges];

  const setElements = useStoreActions((actions) => actions.setElements);

  // console.log({ nodes });

  // console.log(
  //   katharaConfig.machines.find((machine: any) => machine.id === device.id)
  // );
  // console.log(device.id);

  // const handleInputChange = (event) => {
  //   event.persist();
  //   setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
  // }

  const handleChange = (event: any) => {
    console.log(event.target.name);

    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    const propertyName = event.target.name;

    switch (propertyName) {
      case 'name':
        setActiveDevice((device: any) => ({
          ...device,
          [propertyName]: value,
        }));
        break;
      case 'startup':
        setActiveDevice((device: any) => {
          const newDevice = {
            ...device,
            interfaces: {
              ...device.interfaces,
              ['free']: value,
            },
          };
          // newDevice.interfaces.free = value;
          return newDevice;
        });
        break;

      default:
        break;
    }

    // setElements(
    //   nodes.map((el) => {
    //     if (el.id === device.id) {
    //       // it's important that you create a new object here
    //       // in order to notify react flow about the change
    //       // console.log({ ...el.data });
    //       el.data = {
    //         ...el.data,
    //         label: event.target.value,
    //       };
    //     }
    //     return el;
    //   })
    // );
    // console.log(nodes.find((node) => node.id === device.id));

    // console.log(nodes.find((node) => node.id === device.id)?.data.label);
  };

  useEffect(() => {
    setElements(
      nodes.map((el) => {
        if (el.id === device.id && activeDevice.name) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          // console.log({ ...el.data });
          el.data = {
            ...el.data,
            label: activeDevice.name,
          };
        }
        return el;
      })
    );

    setKatharaConfig((config: any) => {
      let filteredMachines = config.machines.filter((machine: any) => {
        return machine.id !== activeDevice.id;
      });

      return {
        ...config,
        machines: [...filteredMachines, activeDevice],
      };
    });

    //   // setKatharaConfig({
    //   //   ...katharaConfig,
    //   //   machines: [...katharaConfig.machines, activeDevice],
    //   // });
  }, [activeDevice, setElements]);

  const addNode = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const newNode = {
      id: `${Math.random() * 1000}`,
      type: 'custom',
      position: { x: 250, y: 500 },
      data: { label: `node_${+new Date().getSeconds()}`, deviceType: 'router' },
    };
    console.log({ newNode });
    setElements(
      elements.concat(newNode)

      // els.find((node) => node.id === device.id).data.label = event.target.value;
      // console.log(router);
    );
  };
  return (
    <div className="mt-4 mb-4">
      <form className="space-y-8">
        <div className="px-4 sm:px-6">
          <span className="text-teal-600">Machine Information</span>
          <label htmlFor="name" className="mt-1 block text-sm text-gray-800">
            Device name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              name="name"
              value={activeDevice.name}
              onChange={handleChange}
              placeholder={`${device.data.deviceType}1`}
            />
          </div>
        </div>
        <div className="px-4 sm:px-6">
          <span className="text-teal-600">Network Interfaces</span>
          <label htmlFor="domain" className="mt-1 block text-sm text-gray-800">
            Eth0 collision domain
          </label>
          <div className="mt-1 mb-2">
            <input
              type="text"
              id="domain"
              name="domain"
              value={activeDevice.interfaces.if[0].eth.domain}
              onChange={handleChange}
              placeholder="A"
            />
          </div>
          <label htmlFor="ip-address" className="block text-sm text-gray-800">
            IP address/Net
          </label>
          <div className="mt-1 mb-2">
            <input
              type="text"
              id="ip-address"
              name="ip-address"
              placeholder="0.0.0.0/0"
            />
          </div>
          <label htmlFor="dns" className="block text-sm text-gray-800">
            Complete DNS name
          </label>
          <div className="mt-1 mb-2">
            <input
              type="text"
              id="dns"
              name="dns"
              placeholder="www.x.y or ROOT-SERVER"
            />
          </div>
          <label htmlFor="startup" className="block text-sm text-gray-800">
            Directly in {activeDevice.name}.startup
          </label>
          <div className="mt-1 mb-2">
            <textarea
              className="resize-none"
              id="startup"
              name="startup"
              value={activeDevice.interfaces.free}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </div>
        {/* <div>
          <span className="text-teal-600">Gateway (static) </span>
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
        </div> */}
        <div>
          <GatewaySection />
        </div>
        <AdditionalFunctions device={device} activeDevice={activeDevice} />
        <div className="px-4 sm:px-6">
          <button
            className="rounded-sm border px-2 border-gray-500"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              addNode(event)
            }
          >
            Add Node
          </button>
        </div>
        <div className="invisible">
          <p>Should not require this workaround</p>
        </div>
      </form>
    </div>
  );
};
