/** @flow */
/* global gapi */

export const list = () => {
  return window.gapi.client.gmail.users.labels.list({userId: 'me'})
  .then(response => response.result.labels)
}

export const create = labelName => {
  return window.gapi.client.gmail.users.labels.create({
    userId: 'me',
    label: {
      name: labelName
    }
  }).then(response => response.result.labels)
}
