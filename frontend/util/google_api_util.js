import * as GoogleActions from '../actions/GoogleActions'
import config from '../config';


/**
 * Get the user authentication status
 */
// export const checkAuth = () => {
//   console.log("inside checkAuth()");
//   window.gapi.auth.authorize({
//     'client_id': config.clientId,
//     'scope': config.scope,
//     'immediate': true
//   }, GoogleActions.handleAuthResult();
// }

export const loadGmailApi = () => {
  window.gapi.client.load('gmail', 'v1', listLabels);
}

function listLabels() {
  var request = window.gapi.client.gmail.users.labels.list({
    'userId': 'me'
  });

  request.execute(function(resp) {
    var labels = resp.labels;
    console.log('Labels:');

    if (labels && labels.length > 0) {
      for (i = 0; i < labels.length; i++) {
        var label = labels[i];
        console.log(label.name)
      }
    } else {
      console.log('No Labels found.');
    }
  });
}
