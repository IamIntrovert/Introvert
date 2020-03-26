// @flow
import { createSelector } from 'reselect';
import _ from 'lodash';
import moment from 'moment';

const getFilesInfo = state => state.gallery.filesInfo;

export default createSelector(
  [getFilesInfo],
  filesInfo => _.transform(
    _.groupBy(filesInfo, file => moment(file.date).format('YYYY MMMM')),
    (result, data, key) => result.push({
      title: key.slice(5),
      data: [data],
    }),
    []
  )
);
