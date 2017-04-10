/** @flow */

import GmailListItem from './GmailListItem'
import PocketListItem from './PocketListItem'
import DriveListItem from './DriveListItem'
import React, { Component, PropTypes } from 'react'

import InfiniteScroll from 'react-infinite-scroller'
import Masonry from 'react-masonry-component'
import CircularProgress from 'material-ui/CircularProgress'

export default class Items extends Component {
  static propTypes = {
    style: PropTypes.object,
    drawerOpen: PropTypes.bool.isRequired,
    handleRequestDelete: PropTypes.func.isRequired,
    allAuth: PropTypes.object.isRequired,
    handleLoadMore: PropTypes.func.isRequired,
    items: PropTypes.array.isRequired,
    gmailTrashThread: PropTypes.func.isRequired,
    gmailThreadsByID: PropTypes.object.isRequired,
    gmailArchiveThread: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      masonryWidth: null
    }
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this))
  }

  updateDimensions() {
    if (window.innerWidth >= 1547) {
      this.setState({masonryWidth: '1280px'})
    } else if (window.innerWidth < 1547 && window.innerWidth >= 1291 ) {
      this.setState({masonryWidth: '1024px'})
    } else if (window.innerWidth < 1291 && window.innerWidth >= 1035) {
      this.setState({masonryWidth: '768px'})
    } else if (window.innerWidth < 1035 && window.innerWidth >= 779) {
      this.setState({masonryWidth: '512px'})
    } else if (window.innerWidth < 779) {
      this.setState({masonryWidth: '256px'})
    }
  }



  render() {

    const items = this.props.items;
    const drawerOpen = this.props.drawerOpen;
    const endOfList = this.props.endOfList;
    const gmailThreadsByID = this.props.gmailThreadsByID;

    const drawerOpenStyles = {
      marginLeft: "256px",
      transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
    }

    const drawerClosedStyles = {
      marginLeft: "0",
      transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
    }

    const styles = {
      root: {width: this.state.masonryWidth, margin: "75px auto"}
    };

    const elementInfiniteLoad = (
      endOfList
      ? (
          <div style={{
            display: 'table',
            margin: '125px auto',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: '400',
            fontSize: '18px',
            color: '#40555f'
          }}>
            End of your inbox!
          </div>
        )
      : (<CircularProgress size={80} thickness={6} style={{display: "block", margin: "300px auto 0"}} />)
    );

    if (
      this.props.allAuth.pocket === false &&
      this.props.allAuth.gmail === false &&
      this.props.allAuth.drive === false
    ) {
      return(
        <div style={{
          display: 'table',
          margin: '125px auto',
          fontFamily: 'Roboto, sans-serif',
          fontWeight: '400',
          fontSize: '20px',
          color: '#40555f'
        }}>
          Click a link in the sidebar to authorize a service
        </div>
      )
    } else if (!this.props.allAuth.all) {
      return (
        <div style={{marginTop: "80px"}}>
          {elementInfiniteLoad}
        </div>
      )
    } else {
      const childElements = items.map((item, idx) => {
        if (item && item.service === "pocket") {
          return (
            <div style={{display: 'inline-block'}} key={idx}>
              <PocketListItem
                item={items[idx].item}
                date={items[idx].date.toString()}
                handleRequestDelete={this.props.handleRequestDelete}
              />
            </div>
          )
        } else if (item && item.service === "gmail") {
          return (
            <div style={{display: 'inline-block'}} key={idx}>
              <GmailListItem
                gmailId={items[idx].id}
                from={items[idx].from}
                subject={items[idx].subject}
                snippet={items[idx].snippet}
                labelIDs={items[idx].labelIDs}
                isUnread={items[idx].isUnread}
                handleRequestDelete={this.props.handleRequestDelete}
                gmailTrashThread={this.props.gmailTrashThread}
                gmailArchiveThread={this.props.gmailArchiveThread}
                threadID={items[idx].threadID}
                hasAttachment={items[idx].hasAttachment}
                date={items[idx].date.toString()}
                messageCount={gmailThreadsByID[items[idx].threadID].messageIDs.length}
              />
            </div>
          )
        } else if (item && item.service === "drive") {
          return (
            <div style={{display: 'inline-block'}} key={idx}>
              <DriveListItem
                file={items[idx].file}
                date={items[idx].date.toString()}
                handleRequestDelete={this.props.handleRequestDelete}
              />
            </div>
          )
        }
      })

      return (
        <div style={drawerOpen ? drawerOpenStyles : drawerClosedStyles}>
          <div style={styles.root}>
            <InfiniteScroll loader={elementInfiniteLoad} hasMore threshold={80}
              ref='masonryContainer' loadMore={this.props.handleLoadMore}>
              <Masonry>
                { childElements }
              </Masonry>
            </InfiniteScroll>
          </div>
        </div>
      );
    }
  }
}
