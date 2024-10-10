import React from "react";

export const GameModal = ({ open, handleClose, gameData }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{gameData.name}</h2>
          <button className="close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>

        <div className="thumbnail-container">
          <img
            className="thumbnail"
            src={gameData.thumbnail}
            alt={gameData.name}
          />
        </div>

        <div className="game-info">
          <p>{gameData.description}</p>
          <div className="meta-info">
            <span>Vendor: {gameData.vendor}</span>
            {gameData.categories &&
              gameData.categories.map((category, index) => (
                <span key={index}>Category: {category}</span>
              ))}
            <span>
              Payout: {(gameData.theoreticalPayOut * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        {gameData.features && (
          <div className="features">
            <h4>What to Expect:</h4>
            <ul>
              {gameData.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
