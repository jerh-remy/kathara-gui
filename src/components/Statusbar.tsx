import React, { useEffect, useState } from 'react';
import { useKatharaConfig } from '../contexts/katharaConfigContext';

export const Statusbar = () => {
  const [katharaConfig] = useKatharaConfig();

  return (
    <footer className="z-20 flex justify-between px-4 py-2 bg-[#2b2933] shadow-lg align-center">
      <div className="flex-1 flex">
        <p className="text-gray-300 text-xs mr-1">{`${
          katharaConfig.labInfo.autosaveEnabled
            ? 'Your project is being autosaved.'
            : 'To enable the autosave feature, create a new Kathara lab project. '
        }`}</p>
        {katharaConfig.labInfo.autosaveEnabled ? (
          <p className="text-gray-300 text-xs">
            Current project directory: {` `}
            <span className="text-teal-500 text-xs">
              {katharaConfig.labInfo.labDirPath}
            </span>
          </p>
        ) : (
          ''
        )}
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
    </footer>
  );
};
