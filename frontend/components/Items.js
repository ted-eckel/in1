/** @flow */

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import GmailListItem from './GmailListItem'
import PocketListItem from './PocketListItem'
import React, {Component, PropTypes} from 'react'
import * as ThreadActions from '../actions/Gmail/ThreadActions'
import * as PocketActions from '../actions/PocketActions'
import values from 'lodash/values'
import uniqBy from 'lodash/uniqBy'
import InfiniteScroll from 'react-infinite-scroller'
import Masonry from 'react-masonry-component'
import CircularProgress from 'material-ui/CircularProgress'
import RSVP from 'rsvp'

import {
  allItemsSelector,
  isFetchingSelector,
  isLoadingSelector,
  servicesLoadedSelector,
  getAllItemsSelector
} from '../selectors';

@connect(
  state => ({
    allItems: allItemsSelector(state),
    servicesLoaded: servicesLoadedSelector(state),
    isFetching: isFetchingSelector(state),
    isLoading: isLoadingSelector(state),
    getAllItems: getAllItemsSelector(state)
  }),
  dispatch => bindActionCreators({
    fetchItems: PocketActions.fetchItems,
    loadThreadList: ThreadActions.loadList,
    // ...ThreadActions,
  }, dispatch),
)

export default class Items extends Component {
  static propTypes = {
    style: PropTypes.object,
    onRequestMoreItems: PropTypes.func.isRequired
  };

  componentWillMount = () => {
    const { fetchItems, isFetching, isLoading } = this.props;
    if (!isFetching && !isLoading){
      fetchItems();
      console.log("Items componentWillMount()")
    }
  }

  handleRequestDelete = e => {
    e.preventDefault();
    alert('You clicked the delete button.');
  }

  handleLoadMore = () => {
    const { fetchItems, isFetching, isLoading, loadThreadList, onRequestMoreItems } = this.props;
    if (!isFetching /*&& !isLoading*/){
      RSVP.all([
        fetchItems(),
        // loadThreadList()
        onRequestMoreItems()
      ]).then(console.log("RSVP handleLoadMore()"))
    }
  }

  render(): ?ReactComponent {
    // const items = this.props.allItems;
    const items = this.props.getAllItems;
    const servicesLoaded = this.props.servicesLoaded;
    const requestMoreItems = this.props.onRequestMoreItems;

    const styles = {
      root: {maxWidth: "1525px", margin: "80px auto"}
    };

    const elementInfiniteLoad = (
      <CircularProgress size={80} thickness={6} style={{display: "block", margin: "0 auto"}} />
    );

    if (Object.keys(servicesLoaded).length < 2) {
      return (
        <div style={{marginTop: "80px"}}>
          {elementInfiniteLoad}
        </div>
      )
    } else {
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
                gmailId={items[idx].id}
                from={items[idx].from}
                subject={items[idx].subject}
                snippet={items[idx].snippet}
                labelIDs={items[idx].labelIDs}
                isUnread={items[idx].isUnread}
              />
            </div>
          )
        }
      })

      return (
        <div style={{maxWidth: "1525px", margin: "80px auto"}}>
          <InfiniteScroll
            ref='masonryContainer'
            loadMore={this.handleLoadMore /*requestMoreItems*/}
            loader={elementInfiniteLoad}
            hasMore
            threshold={200}
            >
              <Masonry>
                { childElements }
              </Masonry>
            </InfiniteScroll>
          </div>
        );
    }
  }
}
