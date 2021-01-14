const path = require("path");
const url = require("url");
const { app, BrowserWindow, ipcMain } = require("electron");
const AppTray = require('./utils/AppTray')
const { login, getNamespaces, getNamespaceDetails } = require('./utils/kubectl')

const isDev = process.env.NODE_ENV === "development";
const appState = {
  active: false,
};

const sendNamespaces = (mainWindow, data) => {
  mainWindow.webContents.send('namespaces:get', JSON.stringify(data))
}

const sendNamespaceDetails = (mainWindow, data) => {
  mainWindow.webContents.send('namespace-details:get', JSON.stringify(data))
}

const getIndexPath = () => {
  if (isDev && process.argv.indexOf("--noDevServer") === -1) {
    return url.format({
      protocol: "http:",
      host: "localhost:8080",
      pathname: "index.html",
      slashes: true,
    });
  } else {
    return (indexPath = url.format({
      protocol: "file:",
      pathname: path.join(__dirname, "dist", "index.html"),
      slashes: true,
    }));
  }
};

const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: isDev ? 1400 : 1100,
    height: 800,
    show: false,
    icon: `${__dirname}/assets/icons/icon.png`,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const indexPath = getIndexPath();
  mainWindow.loadURL(indexPath);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    if (isDev) {
      // Open devtools
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require("electron-devtools-installer");

      installExtension(REACT_DEVELOPER_TOOLS).catch((err) =>
        console.log("Error loading React DevTools: ", err)
      );
      mainWindow.webContents.openDevTools();
    }
  });

  mainWindow.on("closed", () => (appState.active = false));
  appState.active = true;

  return mainWindow
};

app.on("ready", () => {
  const mainWindow = createMainWindow()

  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault()
      mainWindow.hide()
    }

    return true
  })

  ipcMain.on('namespaces:load', async (e) => {
    try {
      const namespaces = await getNamespaces()
      sendNamespaces(mainWindow, namespaces)
    } catch (err) {
      console.error(err)
    }
  })

  ipcMain.on('namespace-details:load', async (e, namespaceName) => {
    try {
      const namespaceDetails = await getNamespaceDetails(namespaceName)
      sendNamespaceDetails(mainWindow, namespaceDetails)
    } catch (err) {
      console.error(err)
    }
  })

  ipcMain.on('login', async (e, item) => {
    try {
      await login()
      mainWindow.webContents.send('login:success')

      setTimeout(() => {
        mainWindow.webContents.send('logout')
      }, 3600 * 1000)
    } catch (err) {
      console.error(err)
    }
  })

  const icon = path.join(__dirname, 'assets', 'icons', 'tray-icon.png')
  new AppTray(icon, mainWindow)
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (!appState.active) {
    createMainWindow();
  }
});


app.allowRendererProcessReuse = true;
