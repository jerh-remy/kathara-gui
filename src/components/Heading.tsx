import React, { FC } from 'react';

type Props = {
  text: string;
};

export const Heading: FC<Props> = ({ text }) => {
  return (
    <div className="flex items-center justify-center cursor-default text-gray-300 bg-gray-800 rounded-lg px-2 py-1 text-base">
      {text}
    </div>
  );
};
