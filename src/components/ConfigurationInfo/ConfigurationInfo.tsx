import React, { FC, useState } from 'react';
import { NameServerConfigurationInfo } from './NameServerConfigurationInfo';
import { RouterConfigurationInfo } from './RouterConfigurationInfo';
import { TerminalConfigurationInfo } from './TerminalConfigurationInfo';
import { WebServerConfigurationInfo } from './WebServerConfigurationInfo';

type Props = {
  device: any;
};

export const ConfigurationInfo: FC<Props> = ({ device }) => {
  let component;
  switch (device.data.deviceType) {
    case 'router':
      component = <RouterConfigurationInfo device={device} />;
      break;
    case 'terminal':
      component = <TerminalConfigurationInfo />;
      break;
    case 'nameserver':
      component = <NameServerConfigurationInfo />;
      break;
    case 'webserver':
      component = <WebServerConfigurationInfo />;
      break;

    default:
      component = (
        <div>
          <input type="text" />
          <p>Hello World</p>
        </div>
      );
      break;
  }

  return component;
};
