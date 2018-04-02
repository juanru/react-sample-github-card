import React, {Component} from 'react';
import axios from 'axios';

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

class App extends Component {
    state = {
        cards: []
    };

    componentDidMount() {
        // Just an example to have some initial data
        this.fetchData('juanru');
    }

    fetchData = (userName) => {
        axios.get(`https://api.github.com/users/${userName}`)
            .then(resp => {
                this.addCard(resp.data);
            })
    };

    addCard = (card) => {
        this.setState(prevState => ({
            cards: prevState.cards.concat(card)
        }))
    };

    render() {
        return (
            <div id="container">
                <Form fetchData={this.fetchData}/>
                <CardList cards={this.state.cards}/>
            </div>
        );
    }
}

export default App;