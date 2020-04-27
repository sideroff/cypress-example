import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import Footer from "./Footer";

import { saveTodo, loadTodos, destroyTodo, updateTodo } from "../lib/service";

import { filterTodos } from "../lib/utils";

export default class TodoApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentTodo: "",
      todos: [],
    };
  }

  componentDidMount() {
    loadTodos()
      .then((response) => {
        this.setState({
          todos: response.data,
        });
      })
      .catch((error) => {
        this.setState({ error: true });
      });
  }
  handleCurrentTodoChange(event) {
    this.setState({ currentTodo: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const newTodo = { name: this.state.currentTodo, isComplete: false };

    saveTodo(newTodo)
      .then((response) => {
        this.setState({
          currentTodo: "",
          todos: this.state.todos.concat(response.data),
        });
      })
      .catch((error) => {
        this.setState({ error: true });
      });
  }

  handleDelete(id) {
    destroyTodo(id).then(() => {
      this.setState({ todos: this.state.todos.filter((x) => x.id !== id) });
    });
  }

  handleToggle(id) {
    const targetTodo = this.state.todos.find((x) => x.id === id);
    const updated = { ...targetTodo, isComplete: !targetTodo.isComplete };
    updateTodo(updated).then(({ data }) => {
      const todos = this.state.todos.map((x) => (x.id === data.id ? data : x));

      this.setState({ todos });
    });
  }

  render() {
    const remaining = this.state.todos.filter((x) => !x.isComplete).length;
    return (
      <Router>
        <div>
          <header className="header">
            <h1>todos</h1>
            {this.state.error ? <span className="error">Error!</span> : null}
            <TodoForm
              currentTodo={this.state.currentTodo}
              onCurrentTodoChange={this.handleCurrentTodoChange.bind(this)}
              onSubmit={this.handleSubmit.bind(this)}
            />
          </header>
          <section className="main">
            <Route
              path="/:filter?"
              render={({ match }) => {
                return (
                  <TodoList
                    todos={filterTodos(match, this.state.todos)}
                    handleDelete={this.handleDelete.bind(this)}
                    handleToggle={this.handleToggle.bind(this)}
                  />
                );
              }}
            ></Route>
          </section>
          <Footer remaining={remaining} />
        </div>
      </Router>
    );
  }
}
