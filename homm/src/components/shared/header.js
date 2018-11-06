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
                <Link to='/admin'>Admin</Link>
            </div>
        );
        
        const LoginArea = (user) => (
            <div className='header-link right'>
                <div className='header-username'>
                    Hello, {user.name}
                </div>
                <div className='header-controls-logout'>
                    <Link to='/logout/'>Logout</Link>
                </div>
            </div>
        );

        return (
            <div className='header'>
                <div className='header-link'>
                    <Link to='/'>Home</Link>
                </div>
                <div className='header-link'>
                    <Link to='/pickems/'>Pick'ems</Link>
                </div>
                <div className='header-link'>
                    <Link to='/pickems/week/'>Weekly Pick'ems</Link>
                </div>
                <div className='header-link'>
                    <Link to='/leaderboard/'>Leaderboard</Link>
                </div>
                {isAdmin && AdminArea()}
                {LoginArea(user)}
            </div>
        );
    }
}

export default Header;