import React, { useEffect, useState } from 'react';
import { useKatharaConfig } from '../contexts/katharaConfigContext';
import { useKatharaLabStatus } from '../contexts/katharaLabStatusContext';
import { shell } from 'electron';

export const Statusbar = () => {
  const [katharaConfig] = useKatharaConfig();
  const [katharaLabStatus, setKatharaLabStatus] = useKatharaLabStatus();

  let message;

  if (katharaLabStatus.isLabRunning) {
    message = '';
  } else {
    message = (
      <>
        <p className="text-gray-300 text-xs mr-1">{`${
          katharaConfig.labInfo.autosaveEnabled
            ? 'Autosave enabled.'
            : 'To enable the autosave feature, create a new Kathara lab project. '
        }`}</p>
        {katharaConfig.labInfo.autosaveEnabled ? (
          <p className="text-gray-300 text-xs">
            Current project directory: {` `}
            <span
              onClick={(e) => {
                e.preventDefault();
                shell.showItemInFolder(katharaConfig.labInfo.labDirPath);
              }}
              className="text-teal-500 text-xs hover:cursor-pointer"
            >
              {katharaConfig.labInfo.labDirPath}
            </span>
          </p>
        ) : (
          ''
        )}
      </>
    );
  }

  return (
    <footer className="z-20 flex justify-between px-4 py-2 bg-[#2b2933] shadow-lg align-center">
      <div className="flex-1 flex items-center">{message}</div>
      <div className="flex justify-between items-center space-x-4">
        <button
          type="button"
          aria-label="Toggle Console Panel"
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
          className="m-0 w-full flex whitespace-nowrap items-center px-2 py-1 text-xs font-semibold tracking-wide rounded-md text-gray-300 border-[1.6px] hover:border-transparent hover:bg-gray-600 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          {katharaLabStatus.isConsoleOpen
            ? 'Close console panel'
            : ' Open console panel'}
        </button>
        {/* {katharaLabStatus.isLabRunning && ( */}
        <button
          type="button"
          aria-label="Toggle Routing Path Overlay"
          onClick={(e) => {
            e.preventDefault();
            if (!katharaLabStatus.isRoutingPathPanelOpen) {
              setKatharaLabStatus((status: any) => {
                const newStatus = {
                  ...status,
                  isRoutingPathPanelOpen: true,
                };
                return newStatus;
              });
            } else {
              setKatharaLabStatus((status: any) => {
                const newStatus = {
                  ...status,
                  isRoutingPathPanelOpen: false,
                };
                return newStatus;
              });
            }
          }}
          className="m-0 w-full flex whitespace-nowrap items-center px-2 py-1 text-xs font-semibold tracking-wide rounded-md text-gray-300 border-[1.6px] hover:border-transparent hover:bg-gray-600 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          {katharaLabStatus.isRoutingPathPanelOpen
            ? 'Close routing path panel'
            : ' Open routing path panel'}
        </button>
        {/* )} */}
        <div className="flex whitespace-nowrap items-center">
          <div className="rounded-full w-3 h-3 bg-green-600 mr-1"></div>
          <span className="text-gray-300 text-xs">Kathara Status</span>
        </div>
        <div className="flex whitespace-nowrap items-center">
          <div className="rounded-full w-3 h-3 bg-green-600 mr-1"></div>
          <span className="text-gray-300 text-xs">Docker Status</span>
        </div>
      </div>
    </footer>
  );
};
