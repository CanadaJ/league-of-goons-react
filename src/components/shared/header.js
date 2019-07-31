import React, { Component } from 'react';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: null,
            name: null,
            iduser: null,
            isadmin: false,
        }
    }

    componentDidMount() {
        fetch('/api/checktoken')
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json => {
                        this.setState({
                            loading: false,
                            name: json.name,
                            iduser: json.iduser,
                            isadmin: json.isadmin
                        });
                    });                    
                } else {
                    this.setState({ loading: false });
                }
            });
    }

    handleLogout() {
        fetch('/api/logout')
            .then(res => {
                if (res.status === 200) {
                    this.props.history.push('/login');
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .catch(err => {
                console.error(err);
                alert('Logout Error');
            });
    }

    render() {
        const AdminArea = () => (
            <div className='header-link'>
                <a href='/admin/pickems'>Admin</a>
            </div>
        );
        
        const LoginArea = () => (
            (this.state.loading || !this.state.name ? null
                :
                <div className='header-link right'>
                    <div className='header-username'>
                        Hello, {this.state.name}
                    </div>
                    <div className='header-controls-logout'>
                        <a onClick={() => this.handleLogout()} href='#'>Logout</a>
                    </div>
                </div>)
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
                {this.state.isadmin && AdminArea()}
                {LoginArea()}
            </div>
        );
    }
}

export default Header;