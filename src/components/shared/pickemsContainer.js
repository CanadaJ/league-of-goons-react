import React, { Component } from 'react';
import WeekSelector from '../shared/weekSelector';
import Pickems from '../pickems';

class PickemsContainer extends Component {
    state = {
        week: 1,
        pickCounts: {},
        pickems: []
    }

    componentDidMount() {
        this.updatePickems(this.state.week);
    }

    changeWeek = (week) => {
        if (week === this.state.week) return false;

        this.updatePickems(week);
    }

    updatePickems = (week) => {
        this.setState({ loading: true });

        fetch(`/api/pickems/week/${week}`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    pickCounts: data.pickCounts,
                    pickems: data.userPicks,
                    week: parseInt(week),
                    loading: false
                });
            });
    }

    updatePickem = (pickem, idTeam) => {
        if (!pickem.canupdate || pickem.idpickteam === idTeam) {
            return false;
        }

        this.setState({ loading: true });

        fetch('/api/pickems/update/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idMatchup: pickem.idmatchup,
                idUser: this.props.user.iduser,
                idTeam: idTeam
            })
        })
        .then(response => response.json())
        .then(data => {
            this.setState({ loading: false });

            if (data.success) {
                this.updatePickems(this.state.week);
            }
        });
    }

    render() {
        return (
            <div className='jumbotron-center-compact'>
                <h1>League of Goons Pick'ems</h1>
                <WeekSelector changeWeek={this.changeWeek} />
                <Pickems
                    pickCounts={this.state.pickCounts}
                    pickems={this.state.pickems}
                    week={this.state.week}
                    loading={this.state.loading}
                    updatePickem={this.updatePickem}
                />
            </div>
        );
    }
}

export default PickemsContainer;