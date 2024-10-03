import React from 'react';
import { Provider } from 'react-redux';
import store from './app/store'; // Update this path based on your structure
import Todo from './Components/Todo';// Update this path based on your structure

const App = () => {
  return (
    <Provider store={store}>
      <Todo />
    </Provider>
  );
};

export default App;
