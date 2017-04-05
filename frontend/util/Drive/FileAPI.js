import ActionType from '../../actions/ActionType'
import translateFile from './FileTranslator'

export const list = options => {
  return window.gapi.client.drive.files.list({
    corpus: options.corpus || null,
    orderBy: options.orderBy || null,
    pageSize: options.pageSize || null,
    pageToken: options.pageToken || null,
    q: options.query || null,
    spaces: options.spaces || null,
    fields: options.fields || null
  }).then(listResponse => {
    return {
      nextPageToken: listResponse.result.nextPageToken,
      files: listResponse.result.files.map(file => translateFile(file))
    }
  });
}
