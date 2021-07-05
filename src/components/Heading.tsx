import React, { FC } from 'react';

type Props = {
  text: string;
  className?: string;
};

export const Heading: FC<Props> = ({ className, text }) => {
  return (
    <div
      className={`${className} flex items-center uppercase tracking-wider justify-center cursor-default text-gray-300 bg-gray-700 rounded-lg px-2 py-1.5 text-sm font-medium`}
    >
      {text}
    </div>
  );
};
