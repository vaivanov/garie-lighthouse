import fs from 'fs-extra'
import path from 'path'
import logger from '../../utils/logger'

export default async (url, html) => {
  try {

    const date = new Date();
    return fs.outputFile(path.join(__dirname, '../../../reports', url.replace(/(^\w+:|^)\/\//, ''), `${new Date().toISOString()}.html`), html);

  } catch (err) {
    logger.error(`Failed to generate report for ${url}`, err);
    return Promise.reject('Failed to generate report');
  }
}
