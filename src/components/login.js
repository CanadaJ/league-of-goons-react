import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
        }
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;

        this.setState({
            [name]: value
        });
    }

    doAuthenticate = () => {
        fetch('/api/authenticate', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status === 200) {
                this.props.history.push('/');
                window.location.replace('/');
            } else {
                const error = new Error(res.error);
                throw error;
            }
        })
        .catch(err => {
            console.error(err);
            alert('Login Error');
        });
    }

    render() {

        if (this.state.redirectToPreviousRoute) {
            return <Redirect to={'/'} />;
        }

        return(
            <div className='jumbotron-center'>
                <h1>League of Goons</h1>
                <div className='login-form'>
                    <div className='login-controls'>
                        <div className='login-control'>
                            <input type='text' name='username' placeholder='Username' value={this.state.username} onChange={this.handleInputChange} required />
                        </div>
                        <div className='login-control'>
                            <input type='password' name='password' placeholder='Password' value={this.state.password} onChange={this.handleInputChange} required />
                        </div>
                        <div className='login-control'>
                            <button onClick={this.doAuthenticate}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;