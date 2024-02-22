import React, { useEffect, useState } from 'react';
import service from './service.js';
function App() {
  function handleResponseError(error) {
    console.error(error.message);
  }
  fetch('http://localhost:3000/')
    .then((response) => {
      if (!response.ok) {
        return handleResponseError(new Error(response.statusText));
      }
    });

  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
 
  async function getTodos() {
    const todos = await service.getTasks();
    setTodos(todos);
  }

  async function createTodo(e) {
    e.preventDefault();
    await service.addTask(newTodo);
    setNewTodo("");//clear input
    await getTodos();//refresh tasks list (in order to see the new one)
  }

 async function updateCompleted(todo, isComplete) {
  await service.setCompleted(todo.id, isComplete,todo.name); // Pass only the isComplete value
  await getTodos();
}


  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos();//refresh tasks list
  }

  useEffect(() => {
    getTodos();
  }, []);
  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={createTodo}>
          <input
            className="new-todo"
            placeholder="Well, let's take on the day"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
        </form>
      </header>
      <section className="main" style={{ display: "block" }}>
        <ul className="todo-list">
          {todos.map((todo) => (
            <li className="todo-item" key={todo.id}>
              <div className="view">
                <input
                  className="toggle"
                  type="checkbox"
                  checked={todo.isComplete}
                  onChange={(e) => updateCompleted(todo, e.target.checked)}
                />
                <label
                  style={{
                    textDecoration: todo.isComplete ? "line-through" : "",
                  }}
                >
                  {todo.name}
                </label>
                <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
  // return (
  //   <section className="todoapp">
  //     <header className="header">
  //       <h1>todos</h1>
  //       <form onSubmit={createTodo}>
  //         <input className="new-todo" placeholder="Well, let's take on the day" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
  //       </form>
  //     </header>
  //     <section className="main" style={{ display: "block" }}>
  //       <ul className="todo-list">
  //         {todos.map(todo => {
  //           return (
  //             <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
  //               <div className="view">
  //                 <input className="toggle" type="checkbox" defaultChecked={todo.isComplete} onChange={(e) => updateCompleted(todo, e.target.checked)} />
  //                 <label>{todo.name}</label>
  //                 <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
  //               </div>
  //             </li>
  //           );
  //         })}
  //       </ul>
  //     </section>
  //   </section >
  // );
}


export default App;
