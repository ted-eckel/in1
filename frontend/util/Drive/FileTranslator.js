/** @flow */

const _ = require('lodash');
const utf8 = require('utf8');

// import type {TMessage} from './Types';
// type Message = typeof TMessage;

function translateFile(rawFile) {
  return {
    service: 'drive',
    date: new Date(rawFile.modifiedTime),
    file: rawFile
  };
}

export default translateFile;
