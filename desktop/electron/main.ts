import { app, BrowserWindow, session } from "electron";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const devServerUrl = process.env.VITE_DEV_SERVER_URL;
const devServerOrigin = devServerUrl ? new URL(devServerUrl).origin : null;
if (devServerUrl) {
  const devServer = new URL(devServerUrl);

  if (
    devServer.protocol !== "http:" ||
    devServer.hostname !== "127.0.0.1" ||
    devServer.port !== "5173"
  ) {
    throw new Error("The development server must use http://127.0.0.1:5173");
  }
}
const appHtmlPath = join(__dirname, "../../dist/index.html");
const appHtmlUrl = pathToFileURL(appHtmlPath).href;

function isAppUrl(url: string): boolean {
  if (devServerOrigin) {
    return new URL(url).origin === devServerOrigin;
  }

  return url === appHtmlUrl;
}

function setContentSecurityPolicy(): void {
  const localDevSources = devServerOrigin
    ? ` ${devServerOrigin} ws://127.0.0.1:5173`
    : "";
  const policy = [
    "default-src 'none'",
    `script-src 'self'${localDevSources}`,
    `style-src 'self'${localDevSources}`,
    "img-src 'self'",
    "font-src 'self'",
    `connect-src 'self'${localDevSources}`,
    "object-src 'none'",
    "base-uri 'none'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'none'",
  ].join("; ");

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [policy],
      },
    });
  });
}

function createWindow(): void {
  const window = new BrowserWindow({
    width: 1100,
    height: 760,
    show: false,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event, url) => {
    if (!isAppUrl(url)) {
      event.preventDefault();
    }
  });
  window.once("ready-to-show", () => window.show());

  if (devServerUrl) {
    void window.loadURL(devServerUrl);
  } else {
    void window.loadFile(appHtmlPath);
  }
}

app.whenReady().then(() => {
  setContentSecurityPolicy();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});