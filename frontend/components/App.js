import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import GreetingContainer from './greeting/GreetingContainer'
import PocketContainer from './pocket/PocketContainer'
import { fetchItems, fetchItemsIfNeeded } from '../actions/PocketActions'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import Infinite from 'react-infinite'
import Paper from 'material-ui/Paper'
import ReactGridLayout from 'react-grid-layout'

class App extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchItemsIfNeeded({count: 20, detailType: "complete"}))
  }

  handleClick = e => {
    e.preventDefault()

    const { dispatch } = this.props
    dispatch(fetchItems({count: 20, detailType: "complete"}))
  }

  handleRefresh = () => {
    const { dispatch } = this.props
    dispatch(fetchItems({count: 20, detailType: "complete"}))
  }

  render() {
    const { items, isFetching } = this.props
    const isEmpty = items.length === 0
    const elementInfiniteLoad = () => <CircularProgress size={80} thickness={6} />;
    // const isEmpty = Object.keys(items).length === 0
    return (
      <MuiThemeProvider>
        <div>
          <h1>in1</h1>
          <GreetingContainer />
          <br />
          <FlatButton label="Fetch 20 items" onClick={this.handleClick} />
          <br />
          {isEmpty
            ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
            : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <Infinite
                elementHeight={230}
                onInfiniteLoad={this.handleRefresh}
                infiniteLoadingBeginEdgeOffset={200}
                loadingSpinnerDelegate={this.elementInfiniteLoad}
                isInfiniteLoading={isFetching}
                useWindowAsScrollContainer>
                <ReactGridLayout className="layout" cols={12} rowHeight={30} width={1200}>
                  {
                    items.map((item, idx) => {
                      return (
                          <div key={idx} data-grid={{x: ((idx * 2) % 12), y: (Math.floor(idx / 6)), w: 2, h: 6, isDraggable: false, isResizable: false}}>
                            <a href={items[idx].given_url} style={{textDecoration: "none"}}>
                              <Paper style={{height: "100px", padding: "10px"}} zDepth={1}>
                                <img src={"http://www.google.com/s2/favicons?domain=".concat(items[idx].given_url)} />
                                { " " }
                                <span>{items[idx].resolved_title}</span>
                              </Paper>
                            </a>
                          </div>
                      )
                    })
                  }
                </ReactGridLayout>
              </Infinite>
              {/* <ul>
                {
                  items.map((item, idx) => {
                    return (<li key={idx}>
                      <img src={"http://www.google.com/s2/favicons?domain=".concat(items[idx].given_url)} />
                      { " " }
                      <a href={items[idx].given_url}>
                        {items[idx].resolved_title}
                      </a> : { (new Date(parseInt(items[idx].time_added) * 1000)).toString() }
                      { " : "}
                      { items[idx].image ? <img style={{ "maxHeight": "100px" }} src={items[idx].image.src}  /> : <span/>}
                    </li>)
                  })
                }
              </ul> */}
            </div>
          }
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = state => {
  const {
    items,
    isFetching,
    error
  } = state.pocket

  return {
    items,
    isFetching,
    error
  }
}

export default connect(mapStateToProps)(App)
