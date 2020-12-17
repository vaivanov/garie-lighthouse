import express from 'express'

import { getData } from '../../light-house'
import { saveData } from '../../influx'
import logger from '../../utils/logger'
import saveReport from '../../utils/save-report'


const router = express.Router();

router.post('/', async (req, res, next) => {

  const { body = {} } = req;
  const { url, report = false } = body;

  if (!url) {
    logger.info('/collect missing `url` data');
    return res.sendStatus(400);
  }

  try {

    const { raw, filteredData, html } = await getData(url) || {};

    await saveData(url, filteredData);

    if (report) {
      await saveReport(url, html);
    }

    res.status(201).send(filteredData)
  } catch (err) {
    logger.error(`Failed to get or save data for ${url}`, err);
    res.sendStatus(500);
  }


})

export default router
