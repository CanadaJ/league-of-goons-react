import React, { Component } from 'react';

class Leaderboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            leaderboard: []
        }
    }

    componentDidMount() {
        fetch(`/api/leaderboard`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    leaderboard: data.leaderboard,
                    loading: false
                });
            });
    }

    render() {
        if (this.state.loading) {
            return <div className='loading'>Loading&#8230;</div>;
        }

        return (
            <div className='jumbotron-center-compact'>
                <h1>League of Goons Leaderboard</h1>
                <div className='leaderboard-area'>
                    <table className='leaderboard-table'>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>User</th>
                                <th>Correct Picks</th>
                                <th>Incorrect Picks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.leaderboard.map((row) => {
                                return (
                                    <tr>
                                        <td>{row.rank}</td>
                                        <td>{row.name}</td>
                                        <td>{row.numCorrect}</td>
                                        <td>{row.numIncorrect}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Leaderboard;