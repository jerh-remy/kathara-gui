import React, { useState, useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { spawn } from 'node-pty';
import { FitAddon } from 'xterm-addon-fit';
import { Resizable } from 're-resizable';
import os from 'os';
// import '../../../node_modules/xterm/css/xterm.css';

// let pty;
// try {
//   pty = require('node-pty');
// } catch (outerError) {
//   console.error('outerError', outerError);
// }

const MyTerminal = ({ size }) => {
  const [input, setInput] = useState('');
  const xtermRef = useRef();
  const resizableRef = useRef();
  const [pty, setPty] = useState();
  const fitAddon = new FitAddon();

  useEffect(() => {
    // Start PTY process
    try {
      // Choose shell based on os
      const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

      const ptyProcess = spawn(shell, [], {
        name: 'xterm-color',
        // cols: 80,
        // rows: 30,
        // useConpty: false,
        cwd: process.env.HOME, // Which path should terminal start
        env: process.env, // Pass environment variables
      });

      if (resizableRef && resizableRef.current) {
        xtermRef.current = new Terminal();

        xtermRef.current.open(resizableRef.current);
        xtermRef.current.loadAddon(new FitAddon());
        xtermRef.current.onRender(() => {
          fitAddon.fit();
        });
      }

      console.log({ ptyProcess });

      ptyProcess.on('data', function (data) {
        xtermRef.current.write(data);
      });

      xtermRef.current.onData((data) => {
        ptyProcess.write(data);
      });
    } catch (error) {
      console.log({ error });
    }
  }, []);

  return (
    <div>
      <Resizable
        onResizeStop={(e, direction, ref, d) => {
          fitAddon.fit();
        }}
      >
        <div
          ref={resizableRef}
          // style={{ background: 'red', height: '100%', width: '100%' }}
        />
      </Resizable>
    </div>
  );
};

export default MyTerminal;
