import React from "react";

export default (props) => (
  <form onSubmit={props.onSubmit}>
    <input
      autoFocus
      type="text"
      onChange={props.onCurrentTodoChange}
      value={props.currentTodo}
      className="new-todo"
      placeholder="What needs to be done?"
    />
  </form>
);
