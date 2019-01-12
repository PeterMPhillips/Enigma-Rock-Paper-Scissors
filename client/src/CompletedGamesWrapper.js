import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CompletedGameWrapper from "./CompletedGameWrapper";
const Promisify = (inner) =>
    new Promise((resolve, reject) =>
        inner((err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    );

class CompletedGamesWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completedGames: [],
      numCompletedGames: 0,
      completedGamesDiv: [],
      playerAddress: this.props.playerAddress
    };
    this.getCompletedGames = this.getCompletedGames.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.playerAddress != nextProps.playerAddress){
      this.setState({
        playerAddress: nextProps.playerAddress
      });
      this.getCompletedGames(nextProps.playerAddress);
    }
  }

  componentDidMount = async () => {
    console.log('Mounted');
    this.getCompletedGames(this.state.playerAddress);
  };

  async getCompletedGames(address) {
    let completedGames = [];
    let completedGamesDiv = [];
    let e = await this.props.rps.Winner({}, {fromBlock: 0, toBlock: 'latest'});
    let logs = await Promisify(callback => e.get(callback));
    for(var i=0; i<logs.length; i++){
      let [ status, player1, player2, player1Move, player2Move, bet] = await this.props.rps.getGame(logs[i].args.gameID);
      console.log('Bet: ', bet);
      if(status.toNumber() >= 1 && (player1.toLowerCase() == address.toLowerCase() || player2.toLowerCase() == address.toLowerCase())){
        completedGames.push(logs[i].args);
        let winner = logs[i].args.winner;
        console.log(winner);
        let result;
        if(winner.toLowerCase() == address.toLowerCase()){
          result = 'Won';
        } else if(winner.toLowerCase() == '0x0000000000000000000000000000000000000000') {
          result = 'Draw';
        } else {
          result = 'Lost';
        }
        completedGamesDiv.push(<CompletedGameWrapper
                            key={logs[i].args.gameID.toString()}
                            gameID={logs[i].args.gameID.toString()}
                            bet={bet.toNumber()}
                            player1Address={player1.toLowerCase()}
                            player2Address={player2.toLowerCase()}
                            playerAddress={address}
                            result={result}
                            status={status.toNumber()}
                            rps={this.props.rps}
                            enigmaSetup={this.props.enigmaSetup}
                          />);
      }
    }
    completedGamesDiv.reverse();
    this.setState({
      completedGames: completedGames,
      numCompletedGames: completedGames.length,
      completedGamesDiv: completedGamesDiv
    });
    // Trigger RockPaperScissors changeAddress callback
    this.props.onUpdateCompletedGames(
      this.state.completedGames.length
    );
  }

  render() {
    return (
      <div>
        {this.state.completedGamesDiv}
      </div>
    );
  }
}

export default CompletedGamesWrapper;
