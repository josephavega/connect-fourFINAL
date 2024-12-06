import React from "react";
import RedChip from "../../../public/Board/Gamepieces/Chip_Red.png";
import YellowChip from "../../../public/Board/Gamepieces/Chip_Yellow.png";
import AnvilChip from "../../../public/Board/Gamepieces/Powerup_Anvil.png";
import LightningChip from "../../../public/Board/Gamepieces/Powerup_Lightning.png";
import BrickChip from "../../../public/Board/Gamepieces/Powerup_Brick.png";
import "../styles/topgrid.css";

const TopGrid = ({
  selectedColumn,
  currentPlayer,
  redActiveButton,
  YellowActiveButton,
}) => {
  if (selectedColumn === null) return null; // Do not render if no column is selected

  const getChipImage = () => {
    if (currentPlayer === "Red") {
      if (redActiveButton === "anvil") {
        return AnvilChip;
      } else if (redActiveButton === "lightning") {
        return LightningChip;
      } else if (redActiveButton === "brick") {
        return BrickChip;
      } else {
        return RedChip;
      }
    } else if (currentPlayer === "Yellow") {
      return YellowChip; // Default to yellow chip
    }
  };

  const chipImage = getChipImage();

  const gridStyle = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  };

  return (
    <div style={gridStyle}>
      {Array(7)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            style={{
              visibility: index === selectedColumn ? "visible" : "hidden",
            }}
          >
            <img src={chipImage} alt={`${currentPlayer} Chip`} />
          </div>
        ))}
    </div>
  );
};

export default TopGrid;
