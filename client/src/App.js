import React, { Component } from "react";
import getContractInstance from "./utils/getContractInstance";
import EnigmaSetup from "./utils/getEnigmaSetup";
import RockPaperScissorsContractDefinition from "./contracts/RockPaperScissors.json";
import { Container, Message } from "semantic-ui-react";
import Header from "./Header";
import RockPaperScissorsWrapper from "./RockPaperScissorsWrapper";
import "./App.css";

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
        <div className="App">
          <Header />
          <Message color="red">Enigma setup still loading...</Message>
        </div>
      );
    } else {
      return (
        <div className="App">
          <Header />
          <br />
          <Container>
            <RockPaperScissorsWrapper
              enigmaSetup={this.state.enigmaSetup}
              rps={this.state.rps}
            />
          </Container>
        </div>
      );
    }
  }
}

export default App;
