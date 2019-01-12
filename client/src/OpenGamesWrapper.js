import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import JoinGameWrapper from "./JoinGameWrapper";
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

class OpenGamesWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openGames: [],
      numOpenGames: 0,
      openGamesDiv: [],
      playerAddress: this.props.playerAddress
    };
    this.getOpenGames = this.getOpenGames.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.playerAddress != nextProps.playerAddress){
      this.setState({
        playerAddress: nextProps.playerAddress
      });
      this.getOpenGames(nextProps.playerAddress);
    }
  }

  componentDidMount = async () => {
    this.getOpenGames(this.state.playerAddress);
  };

  async getOpenGames(address) {
    let openGames = [];
    let openGamesDiv = [];
    let e = await this.props.rps.NewGame({}, {fromBlock: 0, toBlock: 'latest'});
    let logs = await Promisify(callback => e.get(callback));
    for(var i=0; i<logs.length; i++){
      let [ status, player1 ] = await this.props.rps.getGame(logs[i].args.gameID);
      if(status.toNumber() == 0 && player1.toLowerCase() != address.toLowerCase()){
        openGames.push(logs[i].args);
        openGamesDiv.push(<JoinGameWrapper
                            key={logs[i].args.gameID.toNumber()}
                            gameID={logs[i].args.gameID.toNumber()}
                            bet={logs[i].args.bet.toNumber()}
                            opponentAddress={player1.toLowerCase()}
                            playerAddress={address}
                            rps={this.props.rps}
                            enigmaSetup={this.props.enigmaSetup}
                          />);
      }
    }
    this.setState({
      openGames: openGames,
      numOpenGames: openGames.length,
      openGamesDiv: openGamesDiv
    });
    // Trigger RockPaperScissors changeAddress callback
    this.props.onUpdateOpenGames(
      this.state.openGames.length
    );
  }

  render() {
    return (
      <div>
        {this.state.openGamesDiv}
      </div>
    );
  }
}

export default OpenGamesWrapper;
