/** @flow */

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import GmailListItem from './GmailListItem'
import PocketListItem from './PocketListItem'
import React, {Component, PropTypes} from 'react'
import * as ThreadActions from '../actions/Gmail/ThreadActions'
import values from 'lodash/values'
import uniqBy from 'lodash/uniqBy'
import {
  itemsSelector,
  isRequestingSelector,
  messagesByIDSelector
} from '../selectors';

@connect(
  state => ({
    isRequesting: isRequestingSelector(state),
    pocketItems: itemsSelector(state),
    gmailItems: messagesByIDSelector(state)
  }),
  dispatch => bindActionCreators({
    loadThread: ThreadActions.load,
    ...ThreadActions,
  }, dispatch),
)

export default class Items extends Component {
  static propTypes = {
    style: PropTypes.object
  };

  handleRequestDelete = e => {
    e.preventDefault();
    alert('You clicked the delete button.');
  }

  render(): ?ReactComponent {
    const isRequesting = this.props.isRequesting;
    const gmailItems = this.props.gmailItems;
    const pocketItems = this.props.pocketItems;

    let gmailItemsArray = uniqBy((values(gmailItems).sort((a, b) => b.date - a.date)), 'threadID');
    let items = pocketItems.concat(gmailItemsArray).sort((a, b) => b.date - a.date);


    // googleThreadMessages.sort((a, b) => parseInt(b.internalDate) - parseInt(a.internalDate)).forEach(message => {
    //   if (!threadIds.includes(message.threadId)) {
    //     googleItems.push({
    //       service: "google",
    //       time: (parseInt(message.internalDate) / 1000),
    //       item: message
    //     });
    //     threadIds.push(message.threadId);
    //   }
    // })

    // const combinedElements = items.concat(googleItems).sort((a, b) => parseInt(b.time) - parseInt(a.time));

    // if (!items || isRequesting) {
    //   return null;
    // }

    // console.log(items);

    const childElements = items.map((item, idx) => {
      if (item.service === "pocket") {
        return (
          <div style={{display: 'inline-block'}} key={idx}>
            <PocketListItem
              item={items[idx].item}
              handleRequestDelete={this.handleRequestDelete}
            />
          </div>
        )
      } else if (item.service === "gmail") {
        return (
          <div style={{display: 'inline-block'}} key={idx}>
            <GmailListItem
              item={items[idx].item}
            />
          </div>
        )
      }
    })

    return (
      <div style={[styles.root, this.props.style]}>
        { childElements }
      </div>
    );
  }
}

const styles = {
  root: {}
};
