import React, { FC } from 'react';

type Props = {
  text: string;
};
export const Heading2: FC<Props> = ({ text }) => {
  return (
    <span className="text-teal-500 font-normal text-base tracking-tight">
      {text}
    </span>
  );
};
