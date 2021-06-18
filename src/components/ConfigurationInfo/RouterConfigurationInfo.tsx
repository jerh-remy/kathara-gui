import React, { FC, useEffect, useState } from 'react';
import {
  useStoreState,
  useStoreActions,
  ReactFlowProps,
  Elements,
} from 'react-flow-renderer';
import { useKatharaConfig } from '../../contexts/katharaConfigContext';

type Props = {
  device: any;
};
export const RouterConfigurationInfo: FC<Props> = ({ device }) => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  console.log({ katharaConfig });

  const nodes = useStoreState((store) => store.nodes);
  const edges = useStoreState((store) => store.edges);
  const elements = [...nodes, ...edges];

  const setElements = useStoreActions((actions) => actions.setElements);

  // console.log({ nodes });

  const [deviceName, setDeviceName] = useState<string>(device.data.label);
  // console.log(device.data.label);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeviceName(event.target.value);

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
        if (el.id === device.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          // console.log({ ...el.data });
          el.data = {
            ...el.data,
            label: deviceName,
          };
        }
        return el;
      })
    );

    // setKatharaConfig({
    //   ...katharaConfig,
    //   labInfo: {
    //     author: deviceName,
    //   },
    // });
  }, [deviceName, setElements]);

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
        <div>
          <span className="text-teal-600">Machine Information</span>
          <label
            htmlFor="device-name"
            className="mt-1 block text-sm text-gray-800"
          >
            Device name
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="device-name"
              name="device-name"
              value={deviceName}
              onChange={handleChange}
              placeholder="pc1"
            />
          </div>
        </div>
        <div>
          <span className="text-teal-600">Network Interfaces</span>
          <label
            htmlFor="collision-domain"
            className="mt-1 block text-sm text-gray-800"
          >
            Eth0 collision domain
          </label>
          <div className="mt-1 mb-2">
            <input
              type="text"
              id="collision-domain"
              name="collision-domain"
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
          <label htmlFor="dns" className="block text-sm text-gray-800">
            Directly in {deviceName}.startup
          </label>
          <div className="mt-1 mb-2">
            <textarea
              className="resize-none"
              id="startup"
              name="startup"
              rows={4}
            />
          </div>
        </div>
        <div>
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
        </div>
        <div>
          <span className="text-teal-600">Additional functions</span>
          <label htmlFor="ref-ns" className="mt-1 block text-sm text-gray-800">
            Dynamic routing
          </label>
          <div className="mt-1 flex justify-between">
            <div>
              <input type="checkbox" id="rip" name="rip" className="mr-2" />
              <span className="text-sm text-gray-800">rip</span>
            </div>
            <div>
              <input type="checkbox" id="ospf" name="ospf" className="mr-2" />
              <span className="text-sm text-gray-800">ospf</span>
            </div>
            <div>
              <input type="checkbox" id="bgp" name="bgp" className="mr-2" />
              <span className="text-sm text-gray-800">bgp</span>
            </div>
          </div>
        </div>
        <button
          className="rounded-sm border px-2 border-gray-500"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
            addNode(event)
          }
        >
          Add Node
        </button>
        <div className="invisible">
          <p>Should not require this workaround</p>
        </div>
      </form>
    </div>
  );
};
