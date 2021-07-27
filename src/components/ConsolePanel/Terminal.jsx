import React, { useState, useEffect } from 'react';
import { XTerm } from 'xterm-for-react';
import { spawn } from 'node-pty';
import { FitAddon } from 'xterm-addon-fit';
import os from 'os';

// let pty;
// try {
//   pty = require('node-pty');
// } catch (outerError) {
//   console.error('outerError', outerError);
// }

const Terminal = ({ size }) => {
  const [input, setInput] = useState('');
  const xtermRef = React.useRef(null);
  const fitAddon = new FitAddon();
  const [pty, setPty] = useState();
  // let ptyProcess;

  useEffect(() => {
    // Start PTY process
    try {
      // Choose shell based on os
      const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

      const ptyProcess = spawn(shell, [], {
        name: 'xterm-color',
        // useConpty: false,
        cwd: process.env.HOME, // Which path should terminal start
        env: process.env, // Pass environment variables
      });

      console.log({ ptyProcess });

      ptyProcess.on('data', function (data) {
        xtermRef.current.terminal.write(data);
      });
      setPty(ptyProcess);
    } catch (error) {
      console.log({ error });
    }
  }, []);

  useEffect(() => {
    // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
    // xtermRef.current.terminal.writeln('Hello, World!');
    fitAddon.fit();
  }, []);

  // useEffect(() => {
  //   fitAddon.fit();
  // }, [size.height]);

  return (
    <XTerm
      ref={xtermRef}
      addons={[fitAddon]}
      className="w-full h-[410px]"
      onData={(data) => {
        pty.write(data);

        // const code = data.charCodeAt(0);
        // // If the user hits empty and there is `something` typed echo it.
        // if (code === 13 && input.length > 0) {
        //   xtermRef.current.terminal.write("\r\nYou typed: '" + input + "'\r\n");
        //   xtermRef.current.terminal.write('echo> ');
        //   setInput('');
        // } else if (code < 32 || code === 127) {
        //   // Disable control Keys such as arrow keys
        //   return;
        // } else {
        //   // Add general key press characters to the terminal
        //   xtermRef.current.terminal.write(data);
        //   setInput((prev) => prev + data);
        // }
      }}
    />
  );
};

export default Terminal;
