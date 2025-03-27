const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('cle');
const path = require('path');

if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL('https://www.electronforge.io'); // Replace with your URL
  // mainWindow.loadURL('https://kiosk.shatayu.online'); // Replace with your URL

  // Check for updates
  autoUpdater.checkForUpdates();
};

app.whenReady().then(() => {
  createWindow();

  autoUpdater.on('update-available', (info) => {
    log.info(`Update available: ${info.version}`);

    // Show a confirmation dialog
    const userResponse = dialog.showMessageBoxSync(mainWindow, {
      type: 'info',
      buttons: ['Update Now', 'Later'],
      defaultId: 0,
      title: 'Update Available',
      message: `A new update (v${info.version}) is available. Do you want to update now?`,
    });

    if (userResponse === 0) {
      // User clicked "Update Now"
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on('update-not-available', () => {
    log.info("No update available");
  });

  autoUpdater.on('error', (err) => {
    log.error(`Update error: ${err}`);
  });

  autoUpdater.on('update-downloaded', () => {
    log.info("Update downloaded. Prompting user to install...");

    // Ask user to install the update
    const installResponse = dialog.showMessageBoxSync(mainWindow, {
      type: 'question',
      buttons: ['Restart Now', 'Later'],
      defaultId: 0,
      title: 'Update Ready',
      message: 'The update has been downloaded. Restart the app to apply the update?',
    });

    if (installResponse === 0) {
      autoUpdater.quitAndInstall();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
