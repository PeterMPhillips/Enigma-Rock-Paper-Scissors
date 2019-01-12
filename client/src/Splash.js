import React, { Component } from "react";
import { withTheme } from '@material-ui/core/styles';
import { Image } from 'semantic-ui-react';
import Logo from "./assets/rps-shift.svg";

class Splash extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { classes } = this.props;
		return (
			<div className="splash" style={{backgroundColor: this.props.theme.palette.primary.main, height: 575, width: '100%', padding:25}}>
				<Image style={{height: 300, marginTop: 75, marginLeft: 'auto', marginRight: 'auto'}} src={Logo}/>
			</div>
		);
	}
}

export default withTheme()(Splash);
