import React, { FC, useState } from 'react';
import { NameServerConfigurationInfo } from './NameServerConfigurationInfo';
import { RouterConfigurationInfo } from './RouterConfigurationInfo';
import { RouterConfigurationInfoTry } from './RouterConfigurationInfoTry';
import { TerminalConfigurationInfo } from './TerminalConfigurationInfo';
import { WebServerConfigurationInfo } from './WebServerConfigurationInfo';

type Props = {
  device: any;
};

export const ConfigurationInfo: FC<Props> = ({ device }) => {
  let component;
  if (device === null || device === undefined) {
    component = null;
  } else {
    switch (device.data.deviceType) {
      case 'router':
        component = <RouterConfigurationInfo device={device} />;
        break;
      case 'terminal':
        component = <TerminalConfigurationInfo device={device} />;
        break;
      case 'nameserver':
        component = <NameServerConfigurationInfo device={device} />;
        break;
      case 'webserver':
        component = <WebServerConfigurationInfo device={device} />;
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
  }

  return component;
};
