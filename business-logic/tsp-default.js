const lodash = require('lodash');

class Cell {
    constructor(row, column, value) {
        this.row = row;
        this.column = column;
        this.value = value;
    }
}

class PathNode extends Cell {
    constructor(data) {
        super(data.row, data.column, data.value);
        this.included = data.included;
        // this.targetFuncLowerBound = data.targetFuncLowerBound;
    }
}

class HangingNode {
    constructor(data) {
        this.path = data.path;
        this.targetFuncLowerBound = data.targetFuncLowerBound;
        this.matrixSnapshot = data.matrixSnapshot;
    }
}

class Row {
    constructor(position, cells) {
        this.position = position;
        this.cells = cells;
    }
}

// const distancesExample = [
//     [Infinity, 1, 2, 3, 4],
//     [14, Infinity, 15, 16, 5],
//     [13, 20, Infinity, 17, 6],
//     [12, 19, 18, Infinity, 7],
//     [11, 10, 9, 8, Infinity]
// ];
const distancesExample = [
    [Infinity, 10, 25, 25, 10],
    [1, Infinity, 10, 15, 2],
    [8, 9, Infinity, 20, 10],
    [14, 10, 24, Infinity, 15],
    [10, 8, 25, 27, Infinity]
];

// const distancesExample = [
//     [Infinity, 10, 15, 20],
//     [10, Infinity, 35, 25],
//     [15, 35, Infinity, 30],
//     [20, 25, 30, Infinity]
// ];

const route = [];

const tsp = (distances) => {

    // create matrix-object
    const matrix = getMatrixObject(distances);

    // matrix reduction
    const {matrix: reducedMatrix, H: matrixReductionConstant} = matrixReduction(matrix);
    // console.log(reducedMatrix.map(row => row.cells.map(cell => cell.value)), matrixReductionConstant);

    getTspPath(reducedMatrix, matrixReductionConstant)
}

const getTspPath = (matrix, matrixReductionConstant) => {

    let hangingNodes = [];
    let lowestFullPathFunctionResult = Infinity;

    let currentPath = [];
    let currentTargetFuncLowerBoundary = matrixReductionConstant;

    while (true) {

        // TODO if zeroes in diagonal, it may be result
        //
        const zeroCellsSet = defineZeroCellsSet(matrix);
        const maxCharacteristicsSum = Math.max(...zeroCellsSet.map(cell => cell.sumOfMins));
        const maxCharacteristicsSumZeroCell = zeroCellsSet.find(cell => cell.sumOfMins === maxCharacteristicsSum);

        const {
            matrix: matrixWithLowerRank,
            processedCell
        } = getLowerMatrixRank(matrix, maxCharacteristicsSumZeroCell.from, maxCharacteristicsSumZeroCell.to);
        preventFromLoopingForCell(matrixWithLowerRank, currentPath, maxCharacteristicsSumZeroCell.to, maxCharacteristicsSumZeroCell.from);

        const {
            matrix: reducedLowerRankMatrix,
            H: lowerRankedMatrixReductionConstant
        } = matrixReduction(matrixWithLowerRank);

        const targetFunctionLowerBoundForPositiveNode = currentTargetFuncLowerBoundary + lowerRankedMatrixReductionConstant;
        const targetFunctionLowerBoundForNegativeNode = currentTargetFuncLowerBoundary + maxCharacteristicsSum;

        // included node is when path would contain [2;5], excluded is when path would not contain [2;5]
        // not the best naming
        const includedNode = new PathNode({
            ...processedCell,
            included: true,
            targetFuncLowerBound: targetFunctionLowerBoundForPositiveNode
        });

        const excludedNode = new PathNode({
            ...processedCell,
            included: false,
            targetFuncLowerBound: targetFunctionLowerBoundForNegativeNode
        });

        if (targetFunctionLowerBoundForPositiveNode <= targetFunctionLowerBoundForNegativeNode) {
            hangingNodes.push(createHangingNodeForExcludedNode(excludedNode, matrix, currentPath, targetFunctionLowerBoundForNegativeNode));
            currentPath.push(includedNode);
            currentTargetFuncLowerBoundary = targetFunctionLowerBoundForPositiveNode;
            matrix = reducedLowerRankMatrix;
            preventFromLoopingForCell(matrix, currentPath, includedNode.row, includedNode.column);
        } else {
            currentPath.push(excludedNode);
            hangingNodes.push(createHangingNodeForIncludedNode(includedNode, reducedLowerRankMatrix, currentPath, targetFunctionLowerBoundForPositiveNode));
            currentTargetFuncLowerBoundary = targetFunctionLowerBoundForNegativeNode;
            preventFromLoopingForCell(matrix, currentPath, excludedNode.row, excludedNode.column);
        }

        if (matrixWithLowerRank.length === 2) {
            if (lowestFullPathFunctionResult === Infinity || lowestFullPathFunctionResult > currentTargetFuncLowerBoundary) {
                lowestFullPathFunctionResult = currentTargetFuncLowerBoundary;
            }
            completeMatrixAndPath(matrixWithLowerRank, currentPath);

            if (hangingNodes.length) {
                const hangingNodeWithLowestBound = getHangingNodeWithLowestBound(hangingNodes);
                if (hangingNodeWithLowestBound.targetFuncLowerBound < currentTargetFuncLowerBoundary) {
                    hangingNodes = hangingNodes.filter(node => node !== hangingNodeWithLowestBound);
                    hangingNodes.push(new HangingNode({
                        path: lodash.cloneDeep(currentPath),
                        targetFuncLowerBound: currentTargetFuncLowerBoundary,
                        matrixSnapshot: lodash.cloneDeep(matrixWithLowerRank),
                    }))
                    matrix = lodash.cloneDeep(hangingNodeWithLowestBound.matrixSnapshot);
                    currentPath = lodash.cloneDeep(hangingNodeWithLowestBound.path);
                    currentTargetFuncLowerBoundary = hangingNodeWithLowestBound.targetFuncLowerBound;

                    // matrix reduction from starting point
                    const {matrix: reducedMatrix, H: matrixReductionConstant} = matrixReduction(matrix);
                    matrix = reducedMatrix;

                } else {
                    // todo return
                }
            }
        } else if (currentTargetFuncLowerBoundary > lowestFullPathFunctionResult) {
            const hangingNodeWithLowestBound = getHangingNodeWithLowestBound(hangingNodes);
            if (hangingNodeWithLowestBound.matrixSnapshot.length === 2) {
                console.log('finish', hangingNodeWithLowestBound, lowestFullPathFunctionResult);
                return;
            } else {
                matrix = hangingNodeWithLowestBound.matrixSnapshot;
                currentPath = hangingNodeWithLowestBound.path;
                currentTargetFuncLowerBoundary = hangingNodeWithLowestBound.targetFuncLowerBound;
            }
        }
    }
}

const getMatrixObject = (distances) => {
    const matrix = [];
    for (let i = 0; i < distances.length; i++) {
        matrix[i] = new Row(i, []);
        for (let j = 0; j < distances.length; j++) {
            matrix[i].cells.push(new Cell(i, j, distances[i][j]));
        }
    }
    return matrix;
}

const matrixReduction = (matrix) => {
    const matrixSize = matrix.length;

    const hMinForRows = [];
    const hMinForColumns = [];

    for (let row = 0; row < matrixSize; row++) {
        const minElementInLine = Math.min(...matrix[row].cells.map(cell => cell.value));
        hMinForRows[row] = minElementInLine;
        const temp = matrix[row].cells.map(cell => {
            const newValue = cell.value - minElementInLine;
            const newCell = new Cell(cell.row, cell.column, newValue);
            return newCell;
        });
        matrix[row].cells = temp;
    }

    const reducedMatrix = [];
    for (let i = 0; i < matrixSize; i++) {
        reducedMatrix[i] = [];
    }

    for (let column = 0; column < matrixSize; column++) {
        const currentColumn = matrix.map(row => row.cells[column]);
        const minElementInColumn = Math.min(...currentColumn.map(cell => cell.value));
        hMinForColumns[column] = minElementInColumn;
        for (let row = 0; row < matrixSize; row++) {
            const currentCell = matrix[row].cells[column];
            matrix[row].cells[column] = new Cell(currentCell.row, currentCell.column, currentCell.value - minElementInColumn);
        }
    }

    const H = hMinForRows.reduce((partialSum, current) => partialSum + current, 0) + hMinForColumns.reduce((partialSum, current) => partialSum + current, 0);

    return {
        matrix,
        H
    };
}

const defineZeroCellsSet = (matrix) => {
    const zeroCellsSet = [];
    for (let row = 0; row < matrix.length; row++) {
        for (let column = 0; column < matrix.length; column++) {
            if (matrix[row].cells[column].value === 0) {
                const minInRowExceptCurrent = Math.min(...matrix[row].cells.filter((cell, index) => index !== column).map(cell => cell.value));
                const currentColumnValues = matrix.map(currentRow => currentRow.cells[column]).map(cell => cell.value);
                const minInColumnExceptCurrent = Math.min(...currentColumnValues.filter((val, index) => index !== row));

                zeroCellsSet.push({
                    from: matrix[row].position,
                    to: matrix[row].cells[column].column,
                    minInRow: minInRowExceptCurrent,
                    minInColumn: minInColumnExceptCurrent,
                    sumOfMins: minInRowExceptCurrent + minInColumnExceptCurrent
                });
            }
        }
    }

    return zeroCellsSet;
}

const getLowerMatrixRank = (matrix, rowToDeleteNum, columnToDeleteNum) => {
    matrix = lodash.cloneDeep(matrix);
    const rowToDelete = matrix.find(row => row.position === rowToDeleteNum);
    const processedNode = rowToDelete.cells.find(cell => cell.column === columnToDeleteNum);
    matrix = matrix.filter(row => row.position !== rowToDelete.position);
    for (let row of matrix) {
        row.cells = row.cells.filter(cell => cell.column !== processedNode.column);
    }
    return {
        matrix,
        processedCell: processedNode
    };
}

const preventFromLoopingForCell = (matrix, path, row, column) => {
    // prevent reversed cell ([5;1] -> [1;5] must be Infinity)
    const rowToPrevent = matrix.find(currentRow => currentRow.position === row);
    if (rowToPrevent) {
        const cellToPrevent = rowToPrevent.cells.find(currentCell => currentCell.column === column);
        if (cellToPrevent) {
            cellToPrevent.value = Infinity;
        }
    }

    // if we have path, we must prevent all nodes, into which we can get from processed cell <from>
    // because it would be cycled
    if (path.length && matrix.length !== 1) {
        const allMatrixCells = matrix.reduce((acc, row) => acc.concat(row.cells), []);
        const allStartPointsFromCurrentPath = path.filter(node => node.included).map(node => node.row);
        const allCellsToPrevent = allMatrixCells.filter(cell => cell.row === column && allStartPointsFromCurrentPath.includes(cell.column));

        allCellsToPrevent.forEach(cell => cell.value = Infinity);
        // for (const cell of path) {
        //     if (cell.row === row && cell.included) {
        //         const rowToPreventNum = cell.column;
        //         const columnToPreventNum = column;
        //
        //         const rowToPrevent = matrix.find(currentRow => currentRow.position === rowToPreventNum);
        //         if (rowToPrevent) {
        //             const cellToPrevent = rowToPrevent.cells.find(currentCell => currentCell.column === columnToPreventNum);
        //             if (cellToPrevent) {
        //                 cellToPrevent.value = Infinity;
        //             }
        //         }
        //     }
        // }
    }
}

const createHangingNodeForExcludedNode = (excludedNode, matrixSnapshot, currentPath, targetFunctionLowerBoundForNegativeNode) => {
    const pathForThisNode = lodash.cloneDeep(currentPath);
    pathForThisNode.push(lodash.cloneDeep(excludedNode));
    const matrixForThisNode = lodash.cloneDeep(matrixSnapshot);
    preventFromLoopingForCell(matrixForThisNode, pathForThisNode, excludedNode.row, excludedNode.column);
    return new HangingNode({
        path: pathForThisNode,
        targetFuncLowerBound: targetFunctionLowerBoundForNegativeNode,
        matrixSnapshot: matrixForThisNode,
    })
}

const createHangingNodeForIncludedNode = (includedNode, matrixWithLowerRankSnapshot, currentPath, targetFunctionLowerBoundForPositiveNode) => {
    const pathForThisNode = lodash.cloneDeep(currentPath);
    pathForThisNode.pop();
    pathForThisNode.push(lodash.cloneDeep(includedNode));
    return new HangingNode({
        path: pathForThisNode,
        targetFuncLowerBound: targetFunctionLowerBoundForPositiveNode,
        matrixSnapshot: lodash.cloneDeep(matrixWithLowerRankSnapshot),
    });
}

const getHangingNodeWithLowestBound = (hangingNodes) => {
    const lowestBoundValue = Math.min(...hangingNodes.map(node => node.targetFuncLowerBound));
    const nodeWithLowestBound = hangingNodes.find(node => node.targetFuncLowerBound === lowestBoundValue);
    return nodeWithLowestBound;
}

const completeMatrixAndPath = (matrix, path) => {
    const allMatrixCells = matrix.reduce((acc, row) => row.cells, []);

    allMatrixCells.forEach(cell => {
        if (!createsLoop(cell, path)) {
            path.push(new PathNode({
                row: cell.row,
                column: cell.column,
                value: cell.value,
                included: true,
            }));
            preventFromLoopingForCell(matrix, path, cell.column, cell.row);
            const lastCell = matrix.find(row => row.position !== cell.row).cells.find(curCell => curCell.column !== cell.column);
            path.push(new PathNode({
                row: lastCell.row,
                column: lastCell.column,
                included: true,
                value: lastCell.value
            }))
        }
    })

    // const cellWithInfinityValue = matrix.map(row => row.cells)
    //     .reduce((array, row) => {
    //         array.push(...row);
    //         console.log(array);
    //         return array;
    //     }, [])
    //     .find(cell => cell.value === Infinity);
    // const guaranteedCell = matrix.find(row => row.position === cellWithInfinityValue.row).cells.find(cell => cell.column !== cellWithInfinityValue.column);
    // path.push(new PathNode({
    //     row: guaranteedCell.row,
    //     column: guaranteedCell.column,
    //     value: guaranteedCell.value,
    //     included: true,
    // }));
}

const createsLoop = (cell, currentPath) => {
    const allStartPointsFromCurrentPath = currentPath.map(node => node.row);
    return allStartPointsFromCurrentPath.includes(cell.column);
}

tsp(distancesExample);
