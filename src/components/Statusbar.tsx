import React, { useEffect, useState } from 'react';
import { useKatharaConfig } from '../contexts/katharaConfigContext';

export const Statusbar = () => {
  const [katharaConfig] = useKatharaConfig();

  return (
    <nav className="flex justify-between px-4 py-2 bg-[#2b2933] shadow-lg align-center">
      <div className="flex-1 flex">
        <p className="text-gray-300 text-xs mr-1">{`${
          katharaConfig.labInfo.autosaveEnabled
            ? 'Your project is being autosaved.'
            : 'Please save this project as a new Kathara lab to enable the autosave feature. '
        }`}</p>
        <p className="text-gray-300 text-xs">{`${
          katharaConfig.labInfo.autosaveEnabled
            ? ` Current project directory: ${katharaConfig.labInfo.labDirPath}`
            : ''
        }`}</p>
      </div>
      <div className="flex justify-between items-center space-x-4">
        <div className="flex items-center">
          <div className="rounded-full w-3 h-3 bg-red-600 mr-1"></div>
          <span className="text-gray-300 text-xs">Kathara Status</span>
        </div>
        <div className="flex items-center">
          <div className="rounded-full w-3 h-3 bg-red-600 mr-1"></div>
          <span className="text-gray-300 text-xs">Docker Status</span>
        </div>
      </div>
    </nav>
  );
};
