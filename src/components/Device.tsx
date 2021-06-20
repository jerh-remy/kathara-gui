import React, { DragEvent } from 'react';
import { getDeviceTypeString, getImage } from '../utilities/utilities';

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
      className="group h-[85px] w-[85px] cursor-pointer hover:bg-[#596272] hover:rounded-md  flex flex-col justify-center items-center "
      onDragStart={(event: DragEvent) =>
        onDragStart(event, `custom|${dt}|${deviceType}`)
      }
      draggable
    >
      <img
        className="h-[50px] w-[50px] object-scale-down"
        src={getImage(deviceType)}
        alt="The type of network device"
      />
      <div className="group-hover:text-white text-sm text-gray-300 mt-1">
        {deviceType}
      </div>
    </div>
  );
};
