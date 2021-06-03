import React, { useEffect, useState } from 'react';
import { ipcRenderer, remote, shell } from 'electron';
const { dialog } = remote;

// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export default function App() {
  const [directory, setDirectory] = useState('');
  // const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    ipcRenderer.on('script:execute-reply', (_, data) => {
      setOutput((prev) => prev + data);
    });
    console.log(`useEffect called ${output}`);
    // return () => {
    //   setOutput('');
    // };
  }, []);

  // ipcRenderer.on('script:execute-reply', (_, data) => {
  //   console.log({ data });
  //   setOutput(data);
  // });
  // console.log(`useEffect called ${output}`);

  const selectFolder = async (e: any) => {
    e.preventDefault();
    const directory = await dialog.showOpenDialog({
      defaultPath: `C:\\Users\\jerem`,
      properties: ['openDirectory', 'createDirectory'],
    });
    setDirectory(directory.filePaths[0]);
  };

  // const runCommand = (e: any) => {
  //   e.preventDefault();
  //   console.log(`sending cmd: ${e.target.value}`);
  // };

  const runLab = (e: any) => {
    e.preventDefault();
    console.log(`Running lab on ${directory}`);
    ipcRenderer.send('script:execute', directory);
  };

  const stopLab = (e: any) => {
    e.preventDefault();
    console.log(`Stopping lab on ${directory}`);
    ipcRenderer.send('script:clean', directory);
  };

  return (
    <>
      <div className="absolute inset-0 bg-gray-50 text-center h-full flex flex-col justify justify-center">
        <div className="bg-indigo-200 mx-auto p-10 rounded-lg">
          <h1 className="uppercase font-semibold text-lg">Kathara GUI Demo</h1>
          <p className="text-sm mb-4 text-gray-500">Please enter a command:</p>
          <form className="flex flex-col space-y-3 justify-items-center mx-auto">
            <input
              type="text"
              name="directory"
              value={directory}
              onChange={(e) => setDirectory(e.target.value)}
              placeholder="/path/to/your/kathara/lab"
              className="px-2 py-1 w-96 shadow-md border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent rounded-md"
            />
            <button
              onClick={(e) => selectFolder(e)}
              className="shadow-md text-white text-md px-2 py-1 bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 rounded-md"
            >
              Choose Directory
            </button>
            <button
              onClick={(e) => runLab(e)}
              className="shadow-md text-white text-md px-2 py-1 bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 rounded-md"
            >
              Run lab
            </button>
            <button
              onClick={(e) => stopLab(e)}
              className="shadow-md text-white text-md px-2 py-1 bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 rounded-md"
            >
              Stop lab
            </button>
            {/* <input
              type="text"
              name="command"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter command to run"
              className="px-2 py-1 w-96 shadow-md border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent rounded-md"
            />
            <button
              onClick={(e) => runCommand(e)}
              className="shadow-md text-white text-md px-2 py-1 bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 rounded-md"
            >
              Submit
            </button>  */}
            <p className="text-sm">Output:</p>
            <textarea
              className="focus:outline-none focus:ring-2 focus:ring-purple-600 p-2 rounded-md shadow-md"
              name="output"
              id="output"
              readOnly
              value={output}
              rows={10}
              cols={100}
            ></textarea>
          </form>
        </div>
      </div>
    </>
  );
}
