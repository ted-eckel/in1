import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
// import { fetchItems } from '../../actions/PocketActions';
import Pocket from './Pocket';

const mapStateToProps = state => ({
  items: state.pocket.items,
  params: state.pocket.params
});

// const mapDispatchToProps = dispatch => ({
//   fetchItems: params => dispatch(fetchItems(params))
// });

export default connect(
  mapStateToProps
)(Pocket);