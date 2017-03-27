import ActionType from '../../actions/ActionType'
import API from '../API'
import translateFile from './FileTranslator'

declare class FileListResult {
  kind: ?string;
  nextPageToken: ?string;
  files: Array<Object>;
}

export function list(
  options: {
    corpus: ?string;
    orderBy: ?string;
    pageSize: number;
    pageToken: ?string;
    q: ?string;
    spaces: ?string;
    fields: ?string;
  }
): Promise<FileListResult> {
  return API.wrap(() => {
    return API.execute(window.gapi.client.drive.files.list({
      corpus: options.corpus || null,
      orderBy: options.orderBy || null,
      pageSize: options.pageSize || null,
      pageToken: options.pageToken || null,
      q: options.query || null,
      spaces: options.spaces || null,
      fields: options.fields || null
    })).then(listResponse => {
      return {
        nextPageToken: listResponse.nextPageToken,
        files: listResponse.files.map(file => {
          return translateFile(file)
        })
      }
    });
  });
}
