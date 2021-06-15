import React, { FC } from 'react';

type Props = {
  text: string;
};

export const Heading: FC<Props> = ({ text }) => {
  return (
    <div className="flex items-center uppercase tracking-wider justify-center cursor-default text-gray-300 bg-gray-700 rounded-lg px-2 py-1.5 text-sm font-medium">
      {text}
    </div>
  );
};
