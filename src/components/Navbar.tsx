import React, { FC, Fragment, useEffect, useState } from 'react';
import logo from '../../assets/logo_kathara_white.png';
import MyPopover from '../components/Popover';
import {
  FolderAddIcon,
  DownloadIcon,
  UploadIcon,
} from '@heroicons/react/outline';
import { useKatharaLabStatus } from '../contexts/katharaLabStatusContext';
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

type NavbarProps = {
  showNewProjectModal: boolean;
  setShowNewProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
};
export const Navbar: FC<NavbarProps> = ({
  showNewProjectModal,
  setShowNewProjectModal,
}) => {
  const [katharaLabStatus, setKatharaLabStatus] = useKatharaLabStatus();
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const [error, setError] = useState('');
  const [exitCode, setExitCode] = useState(1);
  const [isLabRunCommandIssued, setIsLabRunCommandIssued] = useState(false);

  const sortedRouters = katharaConfig.machines
    .filter((element: any) => {
      return element.type === 'router';
    })
    .sort((a: any, b: any) => a.name.localeCompare(b.name));

  let bgpRouterArr: any = [];
  let bgpRoutes: any = [];

  useEffect(() => {
    ipcRenderer.on('script:stderr-reply', (_: any, katharaData: any) => {
      console.log({ katharaData });
      setKatharaLabStatus((status: any) => {
        const newStatus = {
          ...status,
          // output: status.output + katharaData,
          output: katharaData,
        };
        return newStatus;
      });
      setError((_) => katharaData.trim());
    });

    return () => {
      setError('');
      ipcRenderer.removeAllListeners('script:execute-reply-error');
    };
  }, []);

  useEffect(() => {
    ipcRenderer.on('script:stdout-reply', (_: any, stdout: any) => {
      // console.log({ stdout });
      // bgpRouterArr.push({
      //   router: router?.name,
      //   bgpRoutes: [],
      // });

      const outputArr = stdout.split('\n');
      const routerIDArr = outputArr[0].split(',')[1].split(' ');
      const routerID = routerIDArr[routerIDArr.length - 1];
      console.log({ routerID });

      const routerName = sortedRouters.find((router: any) => {
        return router.interfaces.if.some((intf: any) => {
          if (!intf.eth.ip) {
            return;
          }

          return intf.eth.ip.split('/')[0].trim() === routerID.trim();
        });
      }).name;

      console.log({ routerName });

      let bestPathNetwork: any;
      outputArr.forEach((line: any) => {
        if (line.startsWith('*') || line.startsWith('*>')) {
          line.trim();
          let [status, network, nextHop] = line.split(/\s+/);
          console.log(
            {
              status,
            },
            {
              network,
            },
            {
              nextHop,
            }
          );
          if (status === '*>') {
            if (nextHop === '0') {
              nextHop = network;
              network = bestPathNetwork;
            }

            const existingNextHop = bgpRoutes.find((elem: any) => {
              return elem.nextHop === nextHop;
            });
            console.log({
              existingNextHop,
            });
            if (!existingNextHop) {
              bgpRoutes.push({
                nextHop: nextHop,
                networks: [network],
              });
            } else {
              const filteredArr = bgpRoutes.filter((elem: any) => {
                return elem.nextHop !== nextHop;
              });
              bgpRoutes = [
                ...filteredArr,
                {
                  ...existingNextHop,
                  networks: [...existingNextHop.networks, network],
                },
              ];
            }
          } else if (status === '*') {
            bestPathNetwork = network;
            return;
          }
        }
      });
      console.log({
        bgpRoutes,
      });
      bgpRouterArr.push({
        router: routerName,
        bgpRoutes: bgpRoutes,
      });
      bgpRouterArr.sort((a: any, b: any) => a.router.localeCompare(b.router));
      bgpRoutes = [];

      console.log({
        bgpRouterArr,
      });
    });

    return () => {
      ipcRenderer.removeAllListeners('script:stdout-reply');
      console.log('FINISH');
    };
  }, []);

  useEffect(() => {
    ipcRenderer.on('script:code-reply', (_: any, code: any) => {
      console.log({ code });
      setExitCode(code);
    });

    return () => {
      // setError('');
      ipcRenderer.removeAllListeners('script:code-reply');
    };
  }, [exitCode]);

  useEffect(() => {
    if (
      error !== '' &&
      !error.includes('Deploying') &&
      !error.includes('Deleting')
    ) {
      alert(error);
    }
  }, [error]);

  useEffect(() => {
    if (isLabRunCommandIssued && exitCode === 0) {
      setKatharaLabStatus((status: any) => {
        const newStatus = {
          ...status,
          isLabRunning: true,
        };
        return newStatus;
      });
    } else if (!isLabRunCommandIssued && exitCode === 0) {
      setKatharaLabStatus((status: any) => {
        const newStatus = {
          ...status,
          isLabRunning: false,
          terminals: [],
        };
        return newStatus;
      });
    }

    console.log({ isLabRunCommandIssued }, katharaLabStatus, { exitCode });

    return () => {
      setExitCode(1);
    };
  }, [exitCode, isLabRunCommandIssued]);

  // console.log({ error });

  function createLabFolderOnFileSystem(script: string) {
    const dirPath = katharaConfig.labInfo.labDirPath;
    console.log({ dirPath });
    ipcRenderer.send('script:copy', script, 'script.sh', dirPath);
  }

  function executeStart(script: string) {
    createLabFolderOnFileSystem(script);
    _executeGeneric('execute');
    setIsLabRunCommandIssued(true);
    setKatharaLabStatus((status: any) => {
      const newStatus = {
        ...status,
        isConsoleOpen: true,
        killTerminals: false,
      };
      return newStatus;
    });
  }

  function executeClean() {
    _executeGeneric('clean');
    setIsLabRunCommandIssued(false);
  }

  function executeCheck() {
    ipcRenderer.send('script:check');
  }

  function executeCheckDocker() {
    ipcRenderer.send('script:checkDocker');
  }

  function executeShowIpBgp() {
    console.log({ sortedRouters });
    // const dirPath = katharaConfig.labInfo.labDirPath;
    // ipcRenderer.send('script:bgp', dirPath, 'r2');
    for (router of sortedRouters) {
      const dirPath = katharaConfig.labInfo.labDirPath;
      ipcRenderer.send('script:bgp', dirPath, router.name);
    }
  }

  function _executeGeneric(command: string) {
    const dirPath = katharaConfig.labInfo.labDirPath;
    ipcRenderer.send('script:' + command, dirPath);
  }

  const createNewProjectFolder = async () => {
    const projectFileName = katharaConfig.labInfo.description;
    const projectFolderPath = katharaConfig.labInfo.labDirPath;
    console.log({ projectFolderPath }, { projectFileName });

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
          if (!err) {
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
      filters: [{ name: 'Kathara configuration', extensions: ['json'] }],
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

  const onPopoverItemClicked = (item: string) => {
    if (katharaLabStatus.isLabRunning) {
      alert('Please stop the running lab before creating/importing a project');
    } else {
      switch (item) {
        case 'NEW':
          setShowNewProjectModal(true);
          console.log('New project');
          break;
        case 'IMPORT':
          importExistingProject();
          break;
        default:
          break;
      }
    }
  };

  let startStopLabButton;

  if (!katharaLabStatus.isLabRunning) {
    startStopLabButton = (
      <button
        type="button"
        aria-label="Run Lab"
        disabled={katharaConfig.machines.length === 0}
        onClick={(e) => {
          e.preventDefault();
          console.log('run lab');
          const script = createScript(
            createFilesStructure(katharaConfig.machines, katharaConfig.labInfo)
          );
          console.log({ script });
          executeStart(script);

          // executeCheck();
        }}
        className="relative inline-flex items-center px-4 py-1 mr-3 text-sm font-bold tracking-wide text-white border border-transparent rounded-md shadow-sm bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500"
      >
        <span>Run lab</span>
      </button>
    );
  } else {
    startStopLabButton = (
      <button
        type="button"
        aria-label="Stop Lab"
        disabled={katharaConfig.machines.length === 0}
        onClick={(e) => {
          e.preventDefault();
          console.log('stop lab');
          executeClean();
          // executeCheckDocker();
        }}
        className="relative inline-flex items-center px-4 py-1 text-sm font-bold tracking-wide text-white border border-transparent rounded-md shadow-sm bg-red-500 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
      >
        {/* <img className="w-auto h-6 mr-2 cursor-pointer" src="download.svg" /> */}
        <span>Stop lab</span>
      </button>
    );
  }
  return (
    <nav className="flex justify-between items-center px-4 py-2 bg-gray-800 shadow-lg align-center">
      {/* <a className="focus:outline-none focus:ring-2 focus:ring-emerald-400 flex items-center"> */}
      <div className="cursor-auto">
        <img className="w-auto h-8 mt-1" src={logo} alt="kathara logo" />
      </div>
      <div className="flex items-center">
        <p className="text-md text-white font-bold">{`${
          katharaConfig.labInfo.labDirPath?.length > 0
            ? katharaConfig.labInfo.description
            : ''
        }`}</p>
        {katharaLabStatus.isLabRunning && (
          <div className="text-xs text-green-600 font-semibold px-2 py-1 rounded-md bg-green-200 mr-1 ml-2">
            Kathará Lab running
          </div>
        )}
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
                // createZip(katharaConfig);
                executeShowIpBgp();
              }}
              className="relative inline-flex items-center px-4 py-1 mr-3 text-sm font-bold tracking-wide text-gray-300 rounded-md border-[1.6px] border-gray-300 bg-transparent hover:border-transparent hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500 focus:border-transparent"
            >
              <DownloadIcon className="text-white w-5 h-5 mr-[5px] mt-[1.2px]" />
              <span>Generate zip</span>
            </button>
            {startStopLabButton}
          </>
        )}
      </div>
      <NewProjectModal
        showModal={showNewProjectModal}
        setShowModal={setShowNewProjectModal}
        onSaveClicked={createNewProjectFolder}
      />
    </nav>
  );
};
