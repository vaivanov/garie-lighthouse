import { getData } from './index'

import { launchChromeAndRunLighthouse, createReport } from './utils'
import logger from '../utils/logger'
import mockData from '../../test/mock-data/lighthouse-test-data.json'

const URL = 'https://www.test.com';

jest.mock('./utils', () => {
  return {
    launchChromeAndRunLighthouse: jest.fn(),
    createReport: jest.fn()
  };
});

jest.mock('../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn()
}));

describe('reporter', () => {
  beforeEach(() => {
    launchChromeAndRunLighthouse.mockClear();
    createReport.mockClear();
  });

  describe('getData', () => {
    it('opens chrome and runs lighthouse with the given url and default lighthouse configuration', () => {
      getData(URL);
      expect(launchChromeAndRunLighthouse).toBeCalledWith(URL, { extends: 'lighthouse:default' });
    });

    it('opens chrome and runs lighthouse with the given url and custom lighthouse configuration', () => {
      getData(URL, { settings: { emulatedFormFactor: 'desktop ' } });
      expect(launchChromeAndRunLighthouse).toBeCalledWith(URL, { extends: 'lighthouse:default', settings: { emulatedFormFactor: 'desktop ' } });
    });

    it('returns filtered data when successfully getting data from lighthouse', async () => {
      launchChromeAndRunLighthouse.mockResolvedValue(mockData);

      const { filteredData } = await getData(URL);

      expect(filteredData).toEqual({
        'performance-score': 100,
        'pwa-score': 50,
        'accessibility-score': 88,
        'best-practices-score': 100,
        'seo-score': 89,
        firstContentfulPaint: 780,
        firstMeaningfulPaint: 823,
        firstCPUIdle: 866,
        interactive: 866,
        speedIndex: 903,
        estimatedInputLatency: 13,
        'errors-in-console': 0,
        'time-to-first-byte': 104.07399999999998,
        interactive: 866,
        redirects: 0
      });
    });

    it('returns raw data when successfully getting data from lighthouse', async () => {
      launchChromeAndRunLighthouse.mockResolvedValue(mockData);

      const { raw } = await getData(URL);

      expect(raw).toEqual(mockData.lhr);
    });

    it('logs an error when failing to get data from lighthouse', async () => {
      launchChromeAndRunLighthouse.mockRejectedValue();

      const result = await getData(URL);

      expect(logger.error.mock.calls[0][0]).toBe('Failed to get data for https://www.test.com');
    });
  });

});
