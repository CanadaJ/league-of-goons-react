import React, { Component } from 'react';
import WeekSelector from '../shared/weekSelector';
import PickemsAdmin from './pickemsAdmin';

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

    changeWeek = (week) => {
        if (week === this.state.week) return false;

        this.getMatchups(week);
    }

    updateMatchup = (pickem, idTeam) => {
        if (pickem.winner === idTeam) {
            return false;
        }

        fetch('/api/admin/setmatchupwinner', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idMatchup: pickem.idMatchup,
                winner: idTeam
            })
        })
        .then(response => response.json())
        .then((data) => {
            if (data.success) {
                this.getMatchups(this.state.week);
            }
        });
    }

    getMatchups(week) {
        console.log('getmatchups')
        this.setState({ loading: true });

        fetch(`/api/admin/pickems/week/${week}`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    matchups: data.matchups,
                    week: parseInt(week),
                    loading: false
                });
            });
    }

    render() {
        if (this.state.loading) {
            return <div className='loading'>Loading&#8230;</div>;
        }

        return(
            <div className='jumbotron-center-compact'>
                <h1>Pick'ems Admin</h1>
                <WeekSelector changeWeek={this.changeWeek} />
                <PickemsAdmin
                    matchups={this.state.matchups}
                    week={this.state.week}
                    loading={this.state.loading}
                    updateMatchup={this.updateMatchup}
                />
            </div>
        )
    }
}

export default MatchupsAdmin;