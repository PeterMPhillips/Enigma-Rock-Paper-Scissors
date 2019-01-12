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
	},
	userInfo: {
		position:'absolute',
		right:70,
		top:10,
		textAlign: 'right',
		minWidth:500
	},
	userInfoLabel: {
		marginRight:10,
		marginLeft:10,
		color:theme.palette.secondary.main
	}
});

class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
      playerAddress: this.props.playerAddress,
      earnings: this.props.earnings,
			balance: this.props.earnings,
			earningsString: '',
			balanceString: '',
      numOpenGames: 0,
			isTop: true
    };
		this.changeAddress = this.changeAddress.bind(this);
		this.setFunds = this.setFunds.bind(this);
	}

	componentDidMount() {
    document.addEventListener('scroll', () => {
      const isTop = window.scrollY < 325;
      if (isTop !== this.state.isTop) {
          this.setState({ isTop })
      }
    });
  }

	componentWillReceiveProps(nextProps) {
    if(this.state.balance != nextProps.balance || this.state.earnings != nextProps.earnings){
      this.setFunds(nextProps.earnings, nextProps.balance);
    }
  }

	/*
  Callback for starting a new game. Note that we are encrypting move data
  in this function and pass in those values to the contract
  */
  async changeAddress(address) {
    this.setState({
      playerAddress: address,
    });
		this.props.onChangeAddress(address);
  }

	async setFunds(earnings, balance) {
		let earningsString = await this.processWEI(earnings.toString());
		let balanceString = await this.processWEI(balance);
		this.setState({
			balanceString: balanceString,
      earningsString: earningsString
    });
	}

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

	render() {
		const { classes } = this.props;
		if(this.props.enigmaSetup){
			if(this.state.isTop){
				return (
					<div className={classes.root}>
					<AppBar position="fixed" className={classes.topAppBar}>
							<Toolbar>
								<span style={{position:'absolute', right:15}}>
									{this.state.playerAddress !== undefined &&
										<div className={classes.userInfo}>
											<p style={{fontWeight: 'bold'}}>{this.state.playerAddress}</p>
											<p style={{marginTop:-15, fontSize:'0.85em'}}><span className={classes.userInfoLabel}>Earnings:</span>{this.state.earningsString}<span className={classes.userInfoLabel}>Balance:</span>{this.state.balanceString}</p>
										</div>}
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
									{this.state.playerAddress !== undefined &&
										<div className={classes.userInfo}>
											<p style={{fontWeight: 'bold'}}>{this.state.playerAddress}</p>
											<p style={{marginTop:-15, fontSize:'0.85em'}}><span className={classes.userInfoLabel}>Earnings:</span>{this.state.earningsString}<span className={classes.userInfoLabel}>Balance:</span>{this.state.balanceString}</p>
										</div>}
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
