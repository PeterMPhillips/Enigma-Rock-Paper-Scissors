import React, { Component } from "react";
import JoinGameWrapper from "./JoinGameWrapper";
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
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
      numOpenGames: this.props.numOpenGames,
      numCompletedGames: this.props.numCompletedGames,
      openGamesDiv: <CircularProgress color="secondary"/>,
      playerAddress: this.props.playerAddress
    };
    this.getOpenGames = this.getOpenGames.bind(this);
    this.gameJoined = this.gameJoined.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.playerAddress !== nextProps.playerAddress){
      this.setState({
        playerAddress: nextProps.playerAddress
      });
      this.getOpenGames(nextProps.playerAddress);
    }
    if(this.state.numCompletedGames !== nextProps.numCompletedGames){
      this.setState({
        numCompletedGames: nextProps.numCompletedGames
      });
    }
  }

  componentDidMount = async () => {
    this.getOpenGames(this.state.playerAddress);
  };

  async gameJoined(){
    let numOpen = this.state.numOpenGames - 1;
    let numCompleted = this.state.numCompletedGames + 1;
    this.props.onUpdateOpenGames(numOpen);
    this.props.onUpdateCompletedGames(numCompleted);
  }

  async getOpenGames(address) {
    let openGamesDiv = [];
    let e = await this.props.rps.NewGame({}, {fromBlock: 0, toBlock: 'latest'});
    let logs = await Promisify(callback => e.get(callback));
    for(var i=0; i<logs.length; i++){
      let [ status, player1 ] = await this.props.rps.getGame(logs[i].args.gameID);
      if(status.toNumber() === 0 && player1.toLowerCase() !== address.toLowerCase()){
        openGamesDiv.push(<JoinGameWrapper
                            key={logs[i].args.gameID.toNumber()}
                            gameID={logs[i].args.gameID.toNumber()}
                            bet={logs[i].args.bet.toNumber()}
                            opponentAddress={player1.toLowerCase()}
                            playerAddress={address}
                            rps={this.props.rps}
                            enigmaSetup={this.props.enigmaSetup}
                            onGameJoined={this.gameJoined}
                          />);
      }
    }
    let num = openGamesDiv.length;
    openGamesDiv = <Paper>{openGamesDiv}</Paper>;
    this.setState({
      numOpenGames: num,
      openGamesDiv: openGamesDiv
    });
    // Trigger RockPaperScissors changeAddress callback
    this.props.onUpdateOpenGames(num);
  }

  render() {
    return (
      this.state.openGamesDiv
    );
  }
}

export default OpenGamesWrapper;
