import ActionType from '../../actions/ActionType'
import union from 'lodash/union'
import uniq from 'lodash/uniq'
import uniqWith from 'lodash/uniqWith'
import isEqual from 'lodash/isEqual'

module.exports = (files = [], action) => {
  switch (action.type) {
    case ActionType.Drive.File.FETCH_LIST_SUCCESS:
      let oldFiles = union([], files);
      let newFiles = action.files;
      let unionFiles = union(oldFiles, newFiles);

      let nextFiles = uniqWith(unionFiles, isEqual);
      return nextFiles;
    default:
      return files;
  }
}
