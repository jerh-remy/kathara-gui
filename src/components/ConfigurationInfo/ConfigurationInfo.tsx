import React, { FC } from 'react';
import { DefaultConfigurationInfo } from './DefaultConfigurationInfo';

type Props = {
  device: any;
  interfaces: [];
};

export const ConfigurationInfo: FC<Props> = ({ device, interfaces }) => {
  let component;
  if (device === null || device === undefined) {
    component = null;
  } else {
    component = (
      <DefaultConfigurationInfo device={device} interfaces={interfaces} />
    );
  }

  return component;
};
