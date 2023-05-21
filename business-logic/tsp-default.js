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
        this.targetFuncLowerBound = data.targetFuncLowerBound;
    }

}

class Row {
    constructor(position, cells) {
        this.position = position;
        this.cells = cells;
    }
}

const distancesExample = [
    [Infinity,  1, 2, 3, 4],
    [14, Infinity, 15, 16, 5],
    [13, 20, Infinity, 17, 6],
    [12, 19, 18, Infinity, 7],
    [11, 10, 9, 8, Infinity]
];

const route = [];

const tsp = (distances) => {

    // create matrix-object
    const matrix = getMatrixObject(distances);


    // matrix reduction
    const { matrix: reducedMatrix, H: matrixReductionConstant } = matrixReduction(matrix);
    // console.log(reducedMatrix.map(row => row.cells.map(cell => cell.value)), matrixReductionConstant);

    getTspPath(reducedMatrix, matrixReductionConstant)
}

const getTspPath = (matrix, matrixReductionConstant, path = [], hangingNodes = [], targetFuncLowestResult = Infinity) => {

    // TODO if zeroes in diagonal, it may be result
    //
    const zeroCellsSet = defineZeroCellsSet(matrix);
    const maxCharacteristicsSum = Math.max(...zeroCellsSet.map(cell => cell.sumOfMins));
    const maxCharacteristicsSumZeroCell = zeroCellsSet.find(cell => cell.sumOfMins === maxCharacteristicsSum);

    // next 2 steps must be in reverse order but then hard to find cell to prevent it from looping
    // preventFromLoopingForCell(matrix, maxCharacteristicsSumZeroCell.to, maxCharacteristicsSumZeroCell.from);
    const { matrix: matrixWithLowerRank, processedNode } = getLowerMatrixRank(matrix, maxCharacteristicsSumZeroCell.from, maxCharacteristicsSumZeroCell.to);
    preventFromLoopingForCell(matrixWithLowerRank, path, maxCharacteristicsSumZeroCell.to, maxCharacteristicsSumZeroCell.from);

    const { matrix: reducedLowerRankMatrix, H: lowerRankedMatrixReductionConstant } = matrixReduction(matrixWithLowerRank);

    const targetFunctionLowerBoundForPositiveNode = matrixReductionConstant + lowerRankedMatrixReductionConstant;
    const targetFunctionLowerBoundForNegativeNode = matrixReductionConstant + maxCharacteristicsSum;

    const includedNode = new PathNode({
        ...processedNode,
        included: true,
        targetFuncLowerBound: targetFunctionLowerBoundForPositiveNode
    });

    const excludedNode = new PathNode({
        ...processedNode,
        included: false,
        targetFuncLowerBound: targetFunctionLowerBoundForNegativeNode
    });

    let currentTargetFuncLowerBoundary;

    if (targetFunctionLowerBoundForPositiveNode <= targetFunctionLowerBoundForNegativeNode) {
        path.push(includedNode);
        hangingNodes.push(excludedNode);
        currentTargetFuncLowerBoundary = targetFunctionLowerBoundForPositiveNode;
    } else {
        path.push(excludedNode);
        hangingNodes.push(includedNode);
        currentTargetFuncLowerBoundary = targetFunctionLowerBoundForNegativeNode;
    }

    if (matrixWithLowerRank.length !== 2) {
        getTspPath(reducedLowerRankMatrix, currentTargetFuncLowerBoundary, path, hangingNodes, targetFuncLowestResult);
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
    const rowToDelete = matrix.find(row => row.position === rowToDeleteNum);
    const processedNode = rowToDelete.cells.find(cell => cell.column === columnToDeleteNum);
    matrix = matrix.filter(row => row.position !== rowToDelete.position);
    for (let row of matrix) {
        row.cells = row.cells.filter(cell => cell.column !== processedNode.column);
    }
    return {
        matrix,
        processedNode
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
    if (path.length) {
        for (const cell of path) {
            if (cell.row === row && cell.included) {
                const rowToPreventNum = cell.column;
                const columnToPreventNum = column;

                const rowToPrevent = matrix.find(currentRow => currentRow.position === rowToPreventNum);
                if (rowToPrevent) {
                    const cellToPrevent = rowToPrevent.cells.find(currentCell => currentCell.column === columnToPreventNum);
                    if (cellToPrevent) {
                        cellToPrevent.value = Infinity;
                    }
                }
            }
        }
    }

}

tsp(distancesExample);
