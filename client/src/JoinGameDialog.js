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

class JoinGameDialog extends Component {
 constructor(props) {
   super(props);
   this.state = {
     open: false,
     playerMove: "None"
   };
   this.handleChangeMove = this.handleChangeMove.bind(this);
   this.handleSetMove = this.handleSetMove.bind(this);
 }

 handleClickOpen = () => {
   this.setState({ open: true });
 };

 handleClose = () => {
   this.setState({ open: false });
 };

 // onChange listener to update state with user-input move
 handleChangeMove(event) {
   this.setState({ playerMove: event.target.value });
 }

 // onClick listener to update to trigger newGame callback from parent component
 async handleSetMove(event) {
   event.preventDefault();
   // Trigger JoinGameWrapper joinGame callback
   this.props.onJoinGame(
     this.state.playerMove
   );
   this.setState({
     open: false,
   });
 }

 render() {
   const { classes } = this.props;
   return (
     <div>
       <Button
         onClick={this.handleClickOpen}
         variant="contained"
         color="secondary"
       >
         Play Game
       </Button>
       <Dialog
         open={this.state.open}
         onClose={this.handleClose}
         aria-labelledby="form-dialog-title"
       >
         <DialogTitle id="form-dialog-title">Choose Your Move</DialogTitle>
         <DialogContent>
           <DialogContentText>
             Select a move...
           </DialogContentText>
           <form className={classes.root} onSubmit={this.handleSetMove}>
             <FormControl className={classes.formControl}>
               <InputLabel htmlFor="playerMove">
                 Player Move
               </InputLabel>
               <Select
                 value={this.state.playerMove}
                 onChange={this.handleChangeMove}
                 inputProps={{
                   name: "move",
                   id: "playerMove"
                 }}
               >
                 <MenuItem value="">
                   <em>None</em>
                 </MenuItem>
                 <MenuItem value='rock'>
                   Rock
                 </MenuItem>
                 <MenuItem value='paper'>
                   Paper
                 </MenuItem>
                 <MenuItem value='Scissors'>
                   Scissors
                 </MenuItem>
               </Select>
             </FormControl>
           </form>
         </DialogContent>
         <DialogActions>
           <Button onClick={this.handleClose} color="primary">
             Cancel
           </Button>
           <Button onClick={this.handleSetMove}>Play Game</Button>
         </DialogActions>
       </Dialog>
     </div>
   );
 }
}

JoinGameDialog.propTypes = {
 classes: PropTypes.object.isRequired
};

export default withStyles(styles)(JoinGameDialog);
