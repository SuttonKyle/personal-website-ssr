// import { pipe } from "effect";
// import * as A from "effect/Array";
// import * as O from "effect/Option";
// import React, { useCallback, useEffect, useState } from "react";

// type RowOutput = {
//   row: number[];
//   score: number;
//   highest: number;
// };

// const combineRow =
//   (idx: number, score: number, highest: number) =>
//     (row: number[]): RowOutput => {
//       const j = idx + 1;
//       if (j >= row.length) {
//         return { row, score, highest };
//       }
//       return pipe(
//         A.get(row, idx),
//         O.bindTo("elI"),
//         O.bind("elJ", () => A.get(row, j)),
//         O.filter(({ elI, elJ }) => elI === elJ),
//         O.map(({ elI, elJ }) => pipe(
//           [...row.slice(0, idx), elI + elJ, ...row.slice(j + 1)],
//           combineRow(
//             j,
//             score + elI + elJ,
//             elI + elJ > highest ? elI + elJ : highest
//           ),
//         )),
//         O.getOrElse(() => combineRow(j, score, highest)(row))
//       );
//     };

// const collapseRow = (row: number[]): RowOutput => {
//   const n = row.length;
//   return pipe(
//     row.filter((a) => a !== 0),
//     combineRow(0, 0, 0),
//     (arr) =>
//       pipe(
//         A.makeBy(n - arr.row.length, () => 0),
//         A.prependAll(arr.row),
//         (row) => ({
//           row,
//           score: arr.score,
//           highest: arr.highest,
//         })
//       )
//   );
// };

// type MoveOutput = {
//   grid: number[][];
//   score: number;
//   highest: number;
// };

// const collapseRows = (rows: number[][], score: number, highest: number) =>
//   rows.map(collapseRow).reduce(
//     (acc: MoveOutput, curr) => ({
//       grid: [...acc.grid, curr.row],
//       score: acc.score + curr.score,
//       highest: curr.highest > acc.highest ? curr.highest : acc.highest,
//     }),
//     {
//       grid: [],
//       score,
//       highest,
//     }
//   );

// const collapseRowsUp = (
//   grid: number[][],
//   score: number,
//   highest: number
// ): MoveOutput => {
//   const rows: number[][] = Array.from(
//     { length: grid.length },
//     () => new Array()
//   );
//   for (let i = 0; i < rows.length; i++) {
//     for (let j = 0; j < rows.length; j++) {
//       rows[j].push(grid[i][j]);
//     }
//   }
//   const rowsCollapsed = collapseRows(rows, score, highest);
//   const newGrid: number[][] = Array.from(
//     { length: grid.length },
//     () => new Array()
//   );
//   for (let i = 0; i < newGrid.length; i++) {
//     for (let j = 0; j < newGrid.length; j++) {
//       newGrid[i].push(rowsCollapsed.grid[j][i]);
//     }
//   }
//   return {
//     grid: newGrid,
//     score: rowsCollapsed.score,
//     highest: rowsCollapsed.highest,
//   };
// };

// const collapseRowsDown = (
//   grid: number[][],
//   score: number,
//   highest: number
// ): MoveOutput => {
//   const rows: number[][] = Array.from(
//     { length: grid.length },
//     () => new Array()
//   );
//   for (let i = rows.length - 1; i >= 0; i--) {
//     for (let j = 0; j < rows.length; j++) {
//       rows[j].push(grid[i][j]);
//     }
//   }
//   const rowsCollapsed = collapseRows(rows, score, highest);
//   const newGrid: number[][] = Array.from(
//     { length: grid.length },
//     () => new Array()
//   );
//   for (let i = 0; i < newGrid.length; i++) {
//     for (let j = 0; j < newGrid.length; j++) {
//       newGrid[newGrid.length - i - 1].push(rowsCollapsed.grid[j][i]);
//     }
//   }
//   return {
//     grid: newGrid,
//     score: rowsCollapsed.score,
//     highest: rowsCollapsed.highest,
//   };
// };

// const collapseRowsLeft = (
//   grid: number[][],
//   score: number,
//   highest: number
// ): MoveOutput => {
//   const rows: number[][] = Array.from(
//     { length: grid.length },
//     () => new Array()
//   );
//   for (let i = 0; i < rows.length; i++) {
//     for (let j = 0; j < rows.length; j++) {
//       rows[i].push(grid[i][j]);
//     }
//   }
//   const rowsCollapsed = collapseRows(rows, score, highest);
//   const newGrid: number[][] = Array.from(
//     { length: grid.length },
//     () => new Array()
//   );
//   for (let i = 0; i < newGrid.length; i++) {
//     for (let j = 0; j < newGrid.length; j++) {
//       newGrid[i].push(rowsCollapsed.grid[i][j]);
//     }
//   }
//   return {
//     grid: newGrid,
//     score: rowsCollapsed.score,
//     highest: rowsCollapsed.highest,
//   };
// };

// const collapseRowsRight = (
//   grid: number[][],
//   score: number,
//   highest: number
// ): MoveOutput => {
//   const rows: number[][] = Array.from(
//     { length: grid.length },
//     () => new Array()
//   );
//   for (let i = 0; i < rows.length; i++) {
//     for (let j = rows.length - 1; j >= 0; j--) {
//       rows[i].push(grid[i][j]);
//     }
//   }
//   const rowsCollapsed = collapseRows(rows, score, highest);
//   const newGrid: number[][] = Array.from(
//     { length: grid.length },
//     () => new Array()
//   );
//   for (let i = 0; i < newGrid.length; i++) {
//     for (let j = newGrid.length - 1; j >= 0; j--) {
//       newGrid[i].push(rowsCollapsed.grid[i][j]);
//     }
//   }
//   return {
//     grid: newGrid,
//     score: rowsCollapsed.score,
//     highest: rowsCollapsed.highest,
//   };
// };

// type Coords = [number, number];

// const gameOver = "GAME_OVER";

// const findZeroes = (grid: number[][]) => {
//   const zeroCoords: Coords[] = [];
//   for (let i = 0; i < grid.length; i++) {
//     for (let j = 0; j < grid[i].length; j++) {
//       if (grid[i][j] === 0) {
//         zeroCoords.push([i, j]);
//       }
//     }
//   }
//   if (zeroCoords.length <= 0) {
//     return gameOver;
//   }
//   return zeroCoords[Math.floor(Math.random() * zeroCoords.length)];
// };

// const gridEq = (gridA: number[][], gridB: number[][]): boolean => {
//   let isEqual = true;
//   for (let i = 0; i < gridA.length; i++) {
//     for (let j = 0; j < gridA[i].length; j++) {
//       if (gridA[i][j] !== gridB[i][j]) {
//         isEqual = false;
//         break;
//       }
//     }
//   }
//   return isEqual;
// };

// type Color = {
//   backgroundColor: string;
//   color: string;
// };

// const randomColor = () => {
//   const red = Math.floor(Math.random() * 256);
//   const green = Math.floor(Math.random() * 256);
//   const blue = Math.floor(Math.random() * 256);
//   return {
//     backgroundColor: `rgb(${red},${green},${blue})`,
//     color: `rgb(${255 - red},${255 - green},${255 - blue})`,
//   };
// };

// export default function App() {
//   const n = 4;
//   const [gameStarted, setGameStarted] = useState(false);
//   const [gameIsOver, setGameIsOver] = useState(false);
//   const [score, setScore] = useState(0);
//   const [highest, setHighest] = useState(0);
//   const populateNewZeroes = (newGrid: number[][]) => {
//     const zeroes = findZeroes(newGrid);
//     if (zeroes !== gameOver) {
//       const random = Math.random();
//       newGrid[zeroes[0]][zeroes[1]] = random > 0.75 ? 4 : 2;
//     }
//     checkGameOver(newGrid);
//     return newGrid;
//   };

//   const [colors, setColors] = useState(
//     new Map<number, Color>().set(0, {
//       backgroundColor: "white",
//       color: "black",
//     })
//   );

//   const getColor = (tile: number) => {
//     const color = colors.get(tile);
//     if (!color) {
//       const randomC = randomColor();
//       setColors((c) => c.set(tile, randomC));
//       return randomC;
//     }
//     return color;
//   };

//   const checkGameOver = (newGrid: number[][]) => {
//     const zeroes = findZeroes(newGrid);
//     if (zeroes === gameOver) {
//       const gridUpFreeze = gridEq(
//         collapseRowsUp(newGrid, score, highest).grid,
//         newGrid
//       );
//       const gridDownFreeze = gridEq(
//         collapseRowsDown(newGrid, score, highest).grid,
//         newGrid
//       );
//       const gridLeftFreeze = gridEq(
//         collapseRowsLeft(newGrid, score, highest).grid,
//         newGrid
//       );
//       const gridRightFreeze = gridEq(
//         collapseRowsRight(newGrid, score, highest).grid,
//         newGrid
//       );
//       if (gridUpFreeze && gridDownFreeze && gridLeftFreeze && gridRightFreeze) {
//         setGameIsOver(true);
//       }
//     }
//   };

//   const [grid, setGrid] = useState(
//     populateNewZeroes(Array.from({ length: n }, () => new Array(n).fill(0)))
//   );

//   const updateState = (newGrid: MoveOutput) => {
//     if (!gridEq(newGrid.grid, grid)) {
//       const newGridWithRandom = populateNewZeroes(newGrid.grid);
//       setHighest(newGrid.highest);
//       setScore(newGrid.score);
//       setGrid(newGridWithRandom);
//     }
//   };

//   const onKeyDown = useCallback(
//     (e: KeyboardEvent) => {
//       if (!gameIsOver) {
//         if (e.key === "ArrowUp") {
//           const newGrid = collapseRowsUp(grid, score, highest);
//           updateState(newGrid);
//         }
//         if (e.key === "ArrowDown") {
//           const newGrid = collapseRowsDown(grid, score, highest);
//           updateState(newGrid);
//         }
//         if (e.key === "ArrowLeft") {
//           const newGrid = collapseRowsLeft(grid, score, highest);
//           updateState(newGrid);
//         }
//         if (e.key === "ArrowRight") {
//           const newGrid = collapseRowsRight(grid, score, highest);
//           updateState(newGrid);
//         }
//       }
//     },
//     [grid, score, highest]
//   );

//   useEffect(() => {
//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [grid, score, highest]);

//   return (
//     <div className="App">
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           rowGap: "1rem",
//           alignItems: "center",
//           width: "100%",
//         }}
//       >
//         {grid.map((row) => (
//           <div
//             style={{ display: "flex", flexDirection: "row", columnGap: "1rem" }}
//           >
//             {row.map((number) => (
//               <span
//                 style={{
//                   display: "flex",
//                   width: "3rem",
//                   height: "3rem",
//                   border: "0.125rem solid teal",
//                   borderRadius: "0.5rem",
//                   textAlign: "center",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   ...getColor(number),
//                 }}
//               >
//                 {number > 0 && number}
//               </span>
//             ))}
//           </div>
//         ))}
//       </div>
//       {gameIsOver && <div>GAME OVER</div>}
//       <div>Score: {score}</div>
//       <div>Highest: {highest}</div>
//     </div>
//   );
// }
