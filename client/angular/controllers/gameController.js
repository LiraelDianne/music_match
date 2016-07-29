app.controller('gameController', ['$scope', '$location', '$timeout', 'usersFactory', function($scope, $location, $timeout, usersFactory) {

    //login check
    usersFactory.success(function(user) {
        if(user) {
            console.log(user._id)
            $scope.user = user
        } else {
            $location.url('/login')
        }
    })

    //settings to play audio
    tones.attack = 10;
    tones.release = 100;
    tones.type = "sine";

    $scope.twinkle = [["C", 1], ["C", 1], ["G", 1], ["G", 1], ["A", 1], ["A", 1], ["G", 2],
                   ["F", 1], ["F", 1], ["E", 1], ["E", 1], ["D", 1], ["D", 1], ["C", 2],
                   ["G", 1], ["G", 1], ["F", 1], ["F", 1], ["E", 1], ["E", 1], ["D", 2],
                   ["G", 1], ["G", 1], ["F", 1], ["F", 1], ["E", 1], ["E", 1], ["D", 2],
                   ["C", 1], ["C", 1], ["G", 1], ["G", 1], ["A", 1], ["A", 1], ["G", 2],
                   ["F", 1], ["F", 1], ["E", 1], ["E", 1], ["D", 1], ["D", 1], ["C", 2]]

    var sumNotes = function(song) {
        var totals = {
            C: 0,
            D: 0,
            E: 0,
            F: 0,
            G: 0,
            A: 0,
            B: 0
        }
        for(var i=0; i<song.length; i++) {
            totals[song[i][0]]++
        }
        return totals
    }

    $scope.goal = sumNotes($scope.twinkle)

    var playing = false

    var playOne = function(song, i) {
        if(i < song.length) {
            tones.play(song[i][0])
            var timer = setTimeout(playOne, song[i][1]*500, song, i+1)
        } else {
            playing = false
        }
    }

    $scope.play = function(song) {
        if(playing) {
            console.log('waiting')
            var wait = setTimeout($scope.play, 200, song)
        } else {
            playOne(song, 0)
            playing = true
        }
    }

    var arpeggio = function(matches, i) {
        if(i<matches.length) {
            var note = matches[i].note
            tones.play(note)
            var timer = setTimeout(arpeggio, 100, matches, i+1)
        } else {
            playing = false
        }
    }

    var playCheck = function(matches, i) {
        if(playing) {
            var delay = setTimeout(playCheck, 120, matches, i)
        } else {
            playing = true
            var timer = setTimeout(arpeggio, 100, matches, i)
        }
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

    var win = function() {
        if(playing) {
            wait = setTimeout(win, 300)
        } else {
            alert("You unlocked a song!")
            $scope.play($scope.twinkle)
            $scope.new()
        }
    }

    var checkScore = function() {
        var play = true
        needed = sumNotes($scope.twinkle)
        for (key in $scope.score) {
            if (needed[key] > $scope.score[key]) {
                play = false
            }
        }
        if(play) {
            win()
        }
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
                    empty: false,
                    falling: false
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

    var slide = function(row, col) {
        for(var falling=row; falling>0; falling--) {
            board[falling][col].falling = false
            board[falling][col] = board[falling-1][col]
        }
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
                        swap: false,
                        selected: false,
                        empty: false
                    }
                    board[0][col] = newsquare
                }
            }
        }
    }

    var swap = function(row, col) {
        //swap the two elements
        var swapnote = board[selected.row][selected.col].note
        board[selected.row][selected.col].note = board[row][col].note
        board[row][col].note = swapnote

        //turn off swap
        board[row][col].swap = false
        board[selected.row][selected.col].swap = false

        // check each for matches
        var matches = checkmatch(row, col).concat(checkmatch(selected.row, selected.col))
        if(!matches[0]) {
            //swap back if there are no matches
            swapnote = board[selected.row][selected.col].note
            board[selected.row][selected.col].note = board[row][col].note
            board[row][col].note = swapnote
        } else if(tutorial) {
            alert('Good job! You made a match!')
            alert('Your match is going to disappear, and new blocks will slide down to fill the space.')
            var delay = setTimeout(alert, 1000, 'Watch your score go up on the right until you meet the goal.')
            tutorial = false
        }
        //unselect squares
        board[row][col].selected = false
        selected.selected = false
        while(matches[0]) {
            playCheck(matches, 0)
            // replace with new random notes
            replace(matches)
            // check for any new matches
            matches = checkAllMatches()
        }
        checkScore()
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
                    board[selected.row][selected.col].selected = false
                    board[row][col].swap = true
                    board[selected.row][selected.col].swap = true
                    $timeout(swap, 100, true, row, col)

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

    var tutorial = false
    $scope.startTutorial = function() {
        alert("Try clicking two squares next to each other (sharing a side) to swap them and make a matching row of three.")
        tutorial = true
    }

}])
