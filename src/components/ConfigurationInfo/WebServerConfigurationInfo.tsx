import React, { FC, useState } from 'react';

type Props = {
  device: any;
};

export const WebServerConfigurationInfo: FC<Props> = ({ device }) => {
  const [deviceName, setDeviceName] = useState<string>(device.data.label);
  // console.log(device.data.label);
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setDeviceName(event.target.value);
  }

  return (
    <div>
      <span className="text-teal-600">Additional functions</span>
      <div className="mt-1 mb-3">
        <input className="mr-2" type="checkbox" id="user-dir" name="user-dir" />
        <p className="inline text-sm text-gray-800">
          Enable
          <span className="text-sm text-gray-900 font-semibold"> userdir </span>
          module
        </p>
      </div>
    </div>
  );
};
