import React, { DragEvent } from 'react';

const onDragStart = (event: DragEvent, nodeType: string) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

export const DeviceSelectionColumn = () => {
  return (
    <div className=" bg-gray-800 shadow-2xl w-80 text-white p-8">
      <aside>
        <div className="text-gray-400">Components</div>
        <div
          className="cursor-move mt-2 rounded-sm border border-gray-200 flex justify-center items-center p-3"
          onDragStart={(event: DragEvent) => onDragStart(event, 'input')}
          draggable
        >
          Input Node
        </div>
        <div
          className="dndnode mt-2 rounded-sm border border-gray-200 flex justify-center items-center p-3"
          onDragStart={(event: DragEvent) => onDragStart(event, 'default')}
          draggable
        >
          Default Node
        </div>
        <div
          className="dndnode output mt-2 rounded-sm border border-gray-200 flex justify-center items-center p-3"
          onDragStart={(event: DragEvent) => onDragStart(event, 'output')}
          draggable
        >
          Output Node
        </div>
      </aside>
    </div>
  );
};
