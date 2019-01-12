import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Header from "./Header";
import Splash from "./Splash";
import ChangeAddressDialog from "./ChangeAddressDialog";
import NewGameDialog from "./NewGameDialog";
import InfoWrapper from "./InfoWrapper";
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import blueGrey from '@material-ui/core/colors/blueGrey';


const styles = theme => ({
  root: {
    backgroundColor: '#ffffff'
  },
  close: {
    padding: theme.spacing.unit / 2,
  },
  snackbar: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 5
  }
});
const engUtils = require("./lib/enigma-utils");
const GAS = "1000000";

class RockPaperScissorsWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerAddress: '0x0000000000000000000000000000000000000000',
      earnings: 0,
      balance: 0,
      open: false
    };
    this.changeAddress = this.changeAddress.bind(this);
    this.setFunds = this.setFunds.bind(this);
    this.newGame = this.newGame.bind(this);
  }

  /*
  Callback for starting a new game. Note that we are encrypting move data
  in this function and pass in those values to the contract
  */
  async changeAddress(address) {
    let earnings = await this.props.rps.getEarnings(address);
    this.setState({
      playerAddress: address,
      totalEarnings: earnings.toNumber(),
    });
    this.setFunds(address);
    this.render();
  }

  //Callback to update earnings and balance
  async setFunds(address) {
    if(address != '0x0000000000000000000000000000000000000000'){
      let balance = await this.props.enigmaSetup.web3.eth.getBalance(address);
  		let earnings = await this.props.rps.getEarnings(address);
      earnings = earnings.toString();
  		this.setState({
  			balance: balance,
        earnings: earnings
      });
    }
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
    this.setFunds(this.state.playerAddress)
    this.setState({ open: true });
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
      return (
        <div>
          <Header
            rps={this.props.rps}
            enigmaSetup={this.props.enigmaSetup}
            earnings={this.state.earnings}
            balance={this.state.balance}
            onChangeAddress={this.changeAddress}
          />
          <Splash />
          <NewGameDialog
            playerAddress={this.state.playerAddress}
            onNewGame={this.newGame}
          />
          <br />
          <br />
          <InfoWrapper
            rps={this.props.rps}
            enigmaSetup={this.props.enigmaSetup}
            playerAddress={this.state.playerAddress}
            newGame={this.state.newGame}
            onGameUpdate={this.setFunds}
          />
          <Snackbar
            className={classes.snackbar}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            open={this.state.open}
            autoHideDuration={6000}
            onClose={this.handleClose}
            ContentProps={{
              'aria-describedby': 'message-id',
              classes: {
                root: classes.snackbar
              }
            }}
            message={
              <span id="message-id">
                <CheckCircleIcon />
                <span>New Game Started!</span>
              </span>}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          />
      </div>
    );
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
