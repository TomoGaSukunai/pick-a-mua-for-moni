const {
    app,
    BrowserWindow,
} = require('electron')


app.setAppUserModelId("org.ayaphis.asaumi")

let mainWindow = null

app.on('ready', () => {  

    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        
        },
        resizable:false,
        autoHideMenuBar: true
    })

    mainWindow.loadURL(`file://${__dirname}/index.html`)
    // mainWindow.openDevTools()
})


