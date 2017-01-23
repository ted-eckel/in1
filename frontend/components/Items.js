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

import {
  allItemsSelector,
  isFetchingSelector,
  isLoadingSelector,
  servicesLoadedSelector
} from '../selectors';

@connect(
  state => ({
    allItems: allItemsSelector(state),
    servicesLoaded: servicesLoadedSelector(state),
    isFetching: isFetchingSelector(state),
    isLoading: isLoadingSelector(state)
  }),
  dispatch => bindActionCreators({
    fetchItems: PocketActions.fetchItems,
    // loadThread: ThreadActions.load,
    // ...ThreadActions,
  }, dispatch),
)

export default class Items extends Component {
  static propTypes = {
    style: PropTypes.object
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
    const { fetchItems, isFetching, isLoading } = this.props;
    if (!isFetching && !isLoading){
      fetchItems();
      console.log("handleLoadMore()");
    }
  }

  render(): ?ReactComponent {
    const items = this.props.allItems;
    const servicesLoaded = this.props.servicesLoaded;

    const styles = {
      root: {maxWidth: "1525px", margin: "80px auto"}
    };

    const elementInfiniteLoad = (
      <CircularProgress size={80} thickness={6} style={{display: "block", margin: "0 auto"}} />
    );

    if (Object.keys(servicesLoaded).length < 2) {
      return null;
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
              />
            </div>
          )
        }
      })

      return (
        <div style={{maxWidth: "1525px", margin: "80px auto"}}>
          <InfiniteScroll
            ref='masonryContainer'
            loadMore={this.handleLoadMore}
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
