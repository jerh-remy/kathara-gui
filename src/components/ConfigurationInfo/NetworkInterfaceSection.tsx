import React, { FC, useState } from 'react';
import { useStoreActions, useStoreState } from 'react-flow-renderer';
import { toTitleCase } from '../../utilities/utilities';

type Props = {
  activeDevice: any;
  interfaces: [];
};

export const NetworkInterfaceSection: FC<Props> = ({
  activeDevice,
  interfaces,
}) => {
  const [intfs, setIntfs] = useState(interfaces);
  const edges = useStoreState((store) => store.edges);

  console.log({ edges });

  // edges.find((edge)=>)

  function handleChange(event: any) {
    console.log(event.target.type);
    // setIntfs((ns: any) => {
    //   const newNameServer = {
    //     ...ns,
    //     [event.target.name]: event.target.checked,
    //   };
    //   return newNameServer;
    // });
  }

  return (
    <>
      <div className="px-4 sm:px-6">
        <span className="text-teal-600">Network Interfaces</span>
      </div>
      {intfs.map((intf) => (
        <NetworkInterface key={intf} interfaceNo={intf} />
      ))}
      <div className="px-4 sm:px-6 mt-4">
        <label htmlFor="startup" className="block text-sm text-gray-800">
          Directly in <span className="font-semibold">{activeDevice.name}</span>
          .startup
        </label>
        <div className="mt-1 mb-2 ">
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
    </>
  );
};

type NetworkInterfaceProps = {
  interfaceNo: any;
};

export const NetworkInterface: FC<NetworkInterfaceProps> = ({
  interfaceNo,
}) => {
  return (
    <div className="mt-4 border-2 border-dashed rounded-md mx-4 px-2 py-2">
      <label htmlFor="domain" className="mt-1 block text-sm text-gray-800">
        {`${toTitleCase(interfaceNo)} collision domain`}
      </label>
      <div className="mt-1 mb-2">
        <input
          type="text"
          id="domain"
          name="domain"
          // value={activeDevice.interfaces.if[0].eth.domain}
          // onChange={handleChange}
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
    </div>
  );
};
