import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { drawerOpenSelector } from '../selectors'
import { toggleCreateNoteModal } from '../actions/AppActions'

@connect(
  state => ({
    drawerOpen: drawerOpenSelector(state),
  }),
  dispatch => bindActionCreators({
    toggleCreateNoteModal: toggleCreateNoteModal,
  }, dispatch),
)

export default class FAB extends Component {
  render() {
    return (
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
    )
  }
}
