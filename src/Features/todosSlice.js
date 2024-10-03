import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: [],
  },
  reducers: {
    addTodo: (state, action) => {
      state.todos.push({
        id: Date.now(),
        text: action.payload.text,
        priority: action.payload.priority || 'Low', // Default priority
        dueDate: action.payload.dueDate || null,   // Optional due date
        completed: false,
      });
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    toggleComplete: (state, action) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    updateTodo: (state, action) => {
      const { id, text, priority, dueDate } = action.payload;
      const todo = state.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.text = text || todo.text;
        todo.priority = priority || todo.priority;
        todo.dueDate = dueDate || todo.dueDate;
      }
    },
  },
});

export const { addTodo, deleteTodo, toggleComplete, updateTodo } = todosSlice.actions;
export default todosSlice.reducer;
