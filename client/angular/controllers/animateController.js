app.controller('animateController', ['$scope', '$timeout', function($scope, $timeout) {
    var board = []
    for(var col=0; col<5; col++) {
        board.push({note: "D", selected: false, swap: false, empty: false})
    }
    $scope.testboard = board

    var selected = {
        col: -1,
        selected: false
    }

    var swap = function(col) {
        console.log('swap running')
        //swap the two elements
        //var swapnote = board[selected.col].note
        //board[selected.col].note = board[col].note
        //board[col].note = swapnote
        console.log(col)
        board[selected.col].note = "A"
        board[col].note = "A"
        //turn off swap
        board[selected.col].swap = false
        board[col].swap = false
        //unselect squares
        board[col].selected = false
        selected.selected = false
    }

    $scope.select = function(col) {
        if(selected.selected) {
            // if selecting the same, unselect
            if(board[col].selected == true) {
                selected.selected = false
                board[col].selected = false
            } else {
                // if adjacent
                if(Math.abs(col-selected.col)==1) {
                    board[selected.col].selected = false
                    //turn on swap animation
                    board[selected.col].swap = true
                    board[col].swap = true

                    $timeout(swap, 200, true, col)

                } else {
                    //if not adjacent, unselect and select new
                    board[selected.col].selected = false
                    selected.col = col
                    board[col].selected = true
                }
            }
        } else {
            // if no selected, save select info and play tone
            selected.selected = true
            selected.col = col
            board[col].selected = true
        }
    }
}])
