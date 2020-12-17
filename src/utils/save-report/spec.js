import fsExtra from 'fs-extra'
import fs from 'fs'
import path from 'path'

import saveReport from './'
import mockData from '../../../test/mock-data/lighthouse-test-data.json'


describe('save-report', () => {

  beforeAll(() => {
    fsExtra.emptyDirSync(path.join(__dirname, '../../../reports/www.save-report-test.co.uk'));
  })

  afterEach(() => {
    fsExtra.emptyDirSync(path.join(__dirname, '../../../reports/www.save-report-test.co.uk'))
  });

  it('generates a light house report and save it to disk when generateReport is successful', async () => {

    const today = new Date();

    await saveReport('https://www.save-report-test.co.uk', '<html></html>');

    const filesInFolder = fs.readdirSync(path.join(__dirname, '../../../reports/www.save-report-test.co.uk'));

    const fileMatch = new Date().toISOString().match(/[^T]*/);

    expect(filesInFolder).toHaveLength(1);
    expect(filesInFolder[0].indexOf(fileMatch[0]) > -1).toEqual(true);

  });

  // it('throws an error if generating the lighthouse report fails', async () => {

  //   const today = new Date();

  //   return await expect(saveReport('https://www.save-report-test.co.uk', undefined)).rejects.toMatch('Failed to generate report');

  // });

});
