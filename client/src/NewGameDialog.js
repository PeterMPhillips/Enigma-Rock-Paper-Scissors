import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const styles = theme => ({
 button: {
   display: "block",
   marginTop: theme.spacing.unit * 2,
 },
 formControl: {
   margin: theme.spacing.unit,
   minWidth: 120
 }
});

class NewGameDialog extends Component {
 constructor(props) {
   super(props);
   this.state = {
     open: false,
     playerMove: '',
     playerBet: 0,
     playerAddress: this.props.playerAddress
   };
   this.handleChangeMove = this.handleChangeMove.bind(this);
   this.handleChangeBet = this.handleChangeBet.bind(this);
   this.handleNewGame = this.handleNewGame.bind(this);
 }

 componentWillReceiveProps(nextProps) {
   if(this.state.playerAddress != nextProps.playerAddress){
     this.setState({
       playerAddress: nextProps.playerAddress,
     });
     this.render();
   }
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

 handleChangeBet(event) {
   this.setState({ playerBet: event.target.value });
 }

 // onClick listener to update to trigger newGame callback from parent component
 async handleNewGame(event) {
   event.preventDefault();
   console.log(event);
   // Trigger RockPaperScissors newGame callback
   this.props.onNewGame(
     this.state.playerMove,
     this.state.playerBet
   );
   this.setState({
     open: false,
     playerMove: '',
     playerBet: null
   });
 }

 render() {
   const { classes } = this.props;
   if(this.state.playerAddress != ''){
     return (
       <div style={{marginTop: -130}}>
         <Button
           onClick={this.handleClickOpen}
           disabled={this.state.buttonState}
           variant="contained"
           color="secondary"
           size="large"
           style={{fontSize:'1.1em', height: 60, width: 200}}

         >
           Start New Game
         </Button>
         <Dialog
           open={this.state.open}
           onClose={this.handleClose}
           aria-labelledby="form-dialog-title"
         >
           <DialogTitle id="form-dialog-title">New Game</DialogTitle>
           <DialogContent>
             <DialogContentText>
               Set your move and bet...
             </DialogContentText>
             <form className={classes.root} onSubmit={this.handleNewGame}>
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
                   <MenuItem value='rock'>
                     <em>Rock</em>
                   </MenuItem>
                   <MenuItem value='paper'>
                     <em>Paper</em>
                   </MenuItem>
                   <MenuItem value='scissors'>
                     <em>Scissors</em>
                   </MenuItem>
                 </Select>
               </FormControl>
               <FormControl className={classes.formControl}>
                 <InputLabel htmlFor="playerBet">
                   WEI to bet
                 </InputLabel>
                 <Input
                   id="playerBet"
                   onChange={this.handleChangeBet}
                   autoComplete="off"
                 />
               </FormControl>
             </form>
           </DialogContent>
           <DialogActions>
             <Button onClick={this.handleClose} color="primary">
               Cancel
             </Button>
             <Button onClick={this.handleNewGame}>Start Game</Button>
           </DialogActions>
         </Dialog>
       </div>
     );
   } else {
     return (
       <div  style={{marginTop: -130}}>
         <Button
           onClick={this.handleClickOpen}
           disabled={this.state.buttonState}
           variant="contained"
           color="secondary"
           size="large"
           style={{fontSize:'1.1em', height: 60, width: 200}}

         >
           Start New Game
         </Button>
         <Dialog
           open={this.state.open}
           onClose={this.handleClose}
           aria-labelledby="form-dialog-title"
         >
           <DialogTitle id="form-dialog-title">New Game</DialogTitle>
           <DialogContent>
             <DialogContentText>
               Please select an account first...
             </DialogContentText>
           </DialogContent>
           <DialogActions>
             <Button onClick={this.handleClose} color="primary">
               Cancel
             </Button>
           </DialogActions>
         </Dialog>
       </div>
     );
   }
 }
}

NewGameDialog.propTypes = {
 classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NewGameDialog);
