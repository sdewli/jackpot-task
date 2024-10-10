// Function to fetch game information
export const fetchGameInfo = async (gameId) => {
	const response = await fetch(`https://jpapi-staging.jackpot.bet/casino/games/${gameId}`);
	if (!response.ok) throw new Error('Failed to fetch game info');
	return response.json();
};

// Function to fetch bet slip information
export const fetchBetSlipInfo = async (roundId) => {
	const response = await fetch(`https://jpapi-staging.jackpot.bet/transactions/bets/${roundId}`);
	if (!response.ok) throw new Error('Failed to fetch bet slip info');
	return response.json();
};

export const fetchGames = async (query) => {
	try {
	  const res = await fetch(
		`https://jpapi-staging.jackpot.bet/casino/games/search?query=${query}`
	  );
	  if (!res.ok) throw new Error("Network response was not ok");
	  return res.json();
	} catch (error) {
	  console.error("Failed to fetch games:", error);
	  throw new Error("Something went wrong while fetching games.");
	}
  };