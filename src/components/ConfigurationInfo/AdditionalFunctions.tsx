import React, { FC } from 'react';
import { NameServerConfigurationInfo } from './NameServerConfigurationInfo';
import { RouterConfigurationInfo } from './RouterConfigurationInfo';
import { TerminalConfigurationInfo } from './TerminalConfigurationInfo';
import { WebServerConfigurationInfo } from './WebServerConfigurationInfo';

type Props = {
  device: any;
};
export const AdditionalFunctions: FC<Props> = ({ device }) => {
  let component;

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
      component = <div></div>;
      break;
  }
  return component;
};
