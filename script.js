function printGameCode() {
  // Define the list of cards
  const cards = [ // Array containing all card strings
    '2@', '2#', '2^', '2*',
    '3@', '3#', '3^', '3*',
    '4@', '4#', '4^', '4*',
    '5@', '5#', '5^', '5*',
    '6@', '6#', '6^', '6*',
    '7@', '7#', '7^', '7*',
    '8@', '8#', '8^', '8*',
    '9@', '9#', '9^', '9*',
    '10@', '10#', '10^', '10*',
    'J@', 'J#', 'J^', 'J*',
    'Q@', 'Q#', 'Q^', 'Q*',
    'K@', 'K#', 'K^', 'K*',
    'A@', 'A#', 'A^', 'A*'
  ]; 

  // Define a mapping of symbol values (assuming "@" is highest, then "*", "#", and "^")
  const symbolValues = {  // Object assigning numerical values to symbols
    "@": 4,
    "*": 3,
    "#": 2,
    "^": 1,
  };

  // Function to shuffle the cards
  function shuffleCards(cards) {  // Implementation of the Fisher-Yates shuffle algorithm
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  // Shuffle the cards
  const shuffledCards = shuffleCards(cards);
  console.log("Shuffled Cards:", shuffledCards);

  // Function to distribute cards to players
  function distributeCards(cards, numPlayers) {
    const players = new Array(numPlayers).fill().map(() => []); //fill() = Fills all the elements of the array with a default value.. map is to top up with a new value.
    let playerIndex = 0;
    cards.forEach((card) => {
      players[playerIndex].push(card);
      playerIndex = (playerIndex + 1) % numPlayers;
    });
    return players;
  }

  // Distribute the shuffled cards to 4 players
  const numPlayers = 4;
  const playersCards = distributeCards(shuffledCards, numPlayers);
  console.log("Players Cards:", playersCards);

  function evaluateWinner(playersCards) {
    // Define a mapping of card values into numbers instead of string, so that it actually holds a value
    const cardValues = { //putting in numbers so can easily group to find out AlphaNumeric Count.
      '2@': 2, '2#': 2, '2^': 2, '2*': 2,
      '3@': 3, '3#': 3, '3^': 3, '3*': 3,
      '4@': 4, '4#': 4, '4^': 4, '4*': 4,
      '5@': 5, '5#': 5, '5^': 5, '5*': 5,
      '6@': 6, '6#': 6, '6^': 6, '6*': 6,
      '7@': 7, '7#': 7, '7^': 7, '7*': 7,
      '8@': 8, '8#': 8, '8^': 8, '8*': 8,
      '9@': 9, '9#': 9, '9^': 9, '9*': 9,
      '10@': 10, '10#': 10, '10^': 10, '10*': 10,
      'J@': 11, 'J#': 11, 'J^': 11, 'J*': 11,
      'Q@': 12, 'Q#': 12, 'Q^': 12, 'Q*': 12,
      'K@': 13, 'K#': 13, 'K^': 13, 'K*': 13,
      'A@': 14, 'A#': 14, 'A^': 14, 'A*': 14
    };

    // Initialize variables
    let maxWinningCardsCount = 0;
    let winningPlayer = -1;
    let maxAlphanumericValue = 0;
    let maxSymbolValue = 0;

    // Iterate through each player
    playersCards.forEach((playerCards, index) => { //player1 array each index
      // Group cards by same alphanumeric (e.g., K, Q, A)
      const groupedCards = playerCards.reduce((groups, card) => { //reduce gives 1 final
        const key = card.slice(0, -1); // Extract the alphanumeric part by e.g. 10@ , slicing off @ and starting at [0]
        groups[key] = (groups[key] || []).concat(card); //If key = the same key, e.g. 4=4, we concat (add). If key = new group we add to [] empty.
        return groups;
      }, {});

      // Find the group with the most cards
      const bestGroup = Object.values(groupedCards).reduce(
        (best, current) => (current.length > best.length ? current : best),
        []
        // So [] is empty array. This method iterates and reduces the value to one best value which has the highest length.
      );

      // Update winner information if necessary
      if (
        bestGroup.length > maxWinningCardsCount || //determines most card counts
        (bestGroup.length === maxWinningCardsCount && //if equal, then next
          (cardValues[bestGroup[0].slice(0, -1)] > maxAlphanumericValue ||
            (cardValues[bestGroup[0].slice(0, -1)] === maxAlphanumericValue &&//if Alpha same && compare symbol
              symbolValues[bestGroup[0].slice(-1)] > maxSymbolValue)))
      ) {
        maxWinningCardsCount = bestGroup.length; //Sets the new highest card count to the length of the best group.
        winningPlayer = index + 1; //Identifies the current player as the new winner (index is adjusted for 1-based player numbering).
        maxAlphanumericValue = cardValues[bestGroup[0].slice(0, -1)]; //Updates the highest alphanumeric rank for comparison with future players.
        maxSymbolValue = symbolValues[bestGroup[0].slice(-1)]; //storing the best value for the symbol
      }
    });

    // Return the winner
    return {
      player: winningPlayer,
      winningCards: playersCards[winningPlayer - 1], // Array of winning cards for the winning player
    };
  }

  // Evaluate the winner
  const winner = evaluateWinner(playersCards);
  console.log("Winner:", winner);
}

const printButton = document.getElementById("printCodeButton");
printButton.addEventListener("click", printGameCode);
