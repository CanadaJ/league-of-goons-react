import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';
import Login from './login';
import Header from './shared/header';
import Pickems from './pickems';
import AuthService from './authService';

const AuthenticatedRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        AuthService.isAuthenticated === true
            ? <Component {...props} />
            : <Redirect to='/login/' />
    )} />
);

class App extends Component {
    render() {
        return (
            <div>
                <Header />
                <Route path='/login' component={Login} />
                <AuthenticatedRoute exact path='/' component={Pickems} />
            </div>
        );
    }
}

export default App;