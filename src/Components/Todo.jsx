import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, deleteTodo, toggleComplete, updateTodo } from '../Features/todosSlice';
import { jsPDF } from "jspdf"; // Import jsPDF
import 'jspdf-autotable'; // Import autoTable
import './Todo.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const Todo = () => {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editTask, setEditTask] = useState("");

  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);

  const handleAddTodo = () => {
    if (task.trim()) {
      dispatch(addTodo({ text: task, priority, dueDate }));
      setTask("");
      setPriority("Low");
      setDueDate("");
    } else {
      alert("Please enter a task!");
    }
  };

  const handleSaveTodo = (id) => {
    if (editTask.trim()) {
      dispatch(updateTodo({ id, text: editTask, priority, dueDate }));
      setIsEditing(null);
    }
  };

  const isDueToday = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return dueDate === today;
  };

  const isDueSoon = (dueDate) => {
    if (!dueDate) return false;
    const today = new Date();
    const due = new Date(dueDate);
    const oneDayAhead = new Date(today);
    oneDayAhead.setDate(today.getDate() + 1);
    return due <= oneDayAhead && due >= today;
  };

  // Separate tasks into today and upcoming
  const todayTasks = todos.filter(todo => isDueToday(todo.dueDate));
  const upcomingTasks = todos.filter(todo => !isDueToday(todo.dueDate) && todo.dueDate);

  // Sort tasks alphabetically
  const sortedTodayTasks = todayTasks.sort((a, b) => a.text.localeCompare(b.text));
  const sortedUpcomingTasks = upcomingTasks.sort((a, b) => a.text.localeCompare(b.text));

  // Function to handle download
  const handleDownload = () => {
    const doc = new jsPDF();

    // Adding title
    doc.setFontSize(20);
    doc.text("To-Do List Summary", 10, 10);
    doc.setFontSize(12);

    // Completed Tasks
    const completedTasks = todos.filter(todo => todo.completed);
    doc.text("Completed Tasks:", 10, 20);
    doc.autoTable({
        head: [['Task Name', 'Priority', 'Due Date']],
        body: completedTasks.map(todo => [todo.text, todo.priority, todo.dueDate]),
        startY: 25,
    });

    // Pending Tasks
    const pendingTasks = todos.filter(todo => !todo.completed);
    doc.text("Pending Tasks:", 10, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
        head: [['Task Name', 'Priority', 'Due Date']],
        body: pendingTasks.map(todo => [todo.text, todo.priority, todo.dueDate]),
        startY: doc.autoTable.previous.finalY + 15,
    });

    // Save the document
    doc.save("todo_summary.pdf");
  };

  // Check if there are any tasks
  const hasTasks = sortedTodayTasks.length > 0 || sortedUpcomingTasks.length > 0;

  return (
    <div className="todo-container">
      <header className="todo-header">
        <h1>To-Do List</h1>
      </header>

      <div className="todo-input-container">
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="todo-input"
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="todo-select">
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="todo-date"
        />
        <button className="todo-button" onClick={handleAddTodo}>Add Task</button>
      </div>

      <div className="todo-list">
        <h2>Today's Tasks</h2>
        {sortedTodayTasks.length > 0 ? (
          sortedTodayTasks.map((todo, index) => (
            <div className={`todo-item ${todo.priority}`} key={todo.id}>
              {isEditing === todo.id ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={editTask}
                    onChange={(e) => setEditTask(e.target.value)}
                    className="edit-task-input"
                  />
                  <button className="save-task-button" onClick={() => handleSaveTodo(todo.id)}>Save</button>
                </div>
              ) : (
                <>
                  <p className={todo.completed ? "task-completed" : "task-text"}>
                    <span className="task-number">{index + 1}. </span>
                    <span className="task-detail">{todo.text}</span>
                    <span className="task-priority"> | Priority: {todo.priority}</span>
                    {todo.dueDate && (
                      <span className="task-due"> | Due: {todo.dueDate}</span>
                    )}
                    {isDueSoon(todo.dueDate) && (
                      <span className="due-warning"> ⚠️ Due Soon!</span>
                    )}
                  </p>
                  <div className="task-actions">
                    <button className={`complete-task-button`} onClick={() => dispatch(toggleComplete(todo.id))}>
                      {todo.completed ? "✔️ Undo" : "✅ Complete"}
                    </button>
                    <button className="edit-task-button" onClick={() => {
                      setIsEditing(todo.id);
                      setEditTask(todo.text);
                    }}>✏️ Edit</button>
                    <button className="delete-task-button" onClick={() => dispatch(deleteTodo(todo.id))}>❌ Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="no-tasks">No tasks for today</p>
        )}

        <h2>Upcoming Tasks</h2>
        {sortedUpcomingTasks.length > 0 ? (
          sortedUpcomingTasks.map((todo, index) => (
            <div className={`todo-item ${todo.priority}`} key={todo.id}>
              {isEditing === todo.id ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={editTask}
                    onChange={(e) => setEditTask(e.target.value)}
                    className="edit-task-input"
                  />
                  <button className="save-task-button" onClick={() => handleSaveTodo(todo.id)}>Save</button>
                </div>
              ) : (
                <>
                  <p className={todo.completed ? "task-completed" : "task-text"}>
                    <span className="task-number">{index + 1}. </span>
                    <span className="task-detail">{todo.text}</span>
                    <span className="task-priority"> | Priority: {todo.priority}</span>
                    {todo.dueDate && (
                      <span className="task-due"> | Due: {todo.dueDate}</span>
                    )}
                    {isDueSoon(todo.dueDate) && (
                      <span className="due-warning"> ⚠️ Due Soon!</span>
                    )}
                  </p>
                  <div className="task-actions">
                    <button className={`complete-task-button`} onClick={() => dispatch(toggleComplete(todo.id))}>
                      {todo.completed ? "✔️ Undo" : "✅ Complete"}
                    </button>
                    <button className="edit-task-button" onClick={() => {
                      setIsEditing(todo.id);
                      setEditTask(todo.text);
                    }}>✏️ Edit</button>
                    <button className="delete-task-button" onClick={() => dispatch(deleteTodo(todo.id))}>❌ Delete</button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="no-tasks">No upcoming tasks</p>
        )}
      </div>

      {/* Show download button only if there are tasks */}
      {hasTasks && (
        <button className="download-button" onClick={handleDownload}>
          <FontAwesomeIcon icon={faDownload} /> {/* Download icon */}
          Download Tasks
        </button>
      )}

    </div>
  );
};

export default Todo;
