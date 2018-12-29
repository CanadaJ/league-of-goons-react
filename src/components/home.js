import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';

class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return(
            <div className='jumbotron-center'>
                <h1>League of Goons</h1>
            </div>
        );
    }
}

export default Login;