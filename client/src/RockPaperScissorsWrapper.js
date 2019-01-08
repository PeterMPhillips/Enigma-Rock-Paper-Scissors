import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import ChangeAddressDialog from "./ChangeAddressDialog";
import NewGameDialog from "./NewGameDialog";
import OpenGamesWrapper from "./OpenGamesWrapper";
const engUtils = require("./lib/enigma-utils");
const GAS = "1000000";
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

const styles = theme => ({
  button: {
    display: "block",
    marginTop: theme.spacing.unit * 2
  }
});

class RockPaperScissorsWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerAddress: "Select Address...",
      totalEarnings: 0,
      numOpenGames: 0,
      openGames: null
    };
    this.changeAddress = this.changeAddress.bind(this);
    this.newGame = this.newGame.bind(this);
    this.getOpenGames = this.getOpenGames.bind(this);
  }

  componentDidMount = async () => {
    /*
    Check if we have an instance of the RockPaperScissors deployed or not before
    we call any functions on it
    */
    if (this.props.rps != null) {
      await this.getOpenGames();
    }
  };

  async getOpenGames() {
    let openGames = [];
    let numOpenGames = (await this.props.rps.gamesCount()).toNumber();
    for(var i=0; i<numOpenGames; i++){
      let openGame = await this.props.rps.getGame(i);
      let [ status, player1 ] = openGame;
      if(status.toNumber() == 0 && player1.toLowerCase() != this.state.playerAddress.toLowerCase()){
        openGames.push(openGame);
      }
    }
    console.log('open games', openGames);
    this.setState({
      openGames: openGames,
      numOpenGames: openGames.length
    });
    // this.render();
  }

  /*
  Callback for starting a new game. Note that we are encrypting move data
  in this function and pass in those values to the contract
  */
  async changeAddress(address) {
    this.setState({ playerAddress: address });
    let earnings = await this.props.rps.getEarnings(address);
    this.setState({ totalEarnings: earnings.toNumber() });
    await this.getOpenGames();
  }

  /*
  Callback for starting a new game. Note that we are encrypting move data
  in this function and pass in those values to the contract
  */
  async newGame(move, bet) {
    let encryptedMove = getEncryptedValue(move);
    await this.props.rps.newGame(
      encryptedMove,
      { from: this.state.playerAddress, value: bet, gas: GAS }
    );
    /*
    let numMillionaires = await this.props.millionairesProblem.numMillionaires.call();
    numMillionaires = numMillionaires.toNumber();
    this.setState({ numMillionaires });
    */
  }

  render() {
    if(this.state.numOpenGames == 0 || this.state.playerAddress == "Select Address..."){
      return (
        <div>
          <Paper>
            <br />
            <h2>{this.state.playerAddress}</h2>
            <ChangeAddressDialog
              accounts={this.props.enigmaSetup.accounts}
              onChangeAddress={this.changeAddress}
            />
            <h3>Total Earnings = {this.state.totalEarnings}</h3>
            <h3>Open Games = {this.state.numOpenGames}</h3>
            <br />
            <NewGameDialog
              playerAddress={this.state.playerAddress}
              onNewGame={this.newGame}
            />
            <br />
          </Paper>
        </div>
      );
    } else {
      return (
        <div>
          <Paper>
            <br />
            <h2>{this.state.playerAddress}</h2>
            <ChangeAddressDialog
              accounts={this.props.enigmaSetup.accounts}
              onChangeAddress={this.changeAddress}
            />
            <h3>Total Earnings = {this.state.totalEarnings}</h3>
            <h3>Open Games = {this.state.numOpenGames}</h3>
            <br />
            <NewGameDialog
              playerAddress={this.state.playerAddress}
              onNewGame={this.newGame}
            />
            <br />
          </Paper>
          <br />
          <OpenGamesWrapper
            rps={this.props.rps}
            enigmaSetup={this.props.enigmaSetup}
            playerAddress={this.state.playerAddress}
            numOpenGames={this.state.numOpenGames}
            openGames={this.state.openGames}
          />
        </div>
      );
    }
  }
}

// Function to encrypt values (in this case either address or net worth)
function getEncryptedValue(value) {
  let clientPrivKey =
         "853ee410aa4e7840ca8948b8a2f67e9a1c2f4988ff5f4ec7794edf57be421ae5";
  let enclavePubKey =
         "0061d93b5412c0c99c3c7867db13c4e13e51292bd52565d002ecf845bb0cfd8adfa5459173364ea8aff3fe24054cca88581f6c3c5e928097b9d4d47fce12ae47";
  let derivedKey = engUtils.getDerivedKey(enclavePubKey, clientPrivKey);
  let encrypted = engUtils.encryptMessage(derivedKey, value);

  return encrypted;
}

RockPaperScissorsWrapper.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RockPaperScissorsWrapper);
