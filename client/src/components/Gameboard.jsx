import React, { useState, useEffect } from 'react';
import { Grid2 } from '@mui/material';
import '../styles/gameboard.css';
import TopGrid from '../components/TopGrid.jsx';
import ChipAnimation from '../components/ChipAnimation.jsx';

import EmptyChip from '../assets/Board/BoardTileBack.png';
import RedChip from '../assets/Board/Gamepieces/Chip_Red.png';
import YellowChip from '../assets/Board/Gamepieces/Chip_Yellow.png';

import BoardTileFront from '../assets/Board/BoardTileFront.png';
import HoverIndicator from '../assets/Board/BoardTileBack.png';
import { io } from 'socket.io-client';
import BoardBorder from "../assets/Board/Board_Boarder.png";

import RedSidebarBackground from '../assets/Board/Construction/Sidebar_Red.png';
import RedAnvilButton from '../assets/Board/Construction/Button_Anvil_Red.png';
import RedBrickButton from '../assets/Board/Construction/Button_Brick_Red.png';
import RedLightningButton from '../assets/Board/Construction/Button_Lightning_Red.png';

import YellowSidebarBackground from '../assets/Board/Construction/Sidebar_Yellow.png';
import YellowAnvilButton from '../assets/Board/Construction/Button_Anvil_Yellow.png';
import YellowBrickButton from '../assets/Board/Construction/Button_Brick_Yellow.png';
import YellowLightningButton from '../assets/Board/Construction/Button_Lightning_Yellow.png';

import UsedAnvilButton from '../assets/Board/Construction/Button_Anvil_Used.png';
import UsedLightningButton from '../assets/Board/Construction/Button_Lightning_Used.png';
import UsedBrickButton from '../assets/Board/Construction/Button_Brick_Used.png';

const socket = io('/game'); // Initialize the socket connection

const Gameboard = ({ board, onClick, currentPlayer, selectedColumn}) => {
  const [redAnvilImage, setRedAnvilImage] = useState(RedAnvilButton);
  const [redLightningImage, setRedLightningImage] = useState(RedLightningButton);
  const [redBrickImage, setRedBrickImage] = useState(RedBrickButton);

  const [yellowAnvilImage, setYellowAnvilImage] = useState(YellowAnvilButton);
  const [yellowLightningImage, setYellowLightningImage] = useState(YellowLightningButton);
  const [yellowBrickImage, setYellowBrickImage] = useState(YellowBrickButton);

  const [username, setUsername] = useState('');
  const [usernameB, setUsernameB] = useState('');

  const toggleRedAnvilImage = () => {
    if (currentPlayer === 'Red') {
    setRedAnvilImage((prevImage) => (prevImage === RedAnvilButton ? UsedAnvilButton : RedAnvilButton));
  }};
  const toggleRedLightningImage = () => {
    if (currentPlayer === 'Red') {
    setRedLightningImage((prevImage) => (prevImage === RedLightningButton ? UsedLightningButton : RedLightningButton));
  }};
  const toggleRedBrickImage = () => {
    if (currentPlayer === 'Red') {
    setRedBrickImage((prevImage) => (prevImage === RedBrickButton ? UsedBrickButton : RedBrickButton));
  }};
  const toggleYellowAnvilImage = () => {
    if (currentPlayer === 'Yellow') {
    setYellowAnvilImage((prevImage) => (prevImage === YellowAnvilButton ? UsedAnvilButton : YellowAnvilButton));
  }};
  const toggleYellowLightningImage = () => {
    if (currentPlayer === 'Yellow') {
    setYellowLightningImage((prevImage) => (prevImage === YellowLightningButton ? UsedLightningButton : YellowLightningButton));
  }};
  const toggleYellowBrickImage = () => {
    if (currentPlayer === 'Yellow') {
    setYellowBrickImage((prevImage) => (prevImage === YellowBrickButton ? UsedBrickButton : YellowBrickButton));
  }};


  const [activePowerup, setActivePowerup] = useState(null); // Track active power-up
  const sessionID = localStorage.getItem('sessionID');
  

  useEffect(() => {

    setUsername(localStorage.getItem('username'));

    socket.on('powerupUsed', ({ powerupType }) => {
      setActivePowerup(powerupType);
    });
    
    return () => {
      socket.off('powerupUsed');
    };
  }, []);

  const createMainGrid = () => {
    const rows = 6;
    const cols = 7;
    const grid = [];

    for (let i = 0; i < rows; i++) {
      const rowTiles = [];
      for (let j = 0; j < cols; j++) {
        let chipType;
        if (board[i][j] === 'R') {
          chipType = RedChip;
        } else if (board[i][j] === 'Y') {
          chipType = YellowChip;
        } else {
          chipType = EmptyChip;
        }

        rowTiles.push(
          <Grid2
            item
            key={`${i}-${j}`}
            className="tile-container"
          >
            <div className="tile" onClick={() => onClick(i, j)}>
              <img src={chipType} alt="Tile Chip" className="tile-back" />
              <img src={BoardTileFront} alt="Tile Front" className="tile-front" />
            </div>
          </Grid2>
        );
      }
      grid.push(
        <Grid2 container key={`row-${i}`} className="row" columns={7}>
          {rowTiles}
        </Grid2>
      );
    }
    return grid;
  };

  return (
    <div className="gameboard-container">
      <div className="red-sidebar">
        <img src={RedSidebarBackground} alt="Sidebar Background" className="red-sidebar-background" />
        <div className="red-sidebar-content">
          <div className="red-sidebar-text">{username}</div>
          <button className="red-sidebar-button" onClick={toggleRedAnvilImage} disabled={currentPlayer !== 'Red'}>
            <img src={redAnvilImage} alt="Anvil Button" />
          </button>
          <button className="red-sidebar-button" onClick={toggleRedLightningImage} disabled={currentPlayer !== 'Red'}>
            <img src={redLightningImage} alt="Lightning Button" />
          </button>
          <button className="red-sidebar-button" onClick={toggleRedBrickImage} disabled={currentPlayer !== 'Red'}>
            <img src={redBrickImage} alt="Brick Button" />
          </button>
        </div>
      </div>
      <div>
      <div className="top-grid">
        <TopGrid selectedColumn={selectedColumn} currentPlayer={currentPlayer} />
      </div>
        <div className="gameboard-wrapper">
          <img src={BoardBorder} alt="Board Border" className="board-border" />
          <div className="gameboard">
            {createMainGrid()}
          </div>
        </div>
      </div>
      <div className="yellow-sidebar">
        <img src={YellowSidebarBackground} alt="Sidebar Background" className="yellow-sidebar-background" />
        <div className="yellow-sidebar-content">
          <div className="yellow-sidebar-text">NPC</div>
          <button className="yellow-sidebar-button" onClick={toggleYellowAnvilImage} disabled={currentPlayer !== 'Yellow'}>
            <img src={yellowAnvilImage} alt="Anvil Button" />
          </button>
          <button className="yellow-sidebar-button" onClick={toggleYellowLightningImage} disabled={currentPlayer !== 'Yellow'}>
            <img src={yellowLightningImage} alt="Lightning Button" />
          </button>
          <button className="yellow-sidebar-button" onClick={toggleYellowBrickImage} disabled={currentPlayer !== 'Yellow'}>
            <img src={yellowBrickImage} alt="Brick Button" />
          </button>
        </div>
      </div>
    </div>
  );
};

// socket.on('sendInstructions', moves => {
//   //'Place', 'Anvil', 'Broken', 'Lightning', 'Flipped', 'Brick', 'StoppedL','StoppedA', 'Win','Full'
// moves.forEach(instruction => {
//   var rule = instruction[0]
//   var col = instruction[1]
//   var row = instruction[2]
//   var type = instruction[3]
//   switch(rule){
//     case 'Place':
//       board[col][row] = type
//       break;
//     case 'Anvil':
//       //Play Anvil animation
//       break;
//     case 'Broken':
//       board[col][row] = type
//       break;
//     case 'Lightning':
//       //Play Lightning Animation
//       break;
//     case 'Flipped':
//       board[col][row] = type
//       break;
      
//   }
// });






// });

export default Gameboard;
