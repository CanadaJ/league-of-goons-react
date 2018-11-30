import React, { Component } from 'react';
import AuthService from './authService';

class Login extends Component {
    constructor(props) {
        super(props);
    }

    doAuthenticate() {
        AuthService.authenticate(() => {
            this.setState({
                redirectToPreviousRoute: true
            });
        });
    }

    render() {

        if (this.state.redirectToPreviousRoute) {
            return <Redirect to={from} />;
        }

        return(
            <div className='jumbotron-center'>
                <h1>League of Goons</h1>
                <div class='login-form'>
                    <form method='POST' action='/login'>
                        <div class='login-controls'>
                            <div class='login-control'>
                                <input type='text' name='username' placeholder='Username' />
                            </div>
                            <div class='login-control'>
                                <input type='text' name='username' placeholder='Password' />
                            </div>
                            <div class='login-control'>
                                <button type='submit'>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;