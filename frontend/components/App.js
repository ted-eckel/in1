import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import GreetingContainer from './greeting/GreetingContainer'
import PocketContainer from './pocket/PocketContainer'
import { fetchItems, fetchItemsIfNeeded } from '../actions/PocketActions'

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

  render() {
    const { items, isFetching } = this.props
    const isEmpty = items.length === 0
    // const isEmpty = Object.keys(items).length === 0
    return (
      <div>
        <h1>in1</h1>
        <GreetingContainer />
        <button onClick={this.handleClick}>Fetch more items</button>
        {isEmpty
          ? (isFetching ? <h2>Loading...</h2> : <h2>Empty.</h2>)
          : <div style={{ opacity: isFetching ? 0.5 : 1 }}>
              <ul>
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
                {/* {Object.keys(items).map((item, idx) => {<li key={idx}>{items[item].excerpt}</li>})} */}
              </ul>
            </div>
        }
      </div>
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
