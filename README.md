# Engima, Rock, Paper, Scissors

## Install
### Download and deploy enigma-docker-network
- Navigate to the directory you would like to install enigma-docker-network

```bash
git clone https://github.com/enigmampc/enigma-docker-network.git
cd enigma-docker-network
./launch.bash -t -s

```
- Note, there are additional dependencies to install including docker and docker-compose. Please follow the guide at [enigma-docker-network](https://github.com/enigmampc/enigma-docker-network)

### Download and install Enigma, Rock, Paper, Scissors
- Navigate to the directory you would like to install ERPS

```bash
git clone https://github.com/PeterMPhillips/Enigma-Rock-Paper-Scissors.git
cd Enigma-Rock-Paper-Scissors
npm install
```

### Deploy contract to Enigma testnet
```bash
darq-truffle migrate --reset --network development
```

### Install and start react server

```bash
cd client
npm install
sudo npm run start
```

## Using app

- Navigate browser to https://localhost:3000/
- Wait for Enigma to load
- Select address
- Press 'Start New Game' button and select move and bet
- Change address
- Find open game, press 'Play Game' and select move
- See who wins

## Notes

- Right now Enigma is taking issue with the bytes32 gameID, need to change it to uint
- Some elements need to update on state change (e.g. 'total earnings' when a new game is started)
- Needs a page for withdrawing earnings, viewing stats on past games, leaderboard
