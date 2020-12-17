import express from 'express'
import { CronJob } from 'cron'
import serveIndex from 'serve-index'
import bodyParser from 'body-parser'

import collect from './routes/collect'
import logger from './utils/logger'
import config from '../config.json'
import { getData } from './light-house'

import { init, saveData } from './influx'
import saveReport from './utils/save-report'

const app = express();
app.use(bodyParser.json());

const { urls, cron } = config;

app.use('/collect', collect);
app.use('/reports', express.static('reports'), serveIndex('reports', { icons: true }));

const getDataForAllUrls = async () => {
  // Run lighthouse tests 1 after another.... maybe parallel one day?
  for (const item of urls) {
    try {
      const { url, plugins = [] } = item;

      const pluginConfig = plugins.find(({ name }) => {
        return name === 'lighthouse';
      });

      const { report, config } = pluginConfig || {};
      const { raw, filteredData, html } = (await getData(item.url, config)) || {};

      await saveData(item.url, filteredData);

      if (report) {
        await saveReport(item.url, html)
      }

    } catch (err) {
      console.log(err);
    }
  }

  logger.info('Finished processed all CRON urls');
}

export const main = async () => {
  await init();

  try {
    if (cron) {
      return new CronJob(
        cron,
        async () => {
          getDataForAllUrls();
        },
        null,
        true,
        'Europe/London',
        null,
        true
      );
    }
  } catch (err) {
    console.log(err);
  }
}

if (process.env.ENV !== 'test') {
  app.listen(3000, async () => {
    console.log('Application listening on port 3000');
    await main();
  });
}

export { app }
