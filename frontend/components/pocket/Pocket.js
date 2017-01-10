import React, { PropTypes } from 'react';

// const list = items => { items.list ? items.list : {} };

const handleClick = fetchItems => fetchItems("{'count':'7'}");

const Pocket = ({items, fetchItems}) => (
  <div>
    <button onClick={handleClick}>Fetch items</button>
    <ul>
      { Object.keys(items).map(item => <li>{items[item]}</li>)}
    </ul>
  </div>
);

// const placeholder = () => (
//   <div>
//     Waiting for items to load...
//   </div>
// );
//
// const Pocket = ({items}) => (
//   list(items) ? itemList(items) : placeholder()
// );

// Picker.propTypes = {
//   options: PropTypes.arrayOf(
//     PropTypes.string.isRequired
//   ).isRequired,
//   value: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired
// }

Pocket.propTypes = {
  items: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,

}

export default Pocket;
