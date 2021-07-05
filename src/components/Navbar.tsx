import React, { FC, Fragment, useEffect, useState } from 'react';
import logo from '../../assets/logo_kathara_white.png';
import {
  FolderAddIcon,
  DownloadIcon,
  UploadIcon,
  ChevronDownIcon,
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
const { dialog } = remote;

export const Navbar = () => {
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const [error, setError] = useState('');

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
    ipcRenderer.send('script:copy', script, 'script.sh');
  }

  function executeStart(script: string) {
    createLabFolderOnFileSystem(script);
    _executeGeneric('execute');
  }

  const createNewProjectFolder = async () => {
    if (confirm('Are you sure you want to create a new project?')) {
      const defaultPath = remote.app.getPath('documents');

      console.log({ defaultPath });

      const projectFileName =
        katharaConfig.labInfo.description ||
        dayjs().format('DD-MM-YYYY') + ' (Lab)';

      const projectFolderPath = path.join(defaultPath, projectFileName);
      console.log({ projectFolderPath });

      // create the folder if it does not exist
      try {
        if (!existsSync(projectFolderPath)) {
          mkdirSync(projectFolderPath);
        }
      } catch (err) {
        console.error(err);
      }

      const directory = await dialog.showSaveDialog({
        defaultPath: path.join(projectFolderPath, 'katharaConfig.json'),
        // properties: ['treatPackageAsDirectory'],
      });
      console.log({ directory });
      writeFile(
        directory.filePath!,
        JSON.stringify(katharaConfig, undefined, 2),
        (err) => {
          console.log({ err });
        }
      );

      // after first time project has been saved, enable autosave
      setKatharaConfig((config: any) => {
        return {
          ...config,
          labInfo: {
            ...config.labInfo,
            autosaveEnabled: true,
            labDirPath: directory.filePath,
          },
        };
      });
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

  return (
    <nav className="flex justify-between px-4 py-2 bg-gray-800 shadow-lg align-center">
      {/* <a className="focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center"> */}

      <div className="cursor-auto">
        <img className="w-auto h-8 mt-1" src={logo} alt="kathara logo" />
      </div>
      {/* </a> */}
      <div className="flex items-center justify-center">
        <MyPopover
          children={
            <>
              <button
                type="button"
                aria-label="Create Lab"
                onClick={(e) => {
                  e.preventDefault();
                  createNewProjectFolder();
                }}
                className="w-full flex whitespace-nowrap px-2 py-2 text-sm font-normal tracking-normal rounded-sm text-gray-900 hover:border-transparent hover:bg-gray-100 focus:outline-none focus:ring-1  focus:ring-gray-200"
              >
                <FolderAddIcon className="text-gray-900 w-5 h-5 mr-[5px] mt-[1.2px]" />
                <span>Create new lab</span>
              </button>
              <button
                type="button"
                aria-label="Import Lab"
                onClick={(e) => {
                  e.preventDefault();
                  importExistingProject();
                }}
                className="w-full flex whitespace-nowrap px-2 py-2 text-sm font-normal tracking-normal rounded-sm text-gray-900 hover:border-transparent hover:bg-gray-100 focus:outline-none focus:ring-1  focus:ring-gray-200"
              >
                <UploadIcon className="text-gray-900 w-5 h-5 mr-[5px] mt-[1.2px]" />
                <span>Import existing lab</span>
              </button>
            </>
          }
        />

        {katharaConfig.machines.length > 0 && (
          <>
            <button
              type="button"
              aria-label="Generate Lab Files"
              onClick={(e) => {
                e.preventDefault();
                console.log('generate lab zip file');
                // createZip(katharaConfig);
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
    </nav>
  );
};

import { Popover, Transition } from '@headlessui/react';

type Props = {
  children: React.ReactNode;
};

const MyPopover: FC<Props> = ({ children }) => {
  return (
    <Popover className="relative mr-3">
      {({ open }) => (
        <>
          <Popover.Button>
            <div className="w-max flex px-4 py-1 text-sm  font-bold tracking-wide text-gray-300 rounded-md bg-gray-700 hover:bg-gray-600">
              <span className="text-white">Save / Import</span>
              <ChevronDownIcon
                className={`${
                  open ? 'transform rotate-180' : ''
                } w-5 h-5 text-white ml-2 -mr-1 mt-[1px]`}
              />
            </div>
          </Popover.Button>

          <Transition
            // show={open}
            // as={Fragment}
            enter="transition duration-200 ease-in-out"
            enterFrom="transform scale-95 opacity-70"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-150 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-70"
          >
            <Popover.Panel className="absolute z-10 origin-top-right right-0 mt-[5px]">
              <div className="flex flex-col bg-white rounded-md px-3 py-3 shadow-xl w-auto h-auto">
                {children}
              </div>

              {/* <img src="/solutions.jpg" alt ="" /> */}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};
