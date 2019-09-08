import React from 'react';
import { subscribeToTimer , sendMessage} from './api';

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            timestamp: 'no timestamp yet',
            message: '',
            data: '',
        };
        const cb = (err, timestamp) => this.setState({
            timestamp
        });

        const display = (data) => {
            const nextData = this.state.data + '\n' + data;
            this.setState({
                data: nextData
            })
        }
        subscribeToTimer(cb, display);
    }

    setMessage = (input)=> {
        this.setState({message:input.target.value})
    };

    sendMessage = () => {
        const {message} = this.state;
        sendMessage(message);
        this.setState({message:''})
    };

    render() {
        return (
            <div className="App">
                <p className="App-intro">
                    This is the timer value: {this.state.timestamp}
                </p>
                <input type="text" onChange={this.setMessage} value={this.state.message}/>
                <button onClick={this.sendMessage}>send command</button>
                <p>
                    {this.state.data.split('\n').map((i, key) => {
                        return <div key={key}>{i}</div>
                    })}
                </p>
            </div>
        );
    }

}

export default App;