import React from 'react';
import GreetingContainer from './greeting/GreetingContainer'

const App = ({ children }) => (
  <div>
    <h1>in1</h1>
    <GreetingContainer />
    { children }
  </div>
);

export default App;
