import React, { Component } from 'react';
import Header from './shared/header';

class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <div className='bg-image'></div>
                <div className='container full-page'>
                    <Header />
                </div>
            </div>
        );
    }
}

export default Login;