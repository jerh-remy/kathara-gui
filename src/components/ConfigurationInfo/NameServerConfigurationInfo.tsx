import React, { FC, useState } from 'react';

type Props = {
  device: any;
};
export const NameServerConfigurationInfo: FC<Props> = ({ device }) => {
  const [deviceName, setDeviceName] = useState<string>(device.data.label);
  // console.log(device.data.label);
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDeviceName(event.target.value);
  }

  return (
    <div>
      <span className="text-teal-600">Additional functions</span>
      <div className="mt-1 mb-3">
        <input
          className="mr-2"
          type="checkbox"
          id="ns-authority"
          name="ns-authority"
        />
        <span className="text-sm text-gray-800">
          I am a Nameserver Authority
        </span>
      </div>
      <div>
        <label
          htmlFor="static-route"
          className="mt-1 block text-sm text-gray-800"
        >
          Zone (root is .)
        </label>
        <div className="mt-1 mb-1">
          <input type="text" id="zone" name="zone" placeholder=".com." />
        </div>
      </div>
      <div className="mb-2">
        <input
          className="mr-2"
          type="checkbox"
          id="recursive"
          name="recursive"
        />
        <span className="text-sm text-gray-800">Enable recursive</span>
      </div>
    </div>
  );
};
