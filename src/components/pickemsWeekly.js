import React, { Component } from 'react';

class PickemsWeekly extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            week: 1,
            matchups: [],
            users: [],
            userPicks: []
        };
    }

    componentDidMount() {
        this.updatePickems(this.state.week);
    }

    updatePickems = (week) => {
        var hashValue = window.location.hash ? window.location.hash.substr(1) : '';

        if (hashValue) {
            const rgx = new RegExp(/^week([0-9]+)/);

            if (rgx.test(hashValue)) {
                const weekHash = rgx.exec(hashValue)[1];

                if (weekHash && parseInt(weekHash) <= 17) {
                     week = weekHash;
                } else {
                    window.location.hash = `week${week}`;
                }
            }
        }

        fetch(`/api/pickems/weekly/${week}`)
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    userPicks: data.userPicks,
                    matchups: data.matchups,
                    users: data.users,
                    loading: false,
                    week: parseInt(week)
                });
            });
    }

    buildTeamHeaderForMatchup = (matchup) => {
        return <th className='team-header' key={matchup.awayName + '-' + matchup.homeName}>{matchup.awayName ? matchup.awayName : 'TBD'} @ {matchup.homeName ? matchup.homeName : 'TBD'}</th>;
    }

    generateUserPickemRow = (user) => {
        return (
            <tr key={user.name} className='pick-row'>
                <th className='name-header sticky'>{user.name}</th>
                {this.state.matchups.map((matchup) => {
                    let pick = this.state.userPicks.find(pick => pick.idUser === user.idUser && pick.idMatchup === matchup.idMatchup);
                    let key = `${user.name}${matchup.awayName}-${matchup.homeName}`;
                    if (!pick || pick.isFuture || (!pick.hasWinner && !pick.wasCorrect))
                    {
                        return <td key={key}>-</td>
                    } else if (pick && pick.wasCorrect) {
                        return <td key={key}><i className='material-icons pick-icon pickem-complete is-correct'>check</i></td>;
                    } else if (pick && !pick.wasCorrect)
                    {
                        return <td key={key}><i className='material-icons pick-icon pickem-complete is-incorrect'>close</i></td>;
                    }

                    return <td>-</td>
                })}
            </tr>
        )
    }

    changeWeek(week) {
        if (week === this.state.week) return false;

        window.location.hash = `week${week}`;
    }

    formatWeekName = (week) =>
    {
        if (week <= 17) return `Week ${week}`;

        if (week === 18) return 'Wild Card';
        if (week === 19) return 'Divisional';
        if (week === 20) return 'Conference';
        if (week === 22) return 'Super Bowl';
    }

    render() {

        const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22];

        const WeekLink = (week) => {
            if (week <= 17) return (<a key={`week-link-${week}`} className='week-link' onClick={() => this.changeWeek(week)}>Week {week}</a>);

            if (week === 18) return <a key={`week-link-${week}`} className='week-link' onClick={() => this.changeWeek(week)}>Wild Card</a>;
            if (week === 19) return <a key={`week-link-${week}`} className='week-link' onClick={() => this.changeWeek(week)}>Divisional</a>;
            if (week === 20) return <a key={`week-link-${week}`} className='week-link' onClick={() => this.changeWeek(week)}>Conference</a>;
            if (week === 22) return <a key={`week-link-${week}`} className='week-link' onClick={() => this.changeWeek(week)}>Super Bowl</a>;
        };

        if (this.state.loading) {

            return <div className='loading'>Loading&#8230;</div>;
        }
        
        return(
            <div className='jumbotron-center-compact'>
                <h1>League of Goons Pick'ems ({this.formatWeekName(this.state.week)})</h1>
                <div className='controls-container'>
                    {weeks.map((week) => WeekLink(week))}
                </div>
                <div className='table-container'>
                    <table className='pickem-weekly-table'>
                        <tbody>
                            <tr className='game-header'>
                                <th></th>
                                {this.state.matchups.map((matchup) => this.buildTeamHeaderForMatchup(matchup))}
                            </tr>
                            {this.state.users.map((user) => this.generateUserPickemRow(user))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default PickemsWeekly;