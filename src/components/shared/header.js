import React, { Component } from 'react';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import PropTypes from 'prop-types'

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: null,
            name: null,
            iduser: null,
            isadmin: false,
            dropdownStates: {
                pickems: false
            }
        }
    }

    static contextTypes = {
        router: PropTypes.object
    }

    

    componentDidMount() {
        fetch('/api/checktoken')
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json => {
                        this.setState({
                            loading: false,
                            name: json.user.name,
                            iduser: json.user.iduser,
                            isadmin: json.user.isadmin
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
                    this.setState({
                        loading: null,
                        name: null,
                        iduser: null,
                        isadmin: false
                    });
                    this.context.router.history.push('/login');
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

    onDropdownShow = (key) => {
        let newState = this.state.dropdownStates[key] = true;

        this.setState({ dropdownStates: this.state.dropdownStates });
    }

    onDropdownHide = (key) => {
        let newState = this.state.dropdownStates[key] = false;

        this.setState({ dropdownStates: this.state.dropdownStates });
    }

    render() {
        const AdminArea = () => (
            <li className='dropdown-item admin'>
                <a href='/admin/pickems'>Admin</a>
            </li>
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
                <Dropdown
                    onShow={() => this.onDropdownShow('pickems')}
                    onHide={() => this.onDropdownHide('pickems')}
                >
                    <DropdownTrigger>
                        <div className='header-link dropdown'>
                            Pick'ems
                            <span className={this.state.dropdownStates['pickems'] ? 'chevron top' : 'chevron bottom'}></span>
                        </div>
                    </DropdownTrigger>
                    <DropdownContent>
                        <div className='header-link dropdown-content'>
                            <ul>
                                <li>
                                    <a href='/pickems/'>Your Picks</a>
                                </li>
                                <li>
                                    <a href='/pickems/week/'>Weekly Results</a>
                                    </li>
                                <li>
                                    <a href='/leaderboard/'>Leaderboard</a>
                                </li>
                                {this.state.isadmin && AdminArea()}
                            </ul>
                        </div>
                    </DropdownContent>
                </Dropdown>
                
                {LoginArea()}
            </div>
        );
    }
}

export default Header;