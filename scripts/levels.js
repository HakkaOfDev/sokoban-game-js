"use strict";

/**
 * @typedef {Object} Level
 * @property {"easy" | "medium" | "difficult"} difficulty difficulty of level
 * @property {number} [best] best moves to perfect win
 * @property {string[]} map map of level, each line is a row of the level
 * The level map, line by line, with the following meaning for each symbol:
 *   * `P` – player,
 *   * `x` – target,
 *   * `#` – box,
 *   * `@` – validated box,
 *   * ` ` – (space) ground,
 *   * *other* – a wall.
 */

/**
 * Global* data structure for the data concerning the different levels of the game.
 * @type {Level[]}
 */
const levels = [
  {
    difficulty: "easy",
    best: 10,
    map: [
      "          ",
      "   ┌─┐    ",
      "   │x│    ",
      "   │ └──┐ ",
      " ┌─┘#P#x│ ",
      " │x # ┌─┘ ",
      " └──┐#│   ",
      "    │x│   ",
      "    └─┘   ",
      "          ",
    ],
  },
  {
    difficulty: "easy",
    best: 89,
    map: [
      "           ",
      " ┌───┐     ",
      " │P  │ ┌─┐ ",
      " │ ##│ │x│ ",
      " │ # └─┘x│ ",
      " └┬┐    x│ ",
      "  ├┘  ╷  │ ",
      "  │   ├──┘ ",
      "  │   │    ",
      "  └───┘    ",
      "           ",
    ],
  },
  {
    difficulty: "easy",
    best: 33,
    map: [
      "        ",
      "  ┌──┐  ",
      " ┌┘  │  ",
      " │P# │  ",
      " ├┐# └┐ ",
      " ├┘ # │ ",
      " │x#  │ ",
      " │xx@x│ ",
      " └────┘ ",
      "        ",
    ],
  },
  {
    difficulty: "medium",
    best: 253,
    map: [
      "                     ",
      "     ┌───┐           ",
      "     │   │           ",
      "     │#  │           ",
      "   ┌─┘  #└┐          ",
      "   │  # # │          ",
      " ┌─┘ │ ┌┐ │   ┌────┐ ",
      " │   │ └┘ └───┘  xx│ ",
      " │ #  #          xx│ ",
      " └───┐ ═══ ╷P┌┐  xx│ ",
      "     │     ├───────┘ ",
      "     └─────┘         ",
      "                     ",
    ],
  },
  {
    difficulty: "medium",
    map: [
      "                 ",
      " ┌────┬──────┐   ",
      " │xx  │      └─┐ ",
      " │xx  │ #  #   │ ",
      " │xx  ╵#──┬┐   │ ",
      " │xx    P └┘   │ ",
      " │xx  ╷ ╷  #  ╶┤ ",
      " └─┬──┘ └╴# #  │ ",
      "   │ #  # # #  │ ",
      "   │           │ ",
      "   └───────────┘ ",
      "                 ",
    ],
  },
  {
    difficulty: "medium",
    map: [
      "                    ",
      "         ┌──────┐   ",
      "         │     P│   ",
      "         │ #═# ┌┘   ",
      "         │ #  #│    ",
      "         ├╴# # │    ",
      " ┌──────┬┤ # ═ └─┐  ",
      " │xxxx  └┘ #  #  │  ",
      " ├╴xxx    #  #   │  ",
      " │xxxx  ┌────────┘  ",
      " └──────┘           ",
      "                    ",
    ],
  },
  {
    difficulty: "difficult",
    best: 57,
    map: [
      "              ",
      "  ┌──┐  ┌───┐ ",
      " ┌┘  │  │   │ ",
      " │ # └──┘#  │ ",
      " │  #xxxx # │ ",
      " └┐    ╷ P ┌┘ ",
      "  └────┴───┘  ",
      "              ",
    ],
  },
];
