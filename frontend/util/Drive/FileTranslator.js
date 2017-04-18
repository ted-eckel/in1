/** @flow */

function translateFile(rawFile) {
  return {
    service: 'drive',
    date: new Date(rawFile.modifiedTime),
    file: rawFile,
    id: rawFile.id
  };
}

export default translateFile;
