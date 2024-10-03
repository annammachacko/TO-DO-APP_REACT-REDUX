import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../Features/todosSlice'; // Adjust the path if needed

const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export default store;
