import getGroupedByDateImages from '../selectors';

describe(('Gallery selectors tests suits'), () => {
  describe('filesInfo grouped by date selectors', () => {
    const testObject1 = {
      filesInfo: [
        { date: '2017-11-24T16:09:18.664Z' },
        { date: '2017-11-24T16:09:18.664Z' },
        { date: '2017-11-24T16:09:18.664Z' },
        { date: '2017-10-24T16:09:18.664Z' },
        { date: '2018-09-24T16:09:18.664Z' },
        { date: '2018-09-24T16:09:18.664Z' },
        { date: '2018-08-24T16:09:18.664Z' },
        { date: '2018-08-24T16:09:18.664Z' },
        { date: '2019-04-24T16:09:18.664Z' },
        { date: '2019-04-24T16:09:18.664Z' },
        { date: '2019-01-24T16:09:18.664Z' },
        { date: '2019-03-24T16:09:18.664Z' },
      ],
    };

    const testResults = {
      October: [{ date: '2017-10-24T16:09:18.664Z' }],
      November: [
        { date: '2017-11-24T16:09:18.664Z' },
        { date: '2017-11-24T16:09:18.664Z' },
        { date: '2017-11-24T16:09:18.664Z' },
      ],
      August: [
        { date: '2018-08-24T16:09:18.664Z' },
        { date: '2018-08-24T16:09:18.664Z' },
      ],
      September: [
        { date: '2018-09-24T16:09:18.664Z' },
        { date: '2018-09-24T16:09:18.664Z' },
      ],
      January: [{ date: '2019-01-24T16:09:18.664Z' }],
      March: [{ date: '2019-03-24T16:09:18.664Z' }],
      April: [
        { date: '2019-04-24T16:09:18.664Z' },
        { date: '2019-04-24T16:09:18.664Z' },
      ],
    };

    it('getGroupedByDateImages should return properly formed sections', () => {
      const results = getGroupedByDateImages(testObject1);

      expect(results).toBeTruthy();
      expect(results).toEqual(testResults);
    });
  });
});
