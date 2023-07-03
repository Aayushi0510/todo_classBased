import React, { Component } from "react";
import axios from "axios";

class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      newData: "",
      btnToggle: true,
      editItemId: null,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/todo");
      this.setState({ todos: res.data });
    } catch (error) {
      console.log(error);
    }
  };

  handleChange = (e) => {
    this.setState({ newData: e.target.value });
  };

  addTodos = async () => {
    const { newData } = this.state;
    if (newData.trim() !== "") {
      try {
        const res = await axios.post("http://localhost:3000/todo", {
          id: Date.now(),
          taskName: newData,
        });
        this.setState((prevState) => ({
          todos: [...prevState.todos, res.data],
          newData: "",
        }));
      } catch (error) {
        console.log(error);
      }
    }
  };

  editTodos = async (id) => {
    const { todos } = this.state;
      const editedTodo = todos.find((elem) => elem.id === id);
      this.setState({
        newData: editedTodo.taskName,
        btnToggle: false,
        editItemId: id,
      })
  };

  updatetodo = async () => {
    const { editItemId, newData } = this.state;
    if (newData.trim() !== "") {
      try {
        const res = await axios.put(
          `http://localhost:3000/todo/${editItemId}`,
          {
            taskName: newData,
          }
        );
        const updatedTodos = this.state.todos.map((todo) => {
          if (todo.id === editItemId) {
            return {
              ...todo,
              taskName: newData,
            };
          }
          return todo;
        });
        this.setState({
          todos: updatedTodos,
          newData: "",
          btnToggle: true,
          editItemId: null,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  deleteTodos = async (id) => {
    try {
      const { todos } = this.state;
      const res = await axios.delete(`http://localhost:3000/todo/${id}`);
      const updatetodo = todos.filter((ele) => {
        return id !== ele.id;
      });
      this.setState({ todos: updatetodo });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { todos, newData } = this.state;

    return (
      <div class="container-fluid">
        <div class="container">
          <div
            id="successMessage"
            class="alert alert-primary "
            role="alert"
          ></div>
          <h3 class="text-center">Todo List</h3>
          <div class="mx-auto mt-5" style={{ maxWidth: "700px" }}>
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control"
                placeholder="Enter Your Task"
                aria-label="Recipient's username"
                aria-describedby="button-addon2"
                id="taskInput"
                onChange={this.handleChange}
                name="newData"
                value={newData}
              />
              <button
                class="btn btn-primary"
                type="button"
                id="addtask"
                onClick={this.state.btnToggle ? this.addTodos : this.updatetodo}
              >
                {this.state.btnToggle ? "Add" : "Update"}
              </button>
            </div>
            <div class="dispplay">
              <table class="table table-spacing">
                <thead>
                  <tr>
                    <th scope="col">Task</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                {todos.map((item) => (
                  <tbody id="list_container">
                    <tr key="index">
                      <td>{item.taskName}</td>
                      <td>
                        <i
                          class="fa fa-trash btn btn-danger mx-3"
                          onClick={() => {
                            this.deleteTodos(item.id);
                          }}
                        ></i>
                        <i
                          class="fa fa-pencil btn btn-info mx-3 text-white"
                          onClick={() => {
                            this.editTodos(item.id);
                          }}
                        ></i>
                      </td>
                    </tr>
                  </tbody>
                ))}
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TodoList;
