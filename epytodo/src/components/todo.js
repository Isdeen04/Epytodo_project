import './todo.css';

import React, { useState } from 'react';

const TodoList = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (task.trim() !== '') {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask('');
    }
  };

  const deleteTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const toggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const confirmAllTasks = () => {
    const updatedTasks = tasks.map((t) => ({ ...t, completed: true }));
    setTasks(updatedTasks);
  };

  const deleteAllTasks = () => {
    setTasks([]);
  };

  return (
    <div className="todo-container">
      <form onSubmit={(e) => { e.preventDefault(); addTask(); }} className="todo-form">
        <label htmlFor="task">Nouvelle tâche:</label>
        <div className="input-container">
          <input
            type="text"
            id="task"
            name="task"
            placeholder="Entrer votre tâche ..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />
          <button type="submit">+</button>
        </div>
      </form>

      <ul className="task-list">
        {tasks.map((t, index) => (
          <li key={index} className={t.completed ? 'completed' : ''}>
            {t.text}
            <button onClick={() => deleteTask(index)}>Supprimer</button>
            <button onClick={() => toggleTask(index)}>Terminer</button>
          </li>
        ))}
      </ul>

      <div className="button-container">
        <button onClick={confirmAllTasks}>Confirmer tout</button>
        <button onClick={deleteAllTasks}>Supprimer tout</button>
      </div>
    </div>
  );
};

export default TodoList;
