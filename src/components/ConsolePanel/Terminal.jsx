import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { spawn } from 'node-pty';
import { FitAddon } from 'xterm-addon-fit';
import { Resizable } from 're-resizable';
import os from 'os';
import path from 'path';
import { useKatharaConfig } from '../../contexts/katharaConfigContext';
import { useKatharaLabStatus } from '../../contexts/katharaLabStatusContext';

const MyTerminal = ({ size, deviceName }) => {
  const xtermRef = useRef();
  const resizableRef = useRef();
  const fitAddon = new FitAddon();
  const [katharaConfig, setKatharaConfig] = useKatharaConfig();
  const [katharaLabStatus, setKatharaLabStatus] = useKatharaLabStatus();
  const [xTermData, setXtermData] = useState('');

  useEffect(() => {
    // Start PTY process
    try {
      // Choose shell based on os
      const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

      const ptyProcess = spawn(shell, [], {
        name: 'xterm-color',
        // useConpty: true,
        cwd:
          path.join(katharaConfig.labInfo.labDirPath, 'lab') ||
          process.env.HOME, // Which path should terminal start
        env: process.env, // Pass environment variables
      });

      if (resizableRef && resizableRef.current) {
        xtermRef.current = new Terminal({
          cols: 120,
        });

        xtermRef.current.open(resizableRef.current);
        xtermRef.current.loadAddon(new FitAddon());
        xtermRef.current.onRender(() => {
          fitAddon.fit();
        });
      }

      // ptyProcess.resize(100, 40);
      ptyProcess.write(`${os.platform() === 'win32' ? 'cls' : 'clear'}\r`);
      ptyProcess.write(`kathara connect ${deviceName}\r`);

      console.log({ ptyProcess });

      ptyProcess.on('data', function (data) {
        xtermRef.current.write(data);
      });

      xtermRef.current.onData((data) => {
        // setXtermData((prevData) => prevData + data);
        // const code = data.charCodeAt(0);
        // console.log({ code });
        // if (code === 13 && xTermData.length > 0) {
        //   console.log({ data });
        //   ptyProcess.write("\r\nYou typed: '" + xTermData + "'\r\n");
        // } else {
        ptyProcess.write(data);
        // }
      });
    } catch (error) {
      console.log({ error });
    }
  }, []);

  // console.log({ xTermData });

  return (
    <div>
      <Resizable
        onResizeStop={(e, direction, ref, d) => {
          fitAddon.fit();
        }}
      >
        <div ref={resizableRef} />
      </Resizable>
    </div>
  );
};

export default MyTerminal;
