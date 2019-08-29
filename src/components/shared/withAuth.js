import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default function withAuth(ProtectedComponent) {
    return class extends Component {
        constructor() {
            super();
            this.state = {
                loading: true,
                redirect: false,
                user: null
            };
        }

        componentDidMount() {
            fetch('/api/checktoken')
                .then(res => {
                    if (res.status === 200) {
                        return res.json();
                    } else {
                        this.setState({ loading: false, redirect: true });
                        return null;
                    }
                })
                .then(json => {
                    if (!json) return;

                    console.log(json);

                    this.setState({ user: json.user, loading: false });
                });
        }

        render() {
            const { loading, redirect } = this.state;
            let view = <h1>Loading...</h1>;
            
            if (!loading) {
                if (redirect) {
                    view = <Redirect to='/login' />
                } else {
                    view = <ProtectedComponent user={this.state.user} />
                }
            }

            return (
                <React.Fragment>
                    { view }
                </React.Fragment>
            );
        }
    }
}