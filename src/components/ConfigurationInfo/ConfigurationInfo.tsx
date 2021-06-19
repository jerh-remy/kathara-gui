import React, { FC } from 'react';
import { DefaultConfigurationInfo } from './DefaultConfigurationInfo';

type Props = {
  device: any;
};

export const ConfigurationInfo: FC<Props> = ({ device }) => {
  let component;
  if (device === null || device === undefined) {
    component = null;
  } else {
    component = <DefaultConfigurationInfo device={device} />;
  }

  return component;
};
