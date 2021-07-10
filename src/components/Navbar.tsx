import React, { FC, Fragment, useEffect, useState } from 'react';
import logo from '../../assets/logo_kathara_white.png';
import MyPopover from '../components/Popover';
import {
  FolderAddIcon,
  DownloadIcon,
  UploadIcon,
} from '@heroicons/react/outline';
import { useKatharaConfig } from '../contexts/katharaConfigContext';
import {
  createFilesStructure,
  createZip,
  createScript,
} from '../utilities/createNetworkLab';
import { ipcRenderer, remote, shell } from 'electron';
import path from 'path';

import dayjs from 'dayjs';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFile,
  writeFileSync,
} from 'fs';
import { NewProjectModal } from './NewProjectModal';
const { dialog } = remote;

export const Navbar = () => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    ipcRenderer.on('script:execute-reply-error', (_, katharaData) => {
      console.log({ katharaData });
      setError((_) => katharaData.trim());
    });
    if (
      error !== '' &&
      !error.includes('Deploying') &&
      !error.includes('Deleting')
    ) {
      alert(error);
    }
    return () => {
      // setError('');
      ipcRenderer.removeAllListeners('script:execute-reply-error');
    };
  }, [error]);

  // console.log({ error });

  function createLabFolderOnFileSystem(script: string) {
    const dirPathArr = katharaConfig.labInfo.labDirPath.split('\\');
    const dirPath = dirPathArr.slice(0, -1).join('\\');
    console.log({ dirPath });
    ipcRenderer.send('script:copy', script, 'script.sh', dirPath);
  }

  function executeStart(script: string) {
    createLabFolderOnFileSystem(script);
    _executeGeneric('execute');
  }

  const createNewProjectFolder = async () => {
    const projectFileName = katharaConfig.labInfo.description;
    const projectFolderPath = katharaConfig.labInfo.labDirPath;
    console.log({ projectFolderPath });

    // create the folder if it does not exist
    try {
      if (!existsSync(projectFolderPath)) {
        mkdirSync(projectFolderPath);
      }
      const configFilePath = path.join(projectFolderPath, 'katharaConfig.json');
      console.log({ configFilePath });

      writeFile(
        configFilePath,
        JSON.stringify(katharaConfig, undefined, 2),
        (err) => {
          console.log({ err });
          if (err === null) {
            // after first time project has been saved, enable autosave
            setKatharaConfig((config: any) => {
              return {
                ...config,
                labInfo: {
                  ...config.labInfo,
                  autosaveEnabled: true,
                },
              };
            });
          }
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const importExistingProject = async () => {
    const defaultPath = remote.app.getPath('documents');

    console.log({ defaultPath });
    const directory = await dialog.showOpenDialog({
      defaultPath: defaultPath,
    });
    console.log({ directory });

    if (directory.filePaths.length > 0) {
      const configFromFile = JSON.parse(
        readFileSync(directory.filePaths[0], 'utf8')
      );

      console.log({ configFromFile });

      setKatharaConfig((_: any) => {
        return {
          ...configFromFile,
        };
      });
    }
  };

  function executeClean() {
    _executeGeneric('clean');
  }

  function _executeGeneric(command: string) {
    ipcRenderer.send('script:' + command);
  }

  const onPopoverItemClicked = (item: string) => {
    switch (item) {
      case 'NEW':
        setShowModal(true);
        // createNewProjectFolder();
        console.log('New project');
        break;
      case 'IMPORT':
        importExistingProject();
        break;
      default:
        break;
    }
  };

  return (
    <nav className="flex justify-between items-center px-4 py-2 bg-gray-800 shadow-lg align-center">
      {/* <a className="focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center"> */}
      <div className="cursor-auto">
        <img className="w-auto h-8 mt-1" src={logo} alt="kathara logo" />
      </div>
      <div>
        <p className="text-md text-white font-bold">{`${
          katharaConfig.labInfo.labDirPath?.length > 0
            ? katharaConfig.labInfo.description
            : ''
        }`}</p>
      </div>
      <div className="flex items-center justify-center">
        <MyPopover onItemClicked={onPopoverItemClicked} />
        {katharaConfig.machines.length > 0 && (
          <>
            <button
              type="button"
              aria-label="Generate Lab Files"
              onClick={(e) => {
                e.preventDefault();
                console.log('generate lab zip file');
                createZip(katharaConfig);
              }}
              className="relative inline-flex items-center px-4 py-1 mr-3 text-sm font-bold tracking-wide text-gray-300 rounded-md border-[1.6px] border-gray-300 bg-transparent hover:border-transparent hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 focus:border-transparent"
            >
              <DownloadIcon className="text-white w-5 h-5 mr-[5px] mt-[1.2px]" />
              <span>Generate zip</span>
            </button>
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
                console.log({ script });
                executeStart(script);
              }}
              className="relative inline-flex items-center px-4 py-1 mr-3 text-sm font-bold tracking-wide text-white border border-transparent rounded-md shadow-sm bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500"
            >
              <span>Run lab</span>
            </button>
            <button
              type="button"
              aria-label="Stop Lab"
              disabled={katharaConfig.machines.length === 0}
              onClick={(e) => {
                e.preventDefault();
                console.log('stop lab');
                executeClean();
              }}
              className="relative inline-flex items-center px-4 py-1 text-sm font-bold tracking-wide text-white border border-transparent rounded-md shadow-sm bg-red-500 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
            >
              {/* <img className="w-auto h-6 mr-2 cursor-pointer" src="download.svg" /> */}
              <span>Stop lab</span>
            </button>
          </>
        )}
      </div>
      <NewProjectModal
        showModal={showModal}
        setShowModal={setShowModal}
        onSaveClicked={createNewProjectFolder}
      />
    </nav>
  );
};
