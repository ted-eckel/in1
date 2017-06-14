/** @flow */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Dropzone from 'react-dropzone'
import Moment from 'moment'
import { convertFromHTML, convertToHTML } from 'draft-convert'
import injectTapEventPlugin from "react-tap-event-plugin"
injectTapEventPlugin();

import Bar from './Bar'
import Drawer from './Drawer'
import Items from './Items'
import CreateNoteModal from './CreateNoteModal'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { EditorState, convertFromRaw } from 'draft-js'


import * as PocketActions from '../actions/PocketActions'
import * as GoogleActions from '../actions/Google/GoogleActions'
import * as AppActions from '../actions/AppActions'
import * as GmailThreadActions from '../actions/Gmail/ThreadActions'
import * as FileActions from '../actions/Drive/FileActions'
import * as GmailAppActions from '../actions/Gmail/AppActions'
import * as DriveAppActions from '../actions/Drive/AppActions'
import * as NoteActions from '../actions/NoteActions'
import { push } from 'react-router-redux'

import {
  drawerOpenSelector,
  keepModalOpenSelector,
  createNoteModalOpenSelector,
  searchQuerySelector,
  getAllItemsSelector,
  endOfListSelector,
  allAuthSelector,
  isFetchingSelector,
  hasMoreThreadsSelector,
  driveHasMoreFilesSelector,
  pocketHasMoreItemsSelector,
  threadsByIDSelector,
  currentUserSelector,
  createdNoteSelector,
} from '../selectors'

// const PAGE_SIZE = 20;

@connect(
  state => ({
    drawerOpen: drawerOpenSelector(state),
    keepModalOpen: keepModalOpenSelector(state),
    createNoteModalOpen: createNoteModalOpenSelector(state),
    searchQuery: searchQuerySelector(state),
    getAllItems: getAllItemsSelector(state),
    endOfList: endOfListSelector(state),
    gmailHasMoreThreads: hasMoreThreadsSelector(state),
    driveHasMoreFiles: driveHasMoreFilesSelector(state),
    pocketHasMoreItems: pocketHasMoreItemsSelector(state),
    allAuth: allAuthSelector(state),
    isFetching: isFetchingSelector(state),
    gmailThreadsByID: threadsByIDSelector(state),
    currentUser: currentUserSelector(state),
    createdNoteState: createdNoteSelector(state),
  }),
  dispatch => bindActionCreators({
    fetchPocketItems: PocketActions.fetchItems,
    pocketArchiveItem: PocketActions.archiveItem,
    pocketDeleteItem: PocketActions.deleteItem,
    toggleDrawer: AppActions.toggleDrawer,
    fetchEverything: AppActions.fetchEverything,
    dispatchAllItems: AppActions.dispatchAllItems,
    gmailLoadThreadList: GmailThreadActions.loadList,
    gmailTrashThread: GmailThreadActions.trash,
    gmailArchiveThread: GmailThreadActions.archive,
    driveFetchFiles: FileActions.loadList,
    gmailAuthRequest: GoogleActions.gmailAuthRequest,
    driveAuthRequest: GoogleActions.driveAuthRequest,
    driveAuthSuccess: GoogleActions.driveAuthSuccess,
    driveAuthFailure: GoogleActions.driveAuthFailure,
    gmailAuthSuccess: GoogleActions.gmailAuthSuccess,
    gmailAuthFailure: GoogleActions.gmailAuthFailure,
    gmailLogin: GmailAppActions.gmailLogin,
    driveLogin: DriveAppActions.driveLogin,
    toggleKeepModal: AppActions.toggleKeepModal,
    setUploadFolderId: AppActions.setUploadFolderId,
    fetchNotes: NoteActions.fetchNotes,
    uploadNotes: NoteActions.uploadNotes,
    toggleCreateNoteModal: AppActions.toggleCreateNoteModal,
    updateCreatedNoteTitle: NoteActions.updateCreatedNoteTitle,
    updateCreatedNoteContent: NoteActions.updateCreatedNoteContent,
    createNote: NoteActions.createNote,
    trashNote: NoteActions.trashNote,
    archiveNote: NoteActions.archiveNote,
    updateNote: NoteActions.updateNote,
    push
  }, dispatch),
)

class App extends Component {

  static propTypes = {
    params: PropTypes.object.isRequired
  }

  componentWillMount() {
    this.props.gmailAuthFailure()
    this.props.driveAuthFailure()
  }

  handleLoadMore = () => {
    const {
      fetchPocketItems, endOfList, allAuth, isFetching, driveFetchFiles,
      searchQuery, gmailLoadThreadList, fetchEverything, gmailHasMoreThreads,
      dispatchAllItems, getAllItems, driveHasMoreFiles, pocketHasMoreItems,
      fetchNotes
    } = this.props;

    // let promiseArray = []
    //
    // if (allAuth.all && !isFetching.any) {
    //   if (allAuth.gmail && gmailHasMoreThreads) {
    //     promiseArray.push(gmailLoadThreadList(searchQuery));
    //   }
    //
    //   if (allAuth.pocket && pocketHasMoreItems) {
    //     promiseArray.push(fetchPocketItems());
    //   }
    //
    //   if (allAuth.drive && driveHasMoreFiles) {
    //     promiseArray.push(driveFetchFiles());
    //   }
    //
    //   promiseArray.push(fetchNotes());
    //
    //   fetchEverything(promiseArray)
    // }
    if (!isFetching.any) {
      fetchNotes()
    }
  }

  handleRequestDelete = e => {
    e.preventDefault();
    alert('You clicked the delete button.');
  }

  _onLogoClick = () => {
    window.location.reload();
  }

  toggleKeepModal = () => {
    this.props.toggleKeepModal();
  }

  processFiles(innerHtmlArray, uploadsFolderId) {
    const { uploadNotes, currentUser } = this.props;
    let notesArray = [];
    let attachmentArray = [];

    innerHtmlArray.forEach((innerHtml, idx) => {
      console.log(`note ${idx}`);
      let noteObject = {};
      var el = document.createElement( 'html' );
      el.innerHTML = innerHtml;

      let bullets = el.getElementsByClassName('bullet')
      if (bullets) {
        while (bullets.length > 0){
          bullets[0].parentNode.removeChild(bullets[0])
        }
      }

      let title = el.getElementsByClassName('title')[0];
      if (title) { noteObject.title = title.innerText };

      noteObject.content = el.getElementsByClassName('content')[0].innerHTML;

      let color =  el.getElementsByClassName('note')[0].className.split(" ")[1];
      if (color) { noteObject.color = color };

      let heading = el.getElementsByClassName('heading')[0].innerText.trim();
      noteObject.created_at = Moment(heading, "MMM D, YYYY h:mm:ss A").format();

      let archived = el.getElementsByClassName('archived')[0];
      if (archived) {
        noteObject.state = 'ARCHIVE'
      }

      let labels = el.getElementsByClassName('label');
      if (labels[0]) {
        // let labelArr = [];
        let labelString = `${currentUser.id}`;
        for (let labelIdx=0; labelIdx<labels.length; labelIdx++){
          // labelArr.push({
          //   name: labels[labelIdx].innerText.trim(),
          //   user_id: currentUser.id
          // })
          labelString += `-------314159265358979323846${labels[labelIdx].innerText}`
          // if (labels.length) {
          //   labelString += `, ${labels[labelIdx].innerText}`
          // } else {
          //   labelString += `${labels[labelIdx].innerText}`
          // }
        }
        // noteObject.all_tags = labelArr;
        noteObject.all_tags = labelString;
      }

      noteObject.user_id = currentUser.id;

      console.log('noteObject:')
      console.log(noteObject)
      notesArray.push(noteObject)


      let attachments = el.getElementsByClassName('attachments')[0];
      if (attachments) {
        let liArray = attachments.children[0].children;
        for (let i=0; i<liArray.length; i++){
          let attachment = liArray[i].children[0];
          let type;
          let base64Data;
          if (attachment.tagName === 'A') {
            type = attachment.href.match(/data:(.*);base64,/)[1] || 'application/octet-stream';
            base64Data = attachment.href.replace(/^data:audio\/3gpp;base64,/, "");
          }

          if (attachment.tagName === 'IMG') {
            type = attachment.src.match(/data:(.*);base64,/)[1] || 'application/octet-stream';
            base64Data = attachment.src.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
          }

          attachmentArray.push({
            noteArrayIdx: idx,
            contentType: type,
            metadata: {
              'name': `${noteObject.title ? noteObject.title : noteObject.created_at}_${i}`,
              'mimeType': type,
              parents: [uploadsFolderId],
            },
            base64Data: base64Data
          })
        }
      }
    })

    if (attachmentArray.length) {
      this.uploadKeepAttachments(attachmentArray, notesArray)
    } else {
      uploadNotes(notesArray)
    }
  }

  uploadKeepAttachments(attachmentArray, notesArray) {
    const { uploadNotes } = this.props;

    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    let returnedRequests = 0;
    let i = 0;
    const timeout = () => {
      setTimeout(() => {
        let el = attachmentArray[i];

        let multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(el.metadata) +
        delimiter +
        'Content-Type: ' + el.contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        el.base64Data +
        close_delim;

        /*return */window.gapi.client.request({
          'path' : '/upload/drive/v3/files',
          'method' : 'POST',
          'params' : {'uploadType' : 'multipart'},
          'headers' : {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
          },
          'body': multipartRequestBody
        }).then(response => {
          console.log('response:')
          console.log(response)
          if (notesArray[el.noteArrayIdx].drive_attachment_ids) {
            notesArray[el.noteArrayIdx].drive_attachment_ids += (' ' + response.result.id)
          } else {
            notesArray[el.noteArrayIdx].drive_attachment_ids = (response.result.id)
          }
          console.log('notesArray:')
          console.log(notesArray)

          returnedRequests += 1;
          console.log(`returnedRequests: ${returnedRequests}`)
          if (returnedRequests === attachmentArray.length) {
            console.log('hits if block')
            uploadNotes(notesArray)
          }
        }, error => {console.log(error)})

        i++

        timeout()
      }, 5000)
    }

    timeout()
  }

  createUploadsFolder() {
    return window.gapi.client.drive.files.create({
      resource: {
        'name': 'in1box uploads',
        'mimeType': 'application/vnd.google-apps.folder'
      }
    })
  }

  onDrop(acceptedFiles, rejectedFiles) {
    const { setUploadFolderId, currentUser } = this.props;
    let innerHtmlArray = [];
    console.log(`acceptedFiles.length => ${acceptedFiles.length}`);
    console.log(`rejectedFiles.length => ${rejectedFiles.length}`);
    console.log('currentUser:')
    console.log(currentUser)

    acceptedFiles.forEach((file, idx) => {
      console.log(idx);
      let reader = new FileReader()

      reader.onload = () => {
        innerHtmlArray.push(reader.result)

        if (idx === acceptedFiles.length - 1) {
          if (currentUser.settings.drive_uploads_folder_id) {
            //TODO: check to see if this exists
            this.processFiles(innerHtmlArray, currentUser.settings.drive_uploads_folder_id)
          } else {
            this.createUploadsFolder().then(response => {
              console.log(response)
              setUploadFolderId(response.result.id)
              this.processFiles(innerHtmlArray, response.result.id)
            })
          }
        }
      }

      reader.readAsText(file)
    })
  }

  render() {
    let { driveAuthSuccess, driveAuthFailure, gmailAuthSuccess,
        gmailAuthFailure, gmailAuthRequest, driveAuthRequest } = this.props;

    const keepModalActions = [
      <FlatButton
        label="Close"
        style={{color: '#202020'}}
        onTouchTap={this.props.toggleKeepModal}
      />
    ];

    window.handleGoogleClientLoad = () => {
      window.gapi.load('client:auth2', initClient);
    }

    const initClient = () => {
      window.gapi.auth2.init(
        {
          client_id: '128518506637-qcrlhsu7pnivdarnagtshk9hdv600c4c.apps.googleusercontent.com'
        }
      ).then(GoogleAuth => {
        let isSignedIn = GoogleAuth.isSignedIn.get();
        // console.log(`isSignedIn: ${isSignedIn}`)
        if (isSignedIn) {
          let currentUser = GoogleAuth.currentUser.get();
          // console.log(`currentUserEmail: ${currentUser.getBasicProfile().getEmail()}`)
          let scopes = currentUser.getGrantedScopes();
          // console.log(`scopes: ${scopes}`)

          if (scopes.includes("https://www.googleapis.com/auth/gmail.modify")){
            gmailAuthRequest();
            window.gapi.client.load(
              "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"
            )
            // window.gapi.client.init({
            //   discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
            //   clientId: '128518506637-qcrlhsu7pnivdarnagtshk9hdv600c4c.apps.googleusercontent.com',
            //   scope: "https://www.googleapis.com/auth/gmail.modify"
            // })
            .then(res => gmailAuthSuccess(), err => gmailAuthFailure())
          } else {
            gmailAuthFailure()
          }

          if (checkInclusion(scopes, [
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/drive.appdata",
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/drive.metadata",
            "https://www.googleapis.com/auth/drive.photos.readonly"
          ])) {
            driveAuthRequest();
            window.gapi.client.load(
              "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
            )
            // window.gapi.client.init({
            //   discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
            //   clientId: '128518506637-qcrlhsu7pnivdarnagtshk9hdv600c4c.apps.googleusercontent.com',
            //   scope: "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.metadata https://www.googleapis.com/auth/drive.photos.readonly"
            // })
            .then(res => driveAuthSuccess(), err => gmailAuthFailure())
          } else {
            driveAuthFailure()
          }
        } else {
          driveAuthFailure();
          gmailAuthFailure();
        }
      });
    }

    const checkInclusion = (str, arr) => {
      for (let i = 0; i < arr.length; i++){
        if (str.includes(arr[i]) === false) { return false }
      }
      return true;
    }

    return (
      <MuiThemeProvider style={{width: "100%", height: "100%"}}>
        <div>
          <div>
            <Drawer
              drawerOpen={this.props.drawerOpen}
              toggleDrawer={this.props.toggleDrawer}
              toggleKeepModal={this.props.toggleKeepModal}
              allAuth={this.props.allAuth}
              gmailLogin={this.props.gmailLogin}
              driveLogin={this.props.driveLogin}
            />
          </div>
          <Bar />
          <Items
            allAuth={this.props.allAuth}
            handleRequestDelete={this.handleRequestDelete}
            handleLoadMore={this.handleLoadMore}
            drawerOpen={this.props.drawerOpen}
            items={this.props.getAllItems}
            endOfList={this.props.endOfList}
            gmailTrashThread={this.props.gmailTrashThread}
            gmailArchiveThread={this.props.gmailArchiveThread}
            gmailThreadsByID={this.props.gmailThreadsByID}
            pocketArchiveItem={this.props.pocketArchiveItem}
            pocketDeleteItem={this.props.pocketDeleteItem}
            trashNote={this.props.trashNote}
            archiveNote={this.props.archiveNote}
            toggleCreateNoteModal={this.props.toggleCreateNoteModal}
            createdNoteState={this.props.createdNoteState}
            currentUser={this.props.currentUser}
          />
          <Dialog
            title="Upload Google Keep Notes"
            actions={keepModalActions}
            modal={false}
            open={this.props.keepModalOpen}
            onRequestClose={this.props.toggleKeepModal}>
            <Dropzone accept="text/html" onDrop={this.onDrop.bind(this)}
              style={{
                borderStyle: 'solid', height: '200px', borderWidth: '2px',
                borderColor: 'rgb(102, 102, 102)', borderRadius: '5px'
              }}>
              <p style={{textAlign: 'center', position: 'relative', top: '48%'}}>
                Try dropping some exported Google Keep notes here, or click to select which html files to upload.
              </p>
            </Dropzone>
            <div style={{marginTop: '10px'}}>
              <a style={{textDecoration: 'underline'}}
                href='https://takeout.google.com/settings/takeout'>Click here</a>{" "}
              to download your Google Keep notes. Click 'Select none', then check 'Keep',
              hit 'Next', then click 'Create archive'. When it's done, extract the zip,
              go into the folder called 'Keep', and select as many notes as you wish to upload.
              Then drag them here!
            </div>
          </Dialog>
          <CreateNoteModal
            createNoteModalOpen={this.props.createNoteModalOpen}
            createNote={this.props.createNote}
            updateNote={this.props.updateNote}
            createdNoteState={this.props.createdNoteState}
            updateCreatedNoteTitle={this.props.updateCreatedNoteTitle}
            updateCreatedNoteContent={this.props.updateCreatedNoteContent}
            toggleCreateNoteModal={this.props.toggleCreateNoteModal}
            editorState={EditorState.createWithContent(convertFromRaw(this.props.createdNoteState.content))}/>
          <FloatingActionButton
            backgroundColor="red"
            data-tip='create note'
            onTouchTap={() => this.props.toggleCreateNoteModal()}
            style={this.props.drawerOpen? {
              position: 'fixed',
              bottom: '43px',
              right: '3px'
            } : {
              position: 'fixed',
              bottom: '43px',
              right: '49px'
            }}>
            <ContentAdd />
          </FloatingActionButton>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
