const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "$": 2,
    "#": 4,
    "X": 6,
    "O": 8
};

const SYMBOL_VALUES = {
    "$": 5,
    "#": 4,
    "X": 3,
    "O": 2
};

const deposit = () => {
    while (true) {
        const depositAmount = parseFloat(prompt("Enter the deposit amount: "));
        if (isNaN(depositAmount) || depositAmount <= 0) {
            console.log("invalid deposit amount, try again.");
        } else {
            return depositAmount;
        }
    }
};

const getNumberOfLines = () => {
    while (true) {
        const numberOfLines = parseInt(prompt("Enter the number of lines to bet on (1-3): "));
        if (isNaN(numberOfLines) || numberOfLines < 1 || numberOfLines > 3) {
            console.log("invalid number of lines, try again");
        }
        else {
            return numberOfLines;
        }
    }
};

const getBetAmount = (balance, lines) => {
    while (true) {
        const betAmount = parseFloat(prompt("Enter the total Bet Amount per Line: "));
        if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance / lines) {
            console.log("invalid bet amount, try again");
        }
        else {
            return betAmount;
        }
    }
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const printRows = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString)
    }
    return rows;
};

const getWinnigs = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]]
        }
    }
    return winnings;
};

const main = () => {
    let balance = deposit();
    while (true) {
        console.log("You have a balance of $" + balance);
        const numberOfLines = getNumberOfLines();
        let betAmount = getBetAmount(balance, numberOfLines);
        balance -= betAmount * numberOfLines;
        const reels = spin();
        const rows = printRows(reels);
        const winnings = getWinnigs(rows, betAmount, numberOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());
        if (balance <= 0) {
            console.log("balance error");
            break;
        }
        const playAgain = prompt("Do you want to play again(y/n): ");
        if (playAgain != "y") break;
    }

};

main();