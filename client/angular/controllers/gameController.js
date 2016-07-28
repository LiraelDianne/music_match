app.controller('gameController', ['$scope', '$location', function($scope, $location) {

    //settings to play audio
    tones.attack = 10;
    tones.release = 100;
    tones.type = "sine";

    var play = function(matches, i) {
        if(i<matches.length) {
            var note = matches[i].note
            tones.play(note)
            arpeggio(matches, i+1)
        }
    }

    var arpeggio = function(matches, i) {
        var timer = setTimeout(play, 100, matches, i)
    }

    var notes = {
        1: "C",
        2: "D",
        3: "E",
        4: "F",
        5: "G",
        6: "A",
        7: "B"
    }
    $scope.notes = notes
    $scope.score = {
        C: 0,
        D: 0,
        E: 0,
        F: 0,
        G: 0,
        A: 0,
        B: 0
    }
    var board = []
    var selected = {
        row: -1,
        col: -1,
        selected: false
    }

    var print = function() {
        $scope.board = board
    }

    //generate a 12 by 12 grid
    var newboard = function() {
        board = []
        for(var row=0; row<10; row++) {
            var newrow = []
            for(var col=0; col<10; col++) {
                var note = notes[Math.floor(Math.random()*7+1)]
                //check if this one creates a triplet
                if (newrow[1]) {
                    if(board[1]) {
                        while (board[row-1][col].note == note && board[row-2][col].note == note || newrow[col-1].note == note && newrow[col-2].note == note) {
                            // reassign the note
                            note = notes[Math.floor(Math.random()*7+1)]
                        }
                    } else {
                        while(newrow[col-1].note == note && newrow[col-2].note == note) {
                            // reassign the note
                            note = notes[Math.floor(Math.random()*7+1)]
                        }
                    }
                } else if (board[1]) {
                    while (board[row-1][col].note == note && board[row-2][col].note == note) {
                        // reassign the note
                        note = notes[Math.floor(Math.random()*7+1)]
                    }
                }
                newsquare = {
                    note: note,
                    selected: false,
                    empty: false
                }
                newrow.push(newsquare)
            }
            board.push(newrow)
        }
        print()
    }
    newboard()

    var checkmatch = function(row, col) {
        var note = board[row][col].note
        var start = {row: row, col: col, note: note}
        var verticalset = []
        var horizontalset = []
        var finalset = []
        var step = 1
        // check up and down for matches
        while (board[row+step] && board[row+step][col].note == note) {
            verticalset.push({row: row+step, col: col, note: board[row+step][col].note})
            step++
        }
        step = 1
        while (board[row-step] && board[row-step][col].note == note) {
            verticalset.push({row: row-step, col: col, note: board[row-step][col].note})
            step++
        }
        step = 1
        //check left and right
        while (board[row][col+step] && board[row][col+step].note == note) {
            horizontalset.push({row: row, col: col+step, note: board[row][col+step].note})
            step++
        }
        step = 1
        while (board[row][col-step] && board[row][col-step].note == note) {
            horizontalset.push({row: row, col: col-step, note: board[row][col-step].note})
            step++
        }
        // if you have three in a row, save
        if (horizontalset.length >= 2) {
            finalset = horizontalset
            finalset.push(start)
            if(verticalset.length >= 2) {
                finalset = finalset.concat(verticalset)
            }
        } else if (verticalset.length >= 2){
            finalset = verticalset
            finalset.push(start)
        }
        return finalset
    }

    var checkAllMatches = function() {
        var matches = []
        for(var row = 0; row < board.length; row++) {
            for(var col = 0; col < board[0].length; col++) {
                matches = matches.concat(checkmatch(row, col))
            }
        }
        return matches
    }

    var replace = function(matches) {
        var left = 9
        var top = 9
        var right = 0
        var bottom = 0
        for(var i=0; i<matches.length; i++) {
            $scope.score[matches[i].note]++
            board[matches[i].row][matches[i].col].empty = true
            if(left > matches[i].col) {
                left = matches[i].col
            }
            if(top > matches[i].row) {
                top = matches[i].row
            }
            if(right < matches[i].col) {
                right = matches[i].col
            }
            if(bottom < matches[i].row) {
                bottom = matches[i].row
            }
        }
        for(var row=bottom; row>=top; row--) {
            for(var col = left; col<=right; col++) {
                if(board[row][col].empty) {
                    for(var falling=row; falling>0; falling--) {
                        board[falling][col] = board[falling-1][col]
                    }
                    newsquare = {
                        note: notes[Math.floor(Math.random()*7+1)],
                        selected: false,
                        empty: false
                    }
                    board[0][col] = newsquare
                }
            }
        }
    }

    $scope.select = function(row, col) {
        if(selected.selected) {
            // if selecting the same, unselect
            if(board[row][col].selected == true) {
                selected.selected = false
                board[row][col].selected = false
            } else {
                // if adjacent
                if(Math.abs(row-selected.row)==1 && col === selected.col || Math.abs(col-selected.col)==1 && row === selected.row) {
                    //swap the two elements
                    swapnote = board[selected.row][selected.col].note
                    board[selected.row][selected.col].note = board[row][col].note
                    board[row][col].note = swapnote
                    // check each for matches
                    var matches = checkmatch(row, col).concat(checkmatch(selected.row, selected.col))
                    if(!matches[0]) {
                        //swap back if there are no matches
                        swapnote = board[selected.row][selected.col].note
                        board[selected.row][selected.col].note = board[row][col].note
                        board[row][col].note = swapnote
                    }
                    //unselect squares
                    board[selected.row][selected.col].selected = false
                    board[row][col].selected = false
                    selected.selected = false
                    while(matches[0]) {
                        arpeggio(matches, 0)
                        // replace with new random notes
                        replace(matches)
                        // check for any new matches
                        matches = checkAllMatches()
                    }
                } else {
                    //if not adjacent, unselect and select new
                    board[selected.row][selected.col].selected = false
                    selected.row = row
                    selected.col = col
                    board[row][col].selected = true
                    tones.play(board[row][col].note)
                }
            }
        } else {
            // if no selected, save select info and play tone
            selected.selected = true
            selected.row = row
            selected.col = col
            board[row][col].selected = true
            tones.play(board[row][col].note)
        }
    }
    $scope.new = function() {
        $scope.score = {
            C: 0,
            D: 0,
            E: 0,
            F: 0,
            G: 0,
            A: 0,
            B: 0
        }
        newboard()
    }

}])
