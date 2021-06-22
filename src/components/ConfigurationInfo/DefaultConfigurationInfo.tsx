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
import { NetworkInterfaceSection } from './NetworkInterfaceSection';
import { sortInterfacesString } from '../../utilities/utilities';
import { Heading2 } from '../Heading2';

type Props = {
  device: any;
  interfaces: [];
};
export const DefaultConfigurationInfo: FC<Props> = ({ device, interfaces }) => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const [activeDevice, setActiveDevice] = useState(
    katharaConfig.machines.find((machine: any) => machine.id === device.id)
  );

  // console.log(Object.keys(activeDevice));
  // console.log({ katharaConfig }, { activeDevice });
  // sortInterfacesString(interfaces).forEach((element: any) => {
  //   console.log(element);
  // });

  const nodes = useStoreState((store) => store.nodes);
  const edges = useStoreState((store) => store.edges);
  // const elements = [...nodes, ...edges];

  // const setElements = useStoreActions((actions) => actions.setElements);

  // console.log({ nodes });

  // console.log(
  //   katharaConfig.machines.find((machine: any) => machine.id === device.id)
  // );
  // console.log({ device });

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
    setKatharaConfig((config: any) => {
      let filteredMachines = config.machines.filter((machine: any) => {
        return machine.id !== activeDevice.id;
      });

      return {
        ...config,
        machines: [...filteredMachines, activeDevice],
      };
    });

    console.log({ activeDevice }, { katharaConfig });
  }, [activeDevice]);

  // const addNode = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();
  //   const newNode = {
  //     id: `${Math.random() * 1000}`,
  //     type: 'custom',
  //     position: { x: 250, y: 500 },
  //     data: { label: `node_${+new Date().getSeconds()}`, deviceType: 'router' },
  //   };
  //   console.log({ newNode });
  //   setElements(
  //     elements.concat(newNode)

  //     // els.find((node) => node.id === device.id).data.label = event.target.value;
  //     // console.log(router);
  //   );
  // };

  return (
    <div className="mt-4 mb-4">
      <form className="space-y-8">
        <div className="px-4 sm:px-6">
          <Heading2 text={`Machine Information (${device.data.deviceType})`} />
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
        <div>
          <NetworkInterfaceSection
            activeDevice={activeDevice}
            setActiveDevice={setActiveDevice}
            interfaces={sortInterfacesString(interfaces)}
          />
        </div>
        <div>
          <GatewaySection
            activeDevice={activeDevice}
            setActiveDevice={setActiveDevice}
            interfaces={sortInterfacesString(interfaces)}
          />
        </div>
        <AdditionalFunctions
          device={device}
          activeDevice={activeDevice}
          setActiveDevice={setActiveDevice}
          interfaces={sortInterfacesString(interfaces)}
        />
        {/* <div className="px-4 sm:px-6">
          <button
            className="rounded-sm border px-2 border-gray-500"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              addNode(event)
            }
          >
            Add Node
          </button>
        </div> */}
        <div className="invisible">
          <p>Should not require this workaround</p>
        </div>
      </form>
    </div>
  );
};
