export const filterTodos = (match, todos) => {
  return match.params.filter
    ? todos.filter(
        (todo) => todo.isComplete === (match.params.filter === "completed")
      )
    : todos;
};
