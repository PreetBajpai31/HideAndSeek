// (() => {
document.addEventListener("DOMContentLoaded", setup);
document.getElementById("play").addEventListener("click", () => {
  document.getElementById("overlay").style.display = "none";
});

const initialState = {
  width: 3,
  gifts: [],
  danger: undefined,
  level: 0,
  score: 100,
};

let game = { ...initialState };

function setup() {
  game.grid = document.getElementById("grid");
  game.toast = document.getElementById("toast");

  document.getElementById("retry").style.display = "none";

  drawBoard(game.width);
  randomizeGifts();

  document.getElementById("guess").addEventListener("click", () => {
    game.toast.style.visibility = "hidden";

    const cellChoice = getCellChoice();

    if (isNaN(cellChoice)) {
      game.toast.style.color = "red";
      game.toast.style.visibility = "visible";
      game.toast.textContent = "Invalid Choice";
      return;
    }

    if (!game.grid.children[cellChoice].classList.contains("closed")) return;

    game.grid.children[cellChoice].classList.remove("closed");

    if (game.danger == cellChoice) {
      game.grid.children[cellChoice].textContent = "⚠️";

      stopGame({ won: false });

      return;
    }

    if (game.gifts.includes(cellChoice)) {
      game.grid.children[cellChoice].textContent = "🎁";

      game.gifts = game.gifts.filter((c) => c != cellChoice);

      if (game.gifts.length == 0) {
        stopGame({ won: true });
      }

      return;
    }

    game.grid.children[cellChoice].textContent = "MISS";
    game.score -= 1;
  });

  document.getElementById("retry").addEventListener("click", () => {
    resetBoard();
    drawBoard();
    randomizeGifts();
  });
}

const getCellChoice = () => {
  const guessValue = document.getElementById("guessInput").value.toUpperCase();

  if (guessValue.length != 2) return NaN;

  const row = guessValue[0];
  const col = guessValue[1];

  if (isNaN(+col) || +col >= game.width) return NaN;
  if (/[A-F]/.test(row) == false) return NaN;

  if (row < "A" || row >= String.fromCodePoint("A".charCodeAt() + game.width))
    return NaN;

  const cellIndex = (row.charCodeAt(0) - 65) * game.width + +col;

  if (cellIndex < 0 || cellIndex >= game.grid.childElementCount) return NaN;

  return cellIndex;
};

const drawBoard = () => {
  const head = document.getElementById("head");
  const aside = document.getElementById("aside");

  game.grid.style.width = `${game.width * 50 + game.width * 4 + 12}px`;

  for (let i = 0; i < game.width; i++) {
    const cellCol = document.createElement("div");
    cellCol.innerHTML = `<span>${i}</span>`;
    head.appendChild(cellCol);

    const cellRow = document.createElement("div");
    cellRow.innerHTML = `<span>${String.fromCharCode(65 + i)}</span>`;
    aside.appendChild(cellRow);
  }

  for (let i = 0; i < game.width ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add("closed");

    game.grid.appendChild(cell);
  }
};

const resetBoard = () => {
  document.getElementById("head").replaceChildren();
  document.getElementById("aside").replaceChildren();
  document.getElementById("guessInput").style.display = "block";
  document.getElementById("guess").style.display = "block";
  document.getElementById("retry").style.display = "none";
  game.grid.replaceChildren();
  game.toast.style.visibility = "hidden";
};

const randomizeGifts = () => {
  const cells = game.grid.children;
  const size = cells.length;

  const indexes = shuffle([...Array(size).keys()]).slice(0, 4);
  const [dangerCell, ...giftCells] = indexes;

  game.gifts = giftCells;
  game.danger = dangerCell;
};

const stopGame = ({ won }) => {
  document.getElementById("guessInput").style.display = "none";
  document.getElementById("guess").style.display = "none";

  if (won) {
    game.level++;

    if (game.level < 3) {
      game.width = [3, 4, 6][game.level];

      game.toast.style.visibility = "visible";
      game.toast.style.color = "blue";
      game.toast.textContent = `➡️ Moving to next level...`;

      setTimeout(() => {
        resetBoard();
        drawBoard();
        randomizeGifts();
      }, 1000);

      return;
    }

    game.toast.style.visibility = "visible";
    game.toast.style.color = "green";
    game.toast.textContent = `🎉 Yay! You won the game and has scored ${game.score}/100`;
  } else {
    game.toast.style.visibility = "visible";
    game.toast.style.color = "red";
    game.toast.textContent =
      "😟Too Bad! You stepped on the land mine. Try playing again!";
  }

  game = { ...game, ...initialState };
  document.getElementById("retry").style.display = "block";
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const shuffle = (array) => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = getRandomInt(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};
// })();
