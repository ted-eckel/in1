/** @flow */
/* global gapi */

function list() {
  window.gapi.client.gmail.users.labels.list({userId: 'me'})
  .then(response => response.labels)
}

module.exports = {
  list,
};
