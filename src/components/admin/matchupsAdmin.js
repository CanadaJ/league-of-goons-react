import React, { Component } from 'react';

class MatchupsAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            matchups: [],
            loading: true,
            week: 1
        };
    }

    componentDidMount() {
        this.getMatchups(this.state.week);
    }

    getMatchups = (week) => {
        this.setState({ loading: false });
    }

    render() {
        if (this.state.loading) {
            return <div className='loading'>Loading&#8230;</div>;
        }

        return(
            <div>
                test
            </div>
        )
    }
}

export default MatchupsAdmin;