import React, { FC, useState } from 'react';
import { Heading2 } from '../Heading2';

type Props = {
  device: any;
};
export const TerminalConfigurationInfo: FC<Props> = ({ device }) => {
  const [deviceName, setDeviceName] = useState<string>(device.data.label);
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDeviceName(event.target.value);
  }

  return (
    <div>
      <div className="px-5 sm:px-7 mb-2">
        <Heading2 text="Additional functions" />
      </div>{' '}
      <label
        htmlFor="ref-ns"
        className="px-5 sm:px-7 mb-1 mt-1 block text-sm text-gray-800"
      >
        Reference DNS
      </label>
      <div className="px-5 sm:px-7 mt-1">
        {/* <input
          type="text"
          id="ref-ns"
          name="ref-ns"
          placeholder="resolv.conf nameserver"
        /> */}
        <select>
          <option>eth0</option>
          <option>eth1</option>
          <option>eth2</option>
          <option>eth3</option>
        </select>
      </div>
    </div>
  );
};
