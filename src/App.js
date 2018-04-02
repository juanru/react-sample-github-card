import React, {Component} from 'react';
import axios from 'axios';

import {USER_EXISTS, OTHER_ERROR, NO_CONNECTION} from './util/constants/errorTypes';

const Card = (props) => {
    return (
        <div className="card">
            <img className="image" src={props.avatar_url} alt=""/>
            <div className="cardText">
                <div className="emphasize">
                    {props.name}
                </div>
                <div>{props.company}</div>
            </div>
        </div>
    );
};

const CardList = (props) => {
    return (
        <div>
            {props.cards.map(card => <Card {...card} key={card.id}/>)}
        </div>
    );
};

class Form extends Component {
    state = {userName: ''};
    handleChange = (event) => {
        this.setState({
            userName: event.target.value
        });
    };
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.fetchData(this.state.userName);
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input onChange={this.handleChange} value={this.state.userName} type="text"
                       placeholder="Github username" required/>
                <button type="submit">Add card</button>
            </form>
        );
    }
}

const ErrorMessageInfo = (props) => {
    return (
        <div>
            {props.error.code != null &&
            <div className="infoBox">
                Error: {props.error.text}
            </div>
            }
        </div>
    )
};

class App extends Component {
    state = {
        cards: [],
        error: {
            code: null,
            text: null
        }
    };

    componentDidMount() {
        // Just an example to have some initial data
        this.fetchData('juanru');
    }

    clearErrorsState = () => {
        this.setState({
            error: {
                code: null,
                text: null
            }
        })
    };

    // Adds element to the state only if it was not included yet
    addErrorMessage = (errorCode, errorText) => {
        this.setState(prevState => ({
            error: (prevState.error.code === errorCode) ?
                prevState.error :
                {code: errorCode, text: errorText}
        }))
    };

    handleServerErrorResponse = (error) => {
        this.addErrorMessage(error.status, error.statusText)
    };

    fetchData = (userName) => {
        // Clear previous state
        this.clearErrorsState();

        axios.get(`https://api.github.com/users/${userName}`)
            .then(resp => {
                this.userCardExists(userName) ?
                    this.addErrorMessage(USER_EXISTS, "User Card is already in the list") :
                    this.addCard(resp.data);
            })
            .catch(error => {
                // Error
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    this.handleServerErrorResponse(error.response);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    this.addErrorMessage(NO_CONNECTION, "There is no internet connection. Try again later!");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    this.addErrorMessage(OTHER_ERROR, error.message);
                }
                //console.log(error.config);
            });
    };

    addCard = (card) => {
        this.setState(prevState => ({
            cards: prevState.cards.concat(card)
        }))
    };

    userCardExists = (userName) => {
        return this.state.cards.some(c =>
            c.login === userName
        )
    };

    render() {
        return (
            <div id="container">
                <ErrorMessageInfo error={this.state.error}/>
                <Form fetchData={this.fetchData}/>
                <CardList cards={this.state.cards}/>
            </div>
        );
    }
}

export default App;