import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo_kathara_white.png';
import { useKatharaConfig } from '../contexts/katharaConfigContext';
import {
  createFilesStructure,
  createZip,
  createScript,
} from '../utilities/createNetworkLab';
import { ipcRenderer, remote, shell } from 'electron';
const { dialog } = remote;

export const Navbar = () => {
  const [katharaConfig] = useKatharaConfig();
  const [error, setError] = useState('');

  useEffect(() => {
    ipcRenderer.on('script:execute-reply-error', (_, data) => {
      console.log({ data });
      setError(data);
    });
    if (error !== '') alert(error);
    return () => {
      setError('');
      ipcRenderer.removeAllListeners('script:execute-reply-error');
    };
  }, [error]);

  // console.log({ error });

  function createLabFolderOnFileSystem(script: string) {
    console.log({ script });
    ipcRenderer.send('script:copy', script, 'script.sh');
  }

  function executeStart(script: string) {
    createLabFolderOnFileSystem(script);
    _executeGeneric('execute');
  }

  function executeClean() {
    _executeGeneric('clean');
  }

  function _executeGeneric(command: string) {
    ipcRenderer.send('script:' + command);
  }

  return (
    <nav className="flex justify-between px-4 py-2 bg-gray-800 shadow-lg align-center">
      {/* <a className="focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center"> */}

      <div className="cursor-auto">
        <img className="w-auto h-8 mt-1" src={logo} alt="kathara logo" />
      </div>
      {/* </a> */}
      <div>
        {katharaConfig.machines.length > 0 && (
          <button
            type="button"
            aria-label="Generate Lab Files"
            onClick={(e) => {
              e.preventDefault();
              console.log('generate lab zip file');
              createZip(
                createFilesStructure(
                  katharaConfig.machines,
                  katharaConfig.labInfo
                )
              );
            }}
            className="relative inline-flex items-center px-4 py-1 mr-3 text-sm font-bold tracking-wide text-gray-100 rounded-md border-[1.6px] border-gray-100 bg-transparent hover:border-transparent hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 focus:border-transparent"
          >
            <span>Generate lab files</span>
          </button>
        )}
        <button
          type="button"
          aria-label="Run Lab"
          disabled={katharaConfig.machines.length === 0}
          onClick={(e) => {
            e.preventDefault();
            console.log('run lab');
            const script = createScript(
              createFilesStructure(
                katharaConfig.machines,
                katharaConfig.labInfo
              )
            );
            // console.log({ script });
            // createLabFolderOnFileSystem(script);
            executeStart(script);
          }}
          className="relative inline-flex items-center px-4 py-1 text-sm font-bold tracking-wide text-white border border-transparent rounded-md shadow-sm bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500"
        >
          {/* <img className="w-auto h-6 mr-2 cursor-pointer" src="download.svg" /> */}
          <span>Run lab</span>
        </button>
      </div>
    </nav>
  );
};
