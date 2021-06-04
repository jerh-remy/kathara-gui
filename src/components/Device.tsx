import React, { DragEvent } from 'react';
import { getDeviceTypeString, getImage } from '../utilities';

const onDragStart = (event: DragEvent, nodeType: string) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

type Props = {
  deviceType: string;
};

export const Device: React.FC<Props> = ({ deviceType }) => {
  const dt = getDeviceTypeString(deviceType);

  return (
    <div
      className="cursor-move  flex flex-col justify-center items-center "
      onDragStart={(event: DragEvent) => onDragStart(event, `custom|${dt}`)}
      draggable
    >
      <img
        className="h-[60px] w-[60px] object-scale-down"
        src={getImage(deviceType)}
        alt="The type of network device"
      />
      <div className="text-sm text-gray-300 mt-1">{deviceType}</div>
    </div>
  );
};
