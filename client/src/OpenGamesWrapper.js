import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import JoinGameWrapper from "./JoinGameWrapper";

const styles = theme => ({
  button: {
    display: "block",
    marginTop: theme.spacing.unit * 2
  }
});

class OpenGamesWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openGamesDiv: [],
      openGames: this.props.openGames,
      numOpenGames: this.props.numOpenGames
    };
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.openGames !== nextProps.openGames){
      this.setState({
        openGames: nextProps.openGames,
        numOpenGames: nextProps.numOpenGames
      });
      this.render();
    }
  }

  componentDidMount = async () => {
    if (this.state.numOpenGames !== 0) {
      let openGamesDiv = [];
      for(let i=0; i<this.state.numOpenGames; i++){
        openGamesDiv.push(<JoinGameWrapper
                            key={i}
                            gameID={this.state.openGames[i][6].toNumber()}
                            bet={this.state.openGames[i][5].toNumber()}
                            playerAddress={this.props.playerAddress}
                            rps={this.props.rps}
                            enigmaSetup={this.props.enigmaSetup}
                          />);
      }
      console.log(openGamesDiv);
      this.setState({ openGamesDiv });
    }
  };

  render() {
    return (
      <div>
        {this.state.openGamesDiv}
      </div>
    );
  }
}

OpenGamesWrapper.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(OpenGamesWrapper);
