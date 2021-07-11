/* eslint global-require: off, no-console: off */

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import { exec, spawn } from 'child_process';
// import { writeFileSync, readFileSync } from 'fs';
import log from 'electron-log';
import MenuBuilder from './menu';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    // show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  const baseFolder = app.getPath('userData');
  console.log(baseFolder);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

// App name workaround
const appName = 'Kathara GUI';
app.setName(appName);
const appData = app.getPath('appData');
app.setPath('userData', path.join(appData, appName));

// Set default storage location of Kathara labs
const preferredPath = path.join(app.getPath('documents'), 'Kathara Labs');
try {
  if (!existsSync(preferredPath)) {
    mkdirSync(preferredPath);
  }
  app.setPath('documents', preferredPath);
  console.log(app.getPath('documents'));
} catch (err) {
  console.error(err);
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

/* ---------------------------------------------------------- */
/* ------------------------- EVENTS ------------------------- */
/* ---------------------------------------------------------- */

let baseFolder = app.getPath('userData');
console.log({ baseFolder });

function runKatharaCommand(command: string, event: Electron.IpcMainEvent) {
  /* ---------------------------------------------------------- */
  /* ------------------------- kathara spawn ------------------------- */
  /* ---------------------------------------------------------- */

  let output;
  const child = spawn(`kathara ${command}`, {
    // stdio: 'inherit',
    shell: true,
  });

  child.stdout.on('data', (data) => {
    console.log(`stdout:${data}`);
    output = data.toString();
    event.reply('script:stdout-reply', output);
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    output = data.toString();
    event.reply('script:stderr-reply', output);
  });

  child.on('error', (error) => {
    console.error(`error: ${error.message}`);
    output = error.message;
    event.reply('script:error-reply', output);
  });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    output = code;
    event.reply('script:code-reply', code);
  });
}

/* ------------------------- SCRIPT ------------------------- */

ipcMain.on('script:copy', function (event, script, filename, dirPath) {
  console.log({ filename });

  let pathTemp = path.join(dirPath, filename);
  console.log('Saving script to ' + pathTemp);
  writeFileSync(pathTemp, script);

  // console.log({ filename });
  // console.log(app.getName());
  // console.log({ baseFolder });
  // let pathTemp = path.join(baseFolder, filename);
  // console.log('Saving script to ' + pathTemp);
  // writeFileSync(pathTemp, script);

  console.log('Running ' + pathTemp);
  exec(
    `bash ${filename}`,
    {
      cwd: dirPath,
    },
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
});

ipcMain.on('script:execute', (event, dirPath) => {
  let pathTemp = path.join(dirPath, 'lab');
  console.log(`Running LStart on ${pathTemp}`);
  runKatharaCommand(`lstart -d "${pathTemp}"`, event);
});

ipcMain.on('script:clean', (event, dirPath) => {
  let pathTemp = path.join(dirPath, 'lab');
  console.log(`Running LClean on ${pathTemp}`);
  runKatharaCommand(`lclean -d "${pathTemp}"`, event);
});

ipcMain.on('script:check', (event) => {
  console.log(`Checking if Kathara is installed`);
  runKatharaCommand(`-v`, event);
});

ipcMain.on('script:checkDocker', (event) => {
  console.log(`Checking if Docker daemon is running`);
  const docker = exec(`docker info `, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });

  docker.on('exit', (code) => {
    console.log(`exit code: ${code}`);
    event.reply('script:code-reply', code);
  });
});
