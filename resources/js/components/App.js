import axios from "axios";
import React, { Component } from "react";
import ReactDOM  from "react-dom";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            tasks: []
        };

        //bind
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderTasks = this.renderTasks.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleChange(e) {
        this.setState({
            name: e.target.value
        });

        console.log('onChange: ', this.state.name);
    }

    handleSubmit(e) {
        e.preventDefault();
        axios.post('/tasks', {
            name: this.state.name
        }).then(response => {
            console.log('from handle submit: ', response);

            //set state
            this.setState({
                tasks: [response.data, ...this.state.tasks],
                name: ''
            });
        });
    }

    //get all tasks from backend
    getTasks() {
        axios.get('/tasks').then((response) => this.setState({
            tasks: [...response.data.tasks]
        }));
    }

    //lifecycle method
    componentDidMount() {
        this.getTasks();
    }

    handleDelete(id) {
        //remove from local state
        const isNotId = task => task.id !== id;
        const updatedTasks = this.state.tasks.filter(isNotId);
        this.setState({tasks: updatedTasks});

        //make delete request to the backend
        axios.delete(`/tasks/${id}`);
    }

    renderTasks() {
        return this.state.tasks.map(task => (
            <div key={task.id} className="media">
                <div className="media-body">
                    <p>
                        {task.name} {' '} 
                        <button onClick={() => {this.handleDelete(task.id)}} 
                            className="btn btn-sm btn-warning float-right">Delete</button>
                    </p>
                </div>
            </div>
        ));
    }

    render() {
        return(
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">Create Task</div>
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <textarea
                                            onChange={this.handleChange} value={this.state.name} maxLength="255"
                                            className="form-control" rows="5" placeholder="Create a new Task" required />
                                        <button type="submit" className="btn btn-primary">Create Task</button>
                                    </div>
                                </form>

                                {this.renderTasks()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}