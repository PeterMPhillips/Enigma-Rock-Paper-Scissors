import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ChangeAddressDialog from "./ChangeAddressDialog";
import { Image } from 'semantic-ui-react';
import Logo from "./assets/rps.svg";

const styles = theme => ({
	root: {
		flexGrow: 1
	},
	flex: {
		flex: 1
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20
	},
	topAppBar: {
		boxShadow: 'none',
	}
});

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
      playerAddress: this.props.playerAddress,
      totalEarnings: 0,
      numOpenGames: 0,
			isTop: true
    };
		this.changeAddress = this.changeAddress.bind(this);
	}

	componentDidMount() {
    document.addEventListener('scroll', () => {
      const isTop = window.scrollY < 325;
      if (isTop !== this.state.isTop) {
          this.setState({ isTop })
      }
    });
  }

	/*
  Callback for starting a new game. Note that we are encrypting move data
  in this function and pass in those values to the contract
  */
  async changeAddress(address) {
    //let earnings = await this.props.rps.getEarnings(address);
		console.log('changeAddress: ', address);
    this.setState({
      playerAddress: address,
      //totalEarnings: earnings.toNumber()
    });
		this.props.onChangeAddress(address);
  }

	render() {
		const { classes } = this.props;
		if(this.props.enigmaSetup){
			if(this.state.isTop){
				return (
					<div className={classes.root}>
					<AppBar position="fixed" className={classes.topAppBar}>
							<Toolbar>
								<span style={{position:'absolute', right:15}}>
				          <span style={{position:'absolute', right:70, top:18}}>{this.state.playerAddress}</span>
									<ChangeAddressDialog
				            accounts={this.props.enigmaSetup.accounts}
										playerAddress={this.state.playerAddress}
				            onChangeAddress={this.changeAddress}
				          />
								</span>
							</Toolbar>
						</AppBar>
					</div>
				);
			} else {
				return (
					<div className={classes.root}>
					<AppBar position="fixed">
							<Toolbar>
								<Image style={{height: 50}} src={Logo}/>
								<span style={{position:'absolute', right:15}}>
				          <span style={{position:'absolute', right:70, top:18}}>{this.state.playerAddress}</span>
									<ChangeAddressDialog
				            accounts={this.props.enigmaSetup.accounts}
										playerAddress={this.state.playerAddress}
				            onChangeAddress={this.changeAddress}
				          />
								</span>
							</Toolbar>
						</AppBar>
					</div>
				);
			}

		} else {
			return (
				<div className={classes.root}>
					<AppBar position="fixed" style={{ background: 'transparent', boxShadow: 'none'}}>
						<Toolbar>
						</Toolbar>
					</AppBar>
				</div>
			);
		}

	}
}

Header.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
