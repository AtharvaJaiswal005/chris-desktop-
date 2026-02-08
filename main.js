const { app, BrowserWindow, globalShortcut, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

// Get the correct icon path based on platform
function getIconPath() {
    if (process.platform === 'win32') {
        return path.join(__dirname, 'icons', 'icon.ico');
    } else if (process.platform === 'darwin') {
        return path.join(__dirname, 'icons', 'icon.icns');
    } else {
        return path.join(__dirname, 'icons', 'icon.png');
    }
}

app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

let mainWindow;
let tray;

const CHRISGPT_URL = 'https://chris-gpt-seven.vercel.app/';
const isHiddenLaunch = process.argv.includes('--hidden');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 580,
        height: 750,
        minWidth: 480,
        minHeight: 500,
        title: 'ChrisGPT',
        icon: getIconPath(),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        resizable: true,
        show: false,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#0a0a0f',
            symbolColor: '#a78bfa',
            height: 36
        },
        backgroundColor: '#0a0a0f'
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(CHRISGPT_URL);

    // Inject CSS to make the top area draggable
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.insertCSS(`
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                right: 130px;
                height: 36px;
                -webkit-app-region: drag;
                z-index: 99999;
                pointer-events: auto;
            }
            /* Make sure buttons/inputs in that area are still clickable */
            button, input, a, select, textarea, [role="button"] {
                -webkit-app-region: no-drag;
            }
        `);
    });

    mainWindow.once('ready-to-show', () => {
        if (!isHiddenLaunch) {
            mainWindow.show();
        }
    });

    mainWindow.on('close', (e) => {
        e.preventDefault();
        mainWindow.hide();
    });
}

function createTray() {
    const iconPath = getIconPath();
    let trayIcon;

    try {
        trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
    } catch {
        trayIcon = nativeImage.createEmpty();
    }

    tray = new Tray(trayIcon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show ChrisGPT',
            click: () => {
                mainWindow.show();
                mainWindow.focus();
            }
        },
        {
            label: 'Hide',
            click: () => mainWindow.hide()
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: () => {
                mainWindow.destroy();
                app.quit();
            }
        }
    ]);

    tray.setToolTip('ChrisGPT');
    tray.setContextMenu(contextMenu);

    tray.on('click', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
            mainWindow.focus();
        }
    });
}

app.whenReady().then(() => {
    createWindow();
    createTray();

    // Auto-start on login
    app.setLoginItemSettings({
        openAtLogin: true,
        openAsHidden: true,
        args: ['--hidden']
    });

    // Global hotkey: Ctrl+Space to toggle ChrisGPT
    globalShortcut.register('CommandOrControl+Space', () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
            mainWindow.focus();
        }
    });
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
