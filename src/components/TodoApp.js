import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import Footer from "./Footer";

import { saveTodo, loadTodos } from "../lib/service";

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

  render() {
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
            <TodoList todos={this.state.todos} />
          </section>
          <Footer />
        </div>
      </Router>
    );
  }
}
