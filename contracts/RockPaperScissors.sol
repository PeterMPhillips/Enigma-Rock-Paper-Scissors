pragma solidity 0.4.24;

contract RockPaperScissors {
  address public owner;
  address public enigma;

  struct Game {
    uint8 status;
    address winner;
    address player1;
    address player2;
    bytes player1Move;
    bytes player2Move;
    uint256 bet;
  }

  //mapping(bytes32 => uint8) public results;
  mapping(uint256 => Game) public games;
  mapping(address => int256) public earnings;
  uint256[] public openGames;
  uint256 gameCount;

  // Constructor called when new contract is deployed
  constructor(address _enigmaAddress) public {
    owner = msg.sender;
    enigma = _enigmaAddress;
    gameCount = 0;
  }

  //Create new game, pass bet and encrypted move
  function newGame(bytes _move)
  payable
  external {
    uint256 gameID = gameCount;
    gameCount += 1;
    games[gameID].player1 = msg.sender;
    games[gameID].player1Move = _move;
    games[gameID].bet = msg.value;
    earnings[msg.sender] -= int256(msg.value);
    emit NewGame(gameID, msg.sender, msg.value);
  }

  //Join an open game
  function joinGame(uint256 _gameID, bytes _move)
  payable
  external {
    require(games[_gameID].player2 == address(0));
    require(games[_gameID].bet == msg.value);
    games[_gameID].player2 = msg.sender;
    games[_gameID].player2Move = _move;
    games[_gameID].status = 1;
    earnings[msg.sender] -= int256(msg.value);
    emit Participant(_gameID, games[_gameID].player1);
    emit Participant(_gameID, msg.sender);
  }

  //Withdraw winnings
  function withdraw(uint256 _gameID)
  external{
    require(games[_gameID].status == 2);
    games[_gameID].status = 3;
    uint winnings;
    if(games[_gameID].winner == address(0)){
      winnings = games[_gameID].bet; //Since no winner, return bets
      earnings[games[_gameID].player1] += int256(winnings);
      earnings[games[_gameID].player2] += int256(winnings);
      games[_gameID].player1.transfer(winnings);
      emit Withdraw(_gameID, games[_gameID].player1, winnings);
      games[_gameID].player2.transfer(winnings);
      emit Withdraw(_gameID, games[_gameID].player2, winnings);
    } else {
      require(games[_gameID].winner == msg.sender);
      winnings = games[_gameID].bet*2; //Return the bet amount from both users
      earnings[msg.sender] += int256(winnings);
      msg.sender.transfer(winnings);
      emit Withdraw(_gameID, msg.sender, winnings);
    }
  }

  //Callable  function
  function calculateWinner(uint256 _gameID, address[] _players, string _move1, string _move2)
  public
  pure
  returns(uint256, address){
    require(_players.length == 2);
    address winner;
    bytes32 move1 = keccak256(abi.encode(_move1));
    bytes32 move2 = keccak256(abi.encode(_move2));
    bytes32 rock = keccak256(abi.encode('rock'));
    bytes32 paper =  keccak256(abi.encode('paper'));
    bytes32 scissors = keccak256(abi.encode('scissors'));

    if(
      (move1 == rock && move2 == scissors) ||
      (move1 == paper && move2 == rock) ||
      (move1 == scissors && move2 == paper)
    ){
      winner = _players[0];
    }else if(
      (move1 == rock && move2 == paper) ||
      (move1 == paper && move2 == scissors) ||
      (move1 == scissors && move2 == rock)
    ){
      winner = _players[1];
    }else{
      winner = address(0);
    }
    return (_gameID, winner);
  }

  //Callback function
  function setWinner(uint256 _gameID, address _address) public onlyEnigma() {
    games[_gameID].status = 2;
    games[_gameID].winner = _address;
    emit Winner(_gameID, _address);
  }

  function getGame(uint256 _gameID)
  external
  view
  returns(uint8, address, address, bytes, bytes, uint256){
    return (games[_gameID].status,
            games[_gameID].player1,
            games[_gameID].player2,
            games[_gameID].player1Move,
            games[_gameID].player2Move,
            games[_gameID].bet);
  }

  function getWinner(uint256 _gameID)
  external
  view
  returns(address){
    return games[_gameID].winner;
  }

  function getStatus(uint256 _gameID)
  external
  view
  returns(uint8){
    return games[_gameID].status;
  }

  function getEarnings(address _address)
  external
  view
  returns(int256){
    return earnings[_address];
  }

  // Modifier to ensure only enigma contract can call function
  modifier onlyEnigma() {
    require(msg.sender == enigma);
    _;
  }

  // Event emitted upon callback completion; watched from front end
  event Winner(uint256 indexed gameID, address indexed winner);
  event NewGame(uint256 indexed gameID, address indexed player1, uint256 indexed bet);
  event Participant(uint256 indexed gameID, address indexed player);
  event Withdraw(uint256 indexed gameID, address indexed player, uint256 indexed amount);
}
