import React, { Component } from "react";
import CompletedGameWrapper from "./CompletedGameWrapper";
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

class CompletedGamesWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numCompletedGames: this.props.numCompletedGames,
      completedGamesDiv: <CircularProgress color="secondary"/>,
      playerAddress: this.props.playerAddress
    };
    this.getCompletedGames = this.getCompletedGames.bind(this);
    this.withdrawn = this.withdrawn.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.playerAddress !== nextProps.playerAddress){
      this.setState({
        playerAddress: nextProps.playerAddress
      });
      this.getCompletedGames(nextProps.playerAddress);
    }
  }

  componentDidMount = async () => {
    this.getCompletedGames(this.state.playerAddress);
  };

  async withdrawn(){
    this.props.onUpdateFunds();
  }

  async getCompletedGames(address) {
    let completedGamesDiv = [];
    let e = await this.props.rps.Winner({}, {fromBlock: 0, toBlock: 'latest'});
    let logs = await Promisify(callback => e.get(callback));
    for(var i=0; i<logs.length; i++){
      let [ status, player1, player2, player1Move, player2Move, bet] = await this.props.rps.getGame(logs[i].args.gameID);
      if(status.toNumber() >= 1 && (player1.toLowerCase() === address.toLowerCase() || player2.toLowerCase() === address.toLowerCase())){
        let winner = logs[i].args.winner;
        let result;
        if(winner.toLowerCase() === address.toLowerCase()){
          result = 'Won';
        } else if(winner.toLowerCase() === '0x0000000000000000000000000000000000000000') {
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
                            onWithdrawn={this.withdrawn}
                          />);
      }
    }
    completedGamesDiv.reverse();
    let num = completedGamesDiv.length;
    completedGamesDiv = <Paper>{completedGamesDiv}</Paper>;
    this.setState({
      numCompletedGames: num,
      completedGamesDiv: completedGamesDiv
    });

    // Trigger RockPaperScissors changeAddress callback
    this.props.onUpdateCompletedGames(num);
  }

  render() {
    return (
      this.state.completedGamesDiv
    );
  }
}

export default CompletedGamesWrapper;
