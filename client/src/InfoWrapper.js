import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Container } from "semantic-ui-react";
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import OpenGamesWrapper from "./OpenGamesWrapper";
import CompletedGamesWrapper from "./CompletedGamesWrapper";
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
  root: {
    flexGrow: 1,
  },
  badge: {
    top:-4,
    right: -30,
  },
  tabsRoot: {
    minHeight:'60px'
  },
  tabRoot: {
    minHeight:'60px',
    minWidth:'200px',
    fontWeight: 'bold'
  },
  label: {
    fontSize: '1.1em'
  },
});

class InfoWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.changeNumOpenGames = this.changeNumOpenGames.bind(this);
    this.changeNumCompletedGames = this.changeNumCompletedGames.bind(this);
    this.updateFunds = this.updateFunds.bind(this);
    this.state = {
      value: 0,
      numOpenGames: 0,
      numCompletedGames: 0,
      playerAddress: this.props.playerAddress,
    };
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.playerAddress != nextProps.playerAddress){
      this.setState({playerAddress: nextProps.playerAddress});
      if(this.state.value != 0){
        this.getNumOpenGames(nextProps.playerAddress);
      }
      if(this.state.value != 1){
        this.getNumCompleteGames(nextProps.playerAddress);
      }
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  async getNumOpenGames(address) {
    let count = 0;
    let e = await this.props.rps.NewGame({}, {fromBlock: 0, toBlock: 'latest'});
    let logs = await Promisify(callback => e.get(callback));
    for (var i=0; i<logs.length; i++){
      if(logs[i].args.player1.toLowerCase() != address.toLowerCase()){ count++; }
    }
    await this.changeNumOpenGames(count);
  }

  async getNumCompleteGames(address) {
    let e = await this.props.rps.Participant({player: address}, {fromBlock: 0, toBlock: 'latest'});
    let logs = await Promisify(callback => e.get(callback));
    await this.changeNumCompletedGames(logs.length);
  }

  /*
  Callback for getting number of open games
  */
  async changeNumOpenGames(num) {
    this.setState({ numOpenGames: num });
    this.props.onGameUpdate(this.props.playerAddress);
  }

  /*
  Callback for getting number of open games
  */
  async changeNumCompletedGames(num) {
    this.setState({ numCompletedGames: num });
    this.props.onGameUpdate(this.props.playerAddress);
  }

  async updateFunds() {
    this.props.onGameUpdate(this.props.playerAddress);
  }

  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Paper className={classes.root}>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            classes={{ root: classes.tabsRoot }}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab
              classes={{ root: classes.tabRoot }}
              label={
                <Badge classes={{badge: classes.badge}} color="secondary" badgeContent={this.state.numOpenGames}>
                  <span className={classes.label} >Open Games</span>
                </Badge>
              }
            />
            <Tab
              classes={{ root: classes.tabRoot }}
              label={
                <Badge classes={{badge: classes.badge}} color="secondary" badgeContent={this.state.numCompletedGames}>
                  <span className={classes.label} >Completed Games</span>
                </Badge>
              }
            />
            <Tab
              classes={{ root: classes.tabRoot }}
              label={
                <span className={classes.label} >Leaderboard</span>
              }
              disabled
            />
          </Tabs>
        </Paper>
        <br />
        {this.state.value === 0 && <OpenGamesWrapper
                          rps={this.props.rps}
                          enigmaSetup={this.props.enigmaSetup}
                          playerAddress={this.props.playerAddress}
                          numOpenGames={this.state.numOpenGames}
                          numCompletedGames={this.state.numCompletedGames}
                          onUpdateOpenGames={this.changeNumOpenGames}
                          onUpdateCompletedGames={this.changeNumCompletedGames}
                        />}
        {this.state.value === 1 && <CompletedGamesWrapper
                          rps={this.props.rps}
                          enigmaSetup={this.props.enigmaSetup}
                          playerAddress={this.props.playerAddress}
                          numCompletedgames={this.state.numCompletedGames}
                          onUpdateCompletedGames={this.changeNumCompletedGames}
                          onUpdateFunds={this.updateFunds}
                        />}
        {this.state.value === 2 && ''}
        <br />
      </Container>
    );
  }
}

InfoWrapper.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InfoWrapper);
