import { ConsoleTransportOptions } from 'winston/lib/winston/transports'
import influx from './influx'
import logger from '../utils/logger'


export const init = async () => {
  try {
    const names = await influx.getDatabaseNames();

    if (names.indexOf('lighthouse') === -1) {
      logger.info('InfluxDB: lighthouse database does not exist. Creating database');
      return influx.createDatabase('lighthouse');
      logger.info('InfluxDB: lighthouse database created');
    }
    logger.info('InfluxDB', 'lighthouse database already exists. Skipping creation.');
    return Promise.resolve();
  } catch (err) {
    return Promise.reject('Failed to initialize influx')
  }
}
/**
 * Insert all key value pairs into the DB
 * @param {String} url - Url from the peroformance data to save
 * @param {*} data - Data to save
 */
export const saveData = async (url, data) => {
  try {
    const points = Object.keys(data).reduce((points, key) => {
      if (data[key]) {
        points.push({
          measurement: key,
          tags: { url },
          fields: { value: data[key] }
        })
      }
      return points;
    }, []);


    const result = await influx.writePoints(points);
    logger.info(`Successfully saved lighthouse data for ${url}`)
    return result;

  } catch (err) {
    logger.error(`Failed to save lighthouse data for ${url}`, err)
  }

}

