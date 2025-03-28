const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('node:path');
const log = require('electron-log');

// Initialize log and set custom log file location
log.initialize();
const logPath = path.join(
  'C:\\Users\\ASUS\\Desktop\\sync-software\\Shatayu\\Electron-Shatayu-Sync',
  'app.log'
);
log.transports.file.resolvePathFn = () => logPath;
log.transports.file.level = 'info'; // Ensure log level allows writing

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  log.info('Main window created and index.html loaded.');
};

app.whenReady().then(() => {
  createWindow();
  log.info('App is ready. Checking for updates...');

  // Automatically check for updates and notify user
  autoUpdater.checkForUpdatesAndNotify();
  log.info('Called autoUpdater.checkForUpdatesAndNotify().');

  // Listen for update events and write logs at each step

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...');
    console.log('Checking for update...');
  });

  autoUpdater.on('update-available', (info) => {
    log.info('Update available.', info);
    console.log('Update available.');
  });

  autoUpdater.on('update-not-available', (info) => {
    log.info('Update not available.', info);
    console.log('Update not available.');
  });

  autoUpdater.on('error', (err) => {
    log.error('Error in auto-updater:', err);
    console.error('Error in auto-updater. ' + err);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    let logMessage = `Download speed: ${progressObj.bytesPerSecond} B/s - Downloaded ${progressObj.percent.toFixed(2)}%`;
    log.info(logMessage, progressObj);
    console.log(logMessage);
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded; will install now.', info);
    console.log('Update downloaded; will install now');
    autoUpdater.quitAndInstall();
  });
});

app.on('window-all-closed', () => {
  // On Windows and Linux, quit when all windows are closed.
  if (process.platform !== 'darwin') {
    log.info('All windows closed, quitting app...');
    app.quit();
  }
});
