const path = require("path");
const url = require("url");
const { app, BrowserWindow, ipcMain } = require("electron");
const AppTray = require('./utils/AppTray');
const { getDefaultContext, login, getNamespaces, getNamespaceDetails } = require('./utils/kubectl');
const { parseDataFile } = require('./utils/files');
const Store = require('./utils/Store');
const os = require('os');
const slash = require('slash');

const userConfigPath = path.join(os.homedir(), "kubeui", "config.json")
const userConfig = parseDataFile(slash(userConfigPath), {})

const environments = userConfig.environments || {}
const defaultEnvironment = userConfig['default-environment'] || null
const { defaultContext, defaultNamespace } = getDefaultContext(environments, defaultEnvironment)
const kubectlAlias = userConfig.kubectl && userConfig.kubectl.alias ? userConfig.kubectl.alias : 'kubectl'
const authenticationEnabled = !!userConfig.authentication

const isDev = process.env.NODE_ENV === "development";
const appState = {
  tray: null,
  active: false,
};

const store = new Store({
  configName: 'user-settings',
  defaults: {
    settings: {
      lastLoginTimestamp: 0
    },
  },
})

const isLoggedIn = () => {
  const timeElapsedSinceLastLogin = ((+new Date()) - store.get('lastLoginTimestamp')) / 1000
  return (timeElapsedSinceLastLogin / 3600) < 1
}

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

    if(!authenticationEnabled || isLoggedIn()) {
      mainWindow.webContents.send('login:success')
    } else if(authenticationEnabled && !userConfig.authentication[defaultEnvironment]) {
      mainWindow.webContents.send('error:auth-mismatch')
    }
    
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
      const namespaces = await getNamespaces(kubectlAlias, defaultContext)
      sendNamespaces(
        mainWindow, 
        namespaces.data
          .filter(namespace => !defaultNamespace || namespace.name.includes(defaultNamespace))
          .slice(1, 10)
      )
    } catch (err) {
      console.error(err)
    }
  })

  ipcMain.on('namespace-details:load', async (e, namespaceName) => {
    try {
      const namespaceDetails = await getNamespaceDetails(kubectlAlias, defaultContext, namespaceName)
      sendNamespaceDetails(mainWindow, namespaceDetails)
    } catch (err) {
      console.error(err)
    }
  })

  ipcMain.on('login', async (e, item) => {
    try {
      const loginCommand = userConfig.authentication && defaultEnvironment ? userConfig.authentication[defaultEnvironment] : false
      await login(loginCommand)
      mainWindow.webContents.send('login:success')

      store.set('lastLoginTimestamp', +new Date())

      setTimeout(() => {
        mainWindow.webContents.send('logout')
      }, 3600 * 1000)
    } catch (err) {
      console.error(err)
    }
  })

  const icon = path.join(__dirname, 'assets', 'icons', 'tray-icon.png')
  appState.tray = new AppTray(icon, mainWindow)
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
