import React, { useEffect, useState } from 'react';
import { useKatharaConfig } from '../contexts/katharaConfigContext';
import { useKatharaLabStatus } from '../contexts/katharaLabStatusContext';

export const Statusbar = () => {
  const [katharaConfig] = useKatharaConfig();
  const [katharaLabStatus, setKatharaLabStatus] = useKatharaLabStatus();

  return (
    <footer className="z-20 flex justify-between px-4 py-2 bg-[#2b2933] shadow-lg align-center">
      <div className="flex-1 flex items-center">
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
        <button
          type="button"
          aria-label="Open Console Panel"
          onClick={(e) => {
            e.preventDefault();
            if (!katharaLabStatus.isConsoleOpen) {
              setKatharaLabStatus((status: any) => {
                const newStatus = {
                  ...status,
                  isConsoleOpen: true,
                  killTerminals: false,
                };
                return newStatus;
              });
            } else {
              setKatharaLabStatus((status: any) => {
                const newStatus = {
                  ...status,
                  isConsoleOpen: false,
                  killTerminals: false,
                };
                return newStatus;
              });
            }
          }}
          className="m-0 w-full flex whitespace-nowrap items-center px-2 py-1 text-xs font-normal tracking-normal rounded-sm text-gray-300 border hover:border-transparent hover:bg-gray-500 focus:outline-none focus:ring-1  focus:ring-gray-200"
        >
          Open console panel
        </button>
        <div className="flex whitespace-nowrap items-center">
          <div className="rounded-full w-3 h-3 bg-red-600 mr-1"></div>
          <span className="text-gray-300 text-xs">Kathara Status</span>
        </div>
        <div className="flex whitespace-nowrap items-center">
          <div className="rounded-full w-3 h-3 bg-red-600 mr-1"></div>
          <span className="text-gray-300 text-xs">Docker Status</span>
        </div>
      </div>
    </footer>
  );
};
