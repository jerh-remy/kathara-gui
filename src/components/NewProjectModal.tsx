import { Dialog } from '@headlessui/react';
import { FolderOpenIcon } from '@heroicons/react/outline';
import React, { FC, useEffect, useState } from 'react';
import { remote } from 'electron';
import { existsSync, mkdirSync, writeFile } from 'fs';
import path, { dirname } from 'path';
import { useKatharaConfig } from '../contexts/katharaConfigContext';
import { labInfo } from '../models/network';
import _ from 'lodash';

type Props = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  onSaveClicked: () => void;
};

const { dialog } = remote;

export const NewProjectModal: FC<Props> = ({
  setShowModal,
  showModal,
  onSaveClicked,
}) => {
  const defaultPath = remote.app.getPath('documents');
  const [projectDefaultPath, setProjectDefaultPath] = useState(defaultPath);
  const [projectName, setProjectName] = useState('');
  const [projectDir, setProjectDir] = useState('');
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();

  useEffect(() => {
    setProjectDir(path.join(projectDefaultPath, projectName));
  }, [projectName, projectDefaultPath]);

  useEffect(() => {
    setKatharaConfig((config: any) => {
      return {
        machines: [],
        elements: [],
        position: [],
        zoom: 1,
        labInfo: {
          ...config.labInfo,
          labDirPath: projectDir,
          description: projectName,
        },
      };
    });
  }, [projectDir]);

  const selectProjectFolder = async () => {
    try {
      const directory = await dialog.showOpenDialog({
        defaultPath: defaultPath,
        properties: ['openDirectory'],
      });
      if (directory.filePaths[0]) {
        setProjectDefaultPath(directory.filePaths[0]);
      }

      // after first time project has been saved, enable autosave
      // setKatharaConfig((config: any) => {
      //   return {
      //     ...config,
      //     labInfo: {
      //       ...config.labInfo,
      //       autosaveEnabled: true,
      //       labDirPath: directory.filePath,
      //       description: foldername,
      //     },
      //   };
      // });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog
      className="fixed z-10 inset-0 overflow-y-auto"
      open={showModal}
      onClose={() => {
        if (confirm('Are you sure you want to skip creating a new project?')) {
          setShowModal(false);
        }
      }}
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-30 transition-opacity" />
        {/* This element is to trick the browser into centering the modal contents. */}
        {/* <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span> */}

        <div className="inline-block align-bottom bg-white rounded-md shadow-xl px-6 py-6 max-w-lg w-[60%] mx-auto text-left overflow-hidden transform">
          <Dialog.Title
            as="h3"
            className="text-lg leading-6 font-medium text-gray-800 mb-1"
          >
            New Project
          </Dialog.Title>
          <Dialog.Description className="text-xs text-gray-500">
            Specify a project name and save location
          </Dialog.Description>
          <label
            htmlFor="project-name"
            className="mt-2 block text-sm text-gray-800"
          >
            Project name
          </label>
          <div className="mt-1 mb-2">
            <input
              type="text"
              id="project-name"
              name="project-name"
              value={projectName}
              onChange={(event) => {
                setProjectName(event.target.value);
              }}
            />
          </div>
          <label
            htmlFor="project-save-location"
            className="block text-sm text-gray-800"
          >
            Save location
          </label>
          <div className="mt-1 mb-2 flex">
            <input
              type="text"
              id="project-save-location"
              name="project-save-location"
              placeholder="/path/to/your/kathara/lab"
              value={projectDir}
              onChange={(event) => {
                setProjectDir(event.target.value);
              }}
            />
            <button className="flex-shrink-0 ml-[6px]  tracking-wide rounded-md px-3 py-[2px] text-sm font-medium bg-teal-100 hover:bg-teal-200">
              <FolderOpenIcon
                onClick={(event) => {
                  event.preventDefault();
                  selectProjectFolder();
                }}
                className="text-teal-600 w-5 h-5 "
              />
            </button>
          </div>

          <button
            className="inline-flex w-full items-center justify-center mt-4 px-4 py-1 text-sm font-bold tracking-wide text-white border border-transparent rounded-md shadow-sm bg-teal-600 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-300"
            type="button"
            onClick={() => {
              console.log({ projectName }, { projectDir });
              if (!projectName) {
                dialog.showErrorBox(
                  'Error',
                  'Project name cannot be left empty'
                );
              } else if (!projectDir) {
                dialog.showErrorBox(
                  'Error',
                  'Project directory cannot be left empty'
                );
              } else {
                setKatharaConfig((config: any) => {
                  const clonedLabInfo = _.cloneDeep(labInfo);
                  return {
                    machines: [],
                    elements: [],
                    position: [],
                    zoom: 1,
                    labInfo: {
                      ...clonedLabInfo,
                      labDirPath: projectDir,
                      description: projectName,
                    },
                  };
                });
                setShowModal(false);
                onSaveClicked();
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </Dialog>
  );
};
