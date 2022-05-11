"use strict";

let actualLevel = 0;

/**
 * Start the game when page is ready
 */
$(document).ready(function () {
  initLevel(0);
  buildLevel(0);

  $(".restart").click((event) => {
    event.preventDefault();
    initLevel(actualLevel);
    buildLevel(actualLevel);
  });
  $(".back").click((event) => {
    backToPreviousMove();
  });
});

const WALLS = [
  "┴",
  "┤",
  "╶",
  "╴",
  "╵",
  "│",
  "─",
  "┘",
  "└",
  "┐",
  "┌",
  "┬",
  "├",
  "╷",
  "═",
];
const BOX = "#";
const TARGET = "x";
const VALIDATED_BOX = "@";
const PLAYER = "P";
const GROUND = " ";
/**
 * @type {{ x: number; y: number; }[]}
 */
let currentTargets = [];
let setTargets = false;
/**
 * @type {string[]}
 */
let temporaryMap = [];
let moves = 0;
/**
 * @type {State[]}
 */
let states = [];

/**
 * build and show a level
 * @param {number} level
 */
function buildLevel(level) {
  actualLevel = level;
  $("#world").empty();
  temporaryMap.map((line) => {
    const container = $("<div></div>").appendTo("#world");
    for (let x = 0; x < line.length; x++) {
      const element = line.charAt(x);
      if (WALLS.includes(element)) {
        $(`<div>${element}</div>`).addClass("square wall").appendTo(container);
      } else if (element === GROUND) {
        $("<div>&nbsp;</div>").addClass("square ground").appendTo(container);
      } else if (element === BOX) {
        $(`<div>${element}</div>`).addClass("square box").appendTo(container);
      } else if (element === TARGET) {
        $(`<div>${element}</div>`)
          .addClass("square target")
          .appendTo(container);
        if (!setTargets) {
          currentTargets.push({
            x: x,
            y: temporaryMap.indexOf(line),
          });
        }
      } else if (element === VALIDATED_BOX) {
        $(`<div>${element}</div>`)
          .addClass("square box-on-target")
          .appendTo(container);
      } else {
        $(`<div id="player">${element}</div>`)
          .addClass("square player")
          .appendTo(container);
      }
    }
    $("<br/>").appendTo(container);
    return null;
  });
  if (!setTargets) {
    setTargets = true;
  }
}

/**
 * This method increments the number of moves
 */
function incrMoves() {
  moves += 1;
  $("#moves").text(`Déplacements : ${moves}`);
}

/**
 * This function can be used to get the position of player
 * @param {number} level
 * @returns {{x:number, y:number}} position of player (x,y)
 */
function getPlayerPosition(level) {
  let x = 0,
    y = 0;
  temporaryMap.forEach((line) => {
    if (line.includes(PLAYER)) {
      y = temporaryMap.indexOf(line);
      x = line.indexOf(PLAYER);
    }
  });
  return { x: x, y: y };
}

/**
 * This function can be used to get the square at position
 * @param {{x:number, y:number}} position
 * @returns {string} square at position x,y
 */
function getSquareAt(position) {
  let element = "";
  temporaryMap.forEach((line) => {
    if (temporaryMap.indexOf(line) === position.y) {
      element = line.charAt(position.x);
    }
  });
  return element;
}

/**
 * This method replace a character by an another in a string
 * @param {string} line
 * @param {number} index
 * @param {string} by
 * @returns {string}
 */
function replaceAt(line, index, by) {
  return line.substring(0, index) + by + line.substring(index + by.length);
}

/**
 * This method checks if the element at position x is a wall
 * @param {{x:number, y:number}} position
 * @returns {boolean}
 */
function isWall(position) {
  const square = getSquareAt(position);
  return WALLS.includes(square);
}

/**
 * This method checks if the element at position x is an obstacle
 * @param {{x:number, y:number}} position
 * @returns {boolean}
 */
function isObstacle(position) {
  const square = getSquareAt(position);
  return WALLS.includes(square) || square === BOX || square === VALIDATED_BOX;
}

/**
 * This method checks if the element at position x is a box
 * @param {{x:number, y:number}} position
 * @returns {boolean}
 */
function isBox(position) {
  const square = getSquareAt(position);
  return square === BOX || square === VALIDATED_BOX;
}

/**
 * This method allows to initialize a level (re-initialize)
 * @param {number} level
 */
function initLevel(level) {
  states = [];
  setTargets = false;
  moves = 0;
  currentTargets = [];
  $("#moves").text(`Déplacements : ${moves}`);
  temporaryMap = levels[level].map.slice();
}

/**
 * This method allows to check if all the boxes are on the targets
 * @returns {boolean}
 */
function allOnTarget() {
  return currentTargets.every((pos) => getSquareAt(pos) === VALIDATED_BOX);
}

/**
 * This method moves an element from one position
 * @param {{x:number, y:number}} pos
 * @param {{x:number, y:number}} newPos
 * @param {{box: boolean, pull?: boolean, pullFrom?: {x:number, y:number}, posBox?: {x:number, y:number}}} update
 */
function changeOnMove(pos, newPos, update) {
  // We move the player to the next square (where he wants to go)
  temporaryMap[newPos?.y] = replaceAt(
    temporaryMap[newPos?.y],
    newPos?.x,
    PLAYER
  );
  // The square on which the player was standing is replaced by a blank or a target.
  temporaryMap[pos?.y] = replaceAt(
    temporaryMap[pos?.y],
    pos?.x,
    currentTargets.some(({ x, y }) => x === pos?.x && y === pos?.y)
      ? TARGET
      : GROUND
  );
  // We replace the box if there is one in front of the player
  if (update.box) {
    if (update.posBox) {
      temporaryMap[update.posBox.y] = replaceAt(
        temporaryMap[update.posBox.y],
        update.posBox.x,
        getSquareAt(update.posBox) === TARGET ? VALIDATED_BOX : BOX
      );
      if (update.pull) {
        temporaryMap[update.pullFrom.y] = replaceAt(
          temporaryMap[update.pullFrom.y],
          update.pullFrom.x,
          getSquareAt(update.pullFrom) === VALIDATED_BOX ? TARGET : GROUND
        );
      }
    }
  }
  incrMoves();
  buildLevel(actualLevel);
}

/**
 * This method allows you to finish one level and move on to the next
 */
function finishLevel() {
  initLevel(actualLevel + 1);
  buildLevel(actualLevel + 1);
}

/**
 * This method is used to get the direction in which the player wants to go
 * @param {string} direction
 * @param {boolean} isPull
 */
function move(direction, isPull) {
  const playerPos = getPlayerPosition(actualLevel);
  if (direction === "left") {
    const newPos = { x: playerPos.x - 1, y: playerPos.y };
    if (isPull) {
      if (!isObstacle(newPos)) {
        if (isBox({ x: playerPos.x + 1, y: playerPos.y })) {
          changeOnMove(playerPos, newPos, {
            box: true,
            pull: true,
            pullFrom: { x: playerPos.x + 1, y: playerPos.y },
            posBox: { x: playerPos.x, y: playerPos.y },
          });
          states.push(
            new State(
              { x: playerPos.x + 1, y: playerPos.y },
              { x: newPos.x, y: newPos.y }
            )
          );
        }
      }
    } else {
      if (!isWall(newPos)) {
        if (isBox(newPos)) {
          if (!isObstacle({ x: newPos.x - 1, y: newPos.y })) {
            changeOnMove(playerPos, newPos, {
              box: true,
              posBox: { x: newPos.x - 1, y: newPos.y },
            });
            states.push(new State(newPos, { x: newPos.x - 1, y: newPos.y }));
          }
        } else {
          changeOnMove(playerPos, newPos, { box: false });
          states.push(new State(newPos));
        }
      }
    }
    $("#player").removeClass();
    $("#player").addClass("square");
    $("#player").addClass("player-left");
  } else if (direction === "right") {
    const newPos = { x: playerPos.x + 1, y: playerPos.y };
    if (isPull) {
      if (!isObstacle(newPos)) {
        if (isBox({ x: playerPos.x - 1, y: playerPos.y })) {
          changeOnMove(playerPos, newPos, {
            box: true,
            pull: true,
            pullFrom: { x: playerPos.x - 1, y: playerPos.y },
            posBox: { x: playerPos.x, y: playerPos.y },
          });
          states.push(
            new State(
              { x: playerPos.x - 1, y: playerPos.y },
              { x: newPos.x, y: newPos.y }
            )
          );
        }
      }
    } else {
      if (!isWall(newPos)) {
        if (isBox(newPos)) {
          if (!isObstacle({ x: newPos.x + 1, y: newPos.y })) {
            changeOnMove(playerPos, newPos, {
              box: true,
              posBox: { x: newPos.x + 1, y: newPos.y },
            });
            states.push(new State(newPos, { x: newPos.x + 1, y: newPos.y }));
          }
        } else {
          changeOnMove(playerPos, newPos, { box: false });
          states.push(new State(newPos));
        }
      }
    }
    $("#player").removeClass();
    $("#player").addClass("square");
    $("#player").addClass("player-right");
  } else if (direction === "up") {
    const newPos = { x: playerPos?.x, y: playerPos.y - 1 };
    if (isPull) {
      if (!isObstacle(newPos)) {
        if (isBox({ x: playerPos.x, y: playerPos.y + 1 })) {
          changeOnMove(playerPos, newPos, {
            box: true,
            pull: true,
            pullFrom: { x: playerPos.x, y: playerPos.y + 1 },
            posBox: { x: playerPos.x, y: playerPos.y },
          });
          states.push(
            new State(
              { x: playerPos.x, y: playerPos.y - 1 },
              { x: newPos.x, y: newPos.y }
            )
          );
        }
      }
    } else {
      if (!isWall(newPos)) {
        if (isBox(newPos)) {
          if (!isObstacle({ x: newPos?.x, y: newPos.y - 1 })) {
            changeOnMove(playerPos, newPos, {
              box: true,
              posBox: { x: newPos?.x, y: newPos.y - 1 },
            });
            states.push(new State(newPos, { x: newPos.x, y: newPos.y - 1 }));
          }
        } else {
          changeOnMove(playerPos, newPos, { box: false });
          states.push(new State(newPos));
        }
      }
    }
    $("#player").removeClass();
    $("#player").addClass("square");
    $("#player").addClass("player-top");
  } else if (direction === "down") {
    const newPos = { x: playerPos.x, y: playerPos.y + 1 };
    if (isPull) {
      if (!isObstacle(newPos)) {
        if (isBox({ x: playerPos.x, y: playerPos.y - 1 })) {
          changeOnMove(playerPos, newPos, {
            box: true,
            pull: true,
            pullFrom: { x: playerPos.x, y: playerPos.y - 1 },
            posBox: { x: playerPos.x, y: playerPos.y },
          });
          states.push(
            new State(
              { x: playerPos.x, y: playerPos.y + 1 },
              { x: newPos.x, y: newPos.y }
            )
          );
        }
      }
    } else {
      if (!isWall(newPos)) {
        if (isBox(newPos)) {
          if (!isObstacle({ x: newPos?.x, y: newPos.y + 1 })) {
            changeOnMove(playerPos, newPos, {
              box: true,
              posBox: { x: newPos?.x, y: newPos.y + 1 },
            });
            states.push(new State(newPos, { x: newPos.x, y: newPos.y + 1 }));
          }
        } else {
          changeOnMove(playerPos, newPos, { box: false });
          states.push(new State(newPos));
        }
      }
    }
    $("#player").removeClass();
    $("#player").addClass("square");
    $("#player").addClass("player");
  }
  if (allOnTarget() && actualLevel !== 6) {
    setTimeout(() => {
      alert(
        `You've completed this level, press the SPACE key to go on the level ${
          actualLevel + 2
        }.`
      );
    }, 20);
  }
}

let keysPressed = {};
window.onkeyup = function (e) {
  delete keysPressed[e.which];
};
/**
 * On key pressed event
 */
window.onkeydown = function (e) {
  const key = e.keyCode || e.which;
  keysPressed[key] = true;

  switch (key) {
    case 37:
      move("left", keysPressed[16]);
      break;
    case 39:
      move("right", keysPressed[16]);
      break;
    case 38:
      move("up", keysPressed[16]);
      break;
    case 40:
      move("down", keysPressed[16]);
      break;
    case 32:
      if (allOnTarget()) {
        if (actualLevel === 6) {
          displayWinMessage();
        } else {
          finishLevel();
        }
      }
      break;
    default:
      break;
  }
};

/**
 * This method can be used to display a congratulation message to the player
 */
function displayWinMessage() {
  $("#world").empty();
  const container = $("<div></div>").appendTo("#world");
  $('<div><img id="theImg" src="assets/gg.gif" /></div>').appendTo(container);
}

/**
 * This method allow the player to back to previous move
 */
function backToPreviousMove() {
  if (states.length !== 0) {
    const penultimateMove = states[states.length - 2]; // Penultimate player move
    const lastMove = states[states.length - 1]; // Last player move (actual position)
    if (penultimateMove) {
      // Needs to clean up the position of the player where he is (since we go backwards) but we have to check if the square was not a target
      temporaryMap[lastMove.playerPosition.y] = replaceAt(
        temporaryMap[lastMove.playerPosition.y],
        lastMove.playerPosition.x,
        currentTargets.some(
          (target) =>
            lastMove.playerPosition.x === target.x &&
            lastMove.playerPosition.y === target.y
        )
          ? TARGET
          : GROUND
      );
      // We have to display the player where he was before so we use his second last action
      temporaryMap[penultimateMove.playerPosition.y] = replaceAt(
        temporaryMap[penultimateMove.playerPosition.y],
        penultimateMove.playerPosition.x,
        PLAYER
      );
      // Needs to check if you have moved a box
      if (lastMove.boxPosition !== undefined) {
        // We check if during the last action performed, the moved box is a validated box in this case we can determine if the box is a target or empty
        temporaryMap[lastMove.boxPosition.y] = replaceAt(
          temporaryMap[lastMove.boxPosition.y],
          lastMove.boxPosition.x,
          getSquareAt(lastMove.boxPosition) === VALIDATED_BOX ? TARGET : GROUND
        );
        // We check if the box was on a target during the last action, if so we replace it with a validated box and if not with a box
        temporaryMap[lastMove.playerPosition.y] = replaceAt(
          temporaryMap[lastMove.playerPosition.y],
          lastMove.playerPosition.x,
          getSquareAt(lastMove.playerPosition) === TARGET ? VALIDATED_BOX : BOX
        ); //
      }
    } else {
      // If the player has moved only once, the level is reset
      states.pop();
      initLevel(actualLevel);
      buildLevel(actualLevel);
      return;
    }
  }
  states.pop();
  buildLevel(actualLevel);
}
