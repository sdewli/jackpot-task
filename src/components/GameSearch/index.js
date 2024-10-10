"use client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { GameModal } from "../GameModal"; 
import {fetchGames} from '../../api/chat.api'


export default function GameSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState(null); 
  const [modalOpen, setModalOpen] = useState(false); 

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["games", searchQuery],
    queryFn: () => fetchGames(searchQuery),
    enabled: false, 
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      refetch();
    }
  };

  const handleImageClick = (game) => {
    setSelectedGame(game); 
    setModalOpen(true); 
  };

  const handleCloseModal = () => {
    setModalOpen(false); 
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest(".modal-overlay")) return;
      handleCloseModal();
    };

    if (modalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalOpen]);

  return (
    <div className="game-search-container">
      <h2 className="game-search-title">Game Search</h2>
      <div className="search-input-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a game"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>


      {isLoading && <p className="loading-message">Loading games...</p>}

    
      {error && (
        <p className="error-message">
          Error fetching games: {error.message || "Unknown error occurred."}
        </p>
      )}

      <ul className="game-list">
        {data?.data?.items === null ? (
          <p className="no-games-message">No games found</p>
        ) : (
          data?.data?.items?.map((game) => (
            <div key={game.externalId}>
              <li className="game-item">
                <img
                  src={game.thumbnail}
                  alt={game.name}
                  className="game-thumbnail"
                  onClick={() => handleImageClick(game)}
                />
                <span className="game-name">{game.name}</span>
              </li>
            </div>
          ))
        )}
      </ul>


      {modalOpen && selectedGame && (
        <GameModal
          open={modalOpen}
          handleClose={handleCloseModal}
          gameData={selectedGame}
        />
      )}
    </div>
  );
}
