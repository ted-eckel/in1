import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { fetchItems } from '../../actions/PocketActions';
import MasonryInfiniteScroller from 'react-masonry-infinite'
import Paper from 'material-ui/Paper'
import CircularProgress from 'material-ui/CircularProgress'

const elementInfiniteLoad = (
  <div style={{margin: "0 auto"}}>
    <CircularProgress size={80} thickness={6} />
  </div>
);

const MasonryInfinite = ({items}) => (
  <MasonryInfiniteScroller hasMore useWindow loader={elementInfiniteLoad} loadMore={props.handleRefresh}>
    {
      items.map((item, idx) => {
        return (
          <div
            key={idx}
            style={{
              margin: "15px"
            }}>
            <a
              href={items[idx].item.given_url}
              style={{
                textDecoration: "none"
              }}>
              <Paper
                style={{
                  width: "275px",
                  height: "225px",
                  padding: "10px",
                }}
                zDepth={1}>
                {items[idx].service === "pocket"
                  ? (
                        <span>
                          <img src={"http://www.google.com/s2/favicons?domain=".concat(items[idx].item.given_url)} />
                          {" "}
                        </span>
                      )
                    : <span />
                  }
                <span>
                  {
                    items[idx].item.resolved_title
                    ? items[idx].item.resolved_title
                    : items[idx].item.given_title
                  }
                </span>
              </Paper>
            </a>
          </div>
        )
      })
    }
  </MasonryInfiniteScroller>
)


const mapStateToProps = state => ({
  items: state.pocket.items,
  params: state.pocket.params
});

const mapDispatchToProps = dispatch => ({
  fetchItems: params => dispatch(fetchItems(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MasonryInfinite);
