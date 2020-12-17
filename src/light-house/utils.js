import lighthouse from 'lighthouse'
// import chromeLauncher from 'chrome-launcher'
const chromeLauncher = require('chrome-launcher')

const chromeFlags = [
  '--disable-gpu',
  '--headless',
  '--no-zygote',
  '--no-sandbox',
  '--headless',
];

export const launchChromeAndRunLighthouse = async (url, config) => {

  const chrome = await chromeLauncher.launch({ chromeFlags });

  const flags = {
    port: chrome.port,
    output: 'html',
  };

  const result = await lighthouse(url, flags, config);

  await chrome.kill();

  return result;
}
