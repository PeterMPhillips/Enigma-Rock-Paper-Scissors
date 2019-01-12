import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import JoinGameDialog from "./JoinGameDialog";
import Blockies from "react-blockies";
const engUtils = require("./lib/enigma-utils");

// Specify the signature for the callable and callback functions, make sure there are NO spaces
const CALLABLE = "calculateWinner(uint256,address[],string,string)";
const CALLBACK = "setWinner(uint256,address)";
const ENG_FEE = 1;
const GAS = "1000000";

const styles = theme => ({
  button: {
    display: "block",
    marginTop: theme.spacing.unit * 2
  }
});

class JoinGameWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      playerAddress: this.props.playerAddress,
      amount: '0 WEI'
    };
    this.joinGame = this.joinGame.bind(this);
    this.enigmaTask = this.enigmaTask.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.playerAddress !== nextProps.playerAddress){
      this.setState({
        playerAddress: nextProps.playerAddress
      });
      this.render();
    }
  }

  componentDidMount = async () => {
    if(this.props.bet !== undefined){
      let amount = await this.processWEI(this.props.bet.toString());
      this.setState({amount: amount});
    }
  };

  async processWEI(wei){
		let string;
		if(wei.length > 14){
			string = await this.props.enigmaSetup.web3.utils.fromWei(wei, 'ether');
			string = string + ' ETH';
		} else {
			string = wei + ' WEI';
		}
		return string;
	}


  /*
  Callback for joining a game. Note that we are encrypting move data
  in this function and pass in those values to the contract
  */
  async joinGame(move) {
    let encryptedMove = getEncryptedValue(move);
    await this.props.rps.joinGame(
      this.props.gameID,
      encryptedMove,
      { from: this.state.playerAddress, value: this.props.bet, gas: GAS }
    );
    let status = "Calculating winner...";
    this.setState({ result: status });
    this.render();
    await this.props.onGameJoined();
    // Run the enigma task secure computation above
    await this.enigmaTask(this.props.gameID);
    // Watch for event and update state once callback is completed/event emitted
    const callbackFinishedEvent = this.props.rps.Winner({gameID: this.props.gameID});
    callbackFinishedEvent.watch(async (error, result) => {
      let winner = result.args.winner.toLowerCase();
      //let winner = await this.props.rps.getWinner.call(this.props.gameID);

      if(winner == this.state.playerAddress.toLowerCase()){
        status = "WON!";
      } else if(winner == '0x0000000000000000000000000000000000000000'){
        status = "DRAW";
      } else{
        status = "LOST";
      }
      this.setState({ result: status });
      this.render();
    });
  }

  /*
  Creates an Enigma task to be computed by the network.
  */
  async enigmaTask() {
    let [ status, player1, player2, player1Move, player2Move, bet ] = await this.props.rps.getGame.call(this.props.gameID);
    if(status.toNumber() == 1){
      let gameID = this.props.gameID;
      let addresses = [player1, player2];
      let blockNumber = await this.props.enigmaSetup.web3.eth.getBlockNumber();
      /*
      Take special note of the arguments passed in here (blockNumber, dappContractAddress,
      callable, callableArgs, callback, fee, preprocessors). This is the critical step for how
      you run the secure computation from your front-end!!!
      */
      let task = await this.props.enigmaSetup.enigma.createTask(
        blockNumber,
        this.props.rps.address,
        CALLABLE,
        [gameID,addresses,player1Move,player2Move],
        CALLBACK,
        ENG_FEE,
        []
      );
      let resultFee = await task.approveFee({
        from: this.props.enigmaSetup.accounts[0],
        gas: GAS
      });
      let result = await task.compute({
        from: this.props.enigmaSetup.accounts[0],
        gas: GAS
      });
      console.log("got tx:", result.tx, "for task:", task.taskId, "");
      console.log("mined on block:", result.receipt.blockNumber);
    }
  }

  render() {
    if(this.state.result == null){
      return (
        <div className="game openGame">
          <span className="gameInfo">
            <Blockies
               seed={this.props.opponentAddress}
               scale={5}
               className="identicon"
            />
            <h3>#{this.props.gameID}</h3><span>Bet: {this.state.amount}</span>
          </span>
          <JoinGameDialog
            onJoinGame={this.joinGame}
          />

        </div>
      );
    } else {
      return (
        <div className="game openGame">
        <span className="gameInfo">
          <Blockies
             seed={this.props.opponentAddress}
             scale={5}
             className="identicon"
          />
          <h3>#{this.props.gameID}</h3><span>Bet: {this.state.amount}</span>
        </span>
          <span className="gameAction">{this.state.result}</span>
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

JoinGameWrapper.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(JoinGameWrapper);
