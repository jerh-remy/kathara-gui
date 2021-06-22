import React, { FC } from 'react';

type Props = {
  message: string;
};

export const MessageWithBorder: FC<Props> = ({ message }) => {
  return (
    <div className="mt-4 flex items-center justify-center text-center border-2 border-dashed rounded-md mx-4 px-2 py-4 text-sm text-gray-700 ">
      {message}
    </div>
  );
};
