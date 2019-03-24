const {app, BrowserWindow} = require('electron');

const client = require('discord-rich-presence')('469648999373078552');
const project = require('./project.json');
const fs = require('fs');

let mainWindow;

const startTimestamp = new Date();

let presence = {
    largeImageKey: project.largeIMG.toLowerCase(),
    smallImageKey: project.smallIMG.toLowerCase(),

    details: project.name,
    startTimestamp,
    largeImageText: project.largeTXT == '' ? ' ឵឵ ឵឵' : project.largeTXT,
    smallImageText: project.smallTXT == '' ? ' ឵឵ ឵឵' : project.smallTXT,
    state: project.source === '' ? 'Parts complete' : project.source,
    partySize: project.completed,
    partyMax: project.total
}

const updatePresence = () => {
    client.updatePresence(presence);
}

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 740,
        height: 530,
        resizable: false,
        icon: __dirname + '/icon.ico',
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.setMenu(null);

    mainWindow.loadFile('index.html');

    updatePresence();

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

async function setActivity() {
    if (!client || !mainWindow) {
        return;
    }

    const property = await mainWindow.webContents.executeJavaScript('window.presence');

    Object.assign(presence, property);

    let newPresence = {
        name: presence.details,
        source: presence.state.replace('Parts complete', ''),

        largeIMG: presence.largeImageKey,
        smallIMG: presence.smallImageKey,

        largeTXT: presence.largeImageText,
        smallTXT: presence.smallImageText,

        completed: presence.partySize,
        total: presence.partyMax
    }

    let data = JSON.stringify(newPresence, null, 4);

    if (data != JSON.stringify(project, null, 4)) {
        fs.writeFileSync('./project.json', data);
    }

    updatePresence();
}

app.on('ready', () => {
    createWindow();

    setInterval(() => {
        setActivity();
    }, 15e3);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});