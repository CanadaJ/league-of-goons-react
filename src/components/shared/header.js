import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
    render() {

        const isAdmin = true;
        const user = {
            name: 'Justin'
        };

        const AdminArea = () => (
            <div className='header-link'>
                <a href='/admin'>Admin</a>
            </div>
        );
        
        const LoginArea = (user) => (
            <div className='header-link right'>
                <div className='header-username'>
                    Hello, {user.name}
                </div>
                <div className='header-controls-logout'>
                    <a href='/logout/'>Logout</a>
                </div>
            </div>
        );

        return (
            <div className='header'>
                <div className='header-link'>
                    <a href='/'>Home</a>
                </div>
                <div className='header-link'>
                    <a href='/pickems/'>Pick'ems</a>
                </div>
                <div className='header-link'>
                    <a href='/pickems/week/'>Weekly Pick'ems</a>
                </div>
                <div className='header-link'>
                    <a href='/leaderboard/'>Leaderboard</a>
                </div>
                {isAdmin && AdminArea()}
                {LoginArea(user)}
            </div>
        );
    }
}

export default Header;