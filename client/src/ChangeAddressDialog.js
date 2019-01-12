import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Blockies from "react-blockies";

const styles = theme => ({
 button: {
   display: "block",
   marginTop: theme.spacing.unit * 2
 },
 formControl: {
   margin: theme.spacing.unit,
   minWidth: 120
 }
});

class ChangeAddressDialog extends Component {
 constructor(props) {
   super(props);
   this.state = {
     open: false,
     playerAddress: this.props.playerAddress,
     button: <Button onClick={this.handleClickOpen} variant="outlined" color="secondary">Select Address</Button>
   };
   this.handleChangeAddress = this.handleChangeAddress.bind(this);
   this.handleSetAddress = this.handleSetAddress.bind(this);
 }

 componentDidMount() {
   if(this.state.playerAddress != '' && this.state.playerAddress !== undefined){
     console.log('componentDidMount: ', this.state.playerAddress);
     this.setState({
       button: <Button onClick={this.handleClickOpen}><Blockies seed={this.state.playerAddress.toLowerCase()} scale={5} className="identicon"/></Button>
     });
   }
 }

 handleClickOpen = () => {
   this.setState({ open: true });
 };

 handleClose = () => {
   this.setState({ open: false });
 };

 // onChange listener to update state with user-input address
 handleChangeAddress(event) {
   this.setState({
     playerAddress: event.target.value,
     button: <Button onClick={this.handleClickOpen}><Blockies seed={event.target.value.toLowerCase()} scale={5} className="identicon"/></Button>
   });
 }


 // onClick listener to update to trigger changeAddress callback from parent component
 async handleSetAddress(event) {
   event.preventDefault();
   // Trigger RockPaperScissors changeAddress callback
   this.props.onChangeAddress(
     this.state.playerAddress
   );
   this.setState({
     open: false
   });
 }

 render() {
   const { classes } = this.props;
   return (
     <div>

         {this.state.button}

       <Dialog
         open={this.state.open}
         onClose={this.handleClose}
         aria-labelledby="form-dialog-title"
       >
         <DialogTitle id="form-dialog-title">Choose Address</DialogTitle>
         <DialogContent>
           <DialogContentText>
             Please choose your address...
           </DialogContentText>
           <form className={classes.root} onSubmit={this.handleSubmit}>
             <FormControl className={classes.formControl}>
               <InputLabel htmlFor="playerAddress">
                 Player Address
               </InputLabel>
               <Select
                 value={this.state.playerAddress}
                 onChange={this.handleChangeAddress}
                 inputProps={{
                   name: "address",
                   id: "playerAddress"
                 }}
               >
                 {this.props.accounts.map((account, i) => {
                   return (
                     <MenuItem key={i} value={account.toLowerCase()}>
                       <Blockies
                          seed={account.toLowerCase()}
                          scale={5}
                          className="identicon selectAddress"
                       />
                       <span className="playerAddress">{account}</span>
                     </MenuItem>
                   );
                 })}
               </Select>
             </FormControl>
           </form>
         </DialogContent>
         <DialogActions>
           <Button onClick={this.handleClose} color="primary">
             Cancel
           </Button>
           <Button onClick={this.handleSetAddress}>Use Address</Button>
         </DialogActions>
       </Dialog>
     </div>
   );
 }
}

ChangeAddressDialog.propTypes = {
 classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ChangeAddressDialog);
