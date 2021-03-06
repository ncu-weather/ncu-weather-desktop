var url = require('url')
const path = require('path')
const {app, BrowserWindow} = require('electron')

let win = null

app.on('ready', function () {
  createWindow()
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('window-all-closed', function () {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

function createWindow () {
  let windowOptions = {
    width: 1000,
    minWidth: 375,
    height: 600
  }
  if (process.platform === 'linux') {
    windowOptions.icon = path.join(__dirname, '/src/assets/icon.png')
  }
  win = new BrowserWindow(windowOptions)

  // win.loadURL('http://localhost:8080')
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', function () {
    win = null
  })
}
