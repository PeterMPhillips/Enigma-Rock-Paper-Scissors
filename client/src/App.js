import React, { Component } from "react";
import {Helmet} from 'react-helmet';
import getContractInstance from "./utils/getContractInstance";
import EnigmaSetup from "./utils/getEnigmaSetup";
import Header from "./Header";
import Splash from "./Splash";
import RockPaperScissorsContractDefinition from "./contracts/RockPaperScissors.json";
import RockPaperScissorsWrapper from "./RockPaperScissorsWrapper";
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiThemeProvider, createMuiTheme, withTheme} from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import lightBlue from '@material-ui/core/colors/lightBlue';
import "./App.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blueGrey[900],
    },
    secondary: {
      main: lightBlue[300],
    },
  },
  appBackground: blueGrey[50],
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enigmaSetup: null,
      rps: null
    };
  }

  componentDidMount = async () => {
    /*
    Initialize bundled object containing web3, accounts, Enigma/EnigmaToken contracts, and
    enigma/principal wrappers
    */
    let enigmaSetup = new EnigmaSetup();
    await enigmaSetup.init();
    // Initialize RockPaperScissors contract instance
    const rps = await getContractInstance(
      enigmaSetup.web3,
      RockPaperScissorsContractDefinition
    );

    this.setState({ enigmaSetup, rps });
  };

  render() {
    if (!this.state.enigmaSetup) {
      return (
        <MuiThemeProvider theme={theme}>
          <div className="App">
            <Helmet>
                <style>{`body { background-color: ${theme.appBackground} !important}`}</style>
            </Helmet>
            <Header/>
            <Splash />
            <br />
            <CircularProgress color="secondary"/>
          </div>
        </MuiThemeProvider>
      );
    } else {
      return (
        <MuiThemeProvider theme={theme}>
          <div className="App">
            <Helmet>
                <style>{`body { background-color: ${theme.appBackground} !important}`}</style>
            </Helmet>
            <RockPaperScissorsWrapper
              enigmaSetup={this.state.enigmaSetup}
              rps={this.state.rps}
            />
          </div>
        </MuiThemeProvider>
      );
    }
  }
}

export default withTheme()(App);
