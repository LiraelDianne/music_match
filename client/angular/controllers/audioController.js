app.controller('audioController', ['$scope', '$location', function($scope, $location) {
    tones.attack = 10;
    tones.release = 150;
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
    console.log(sumNotes($scope.twinkle))

    var playOne = function(song, i) {
        if(i < song.length) {
            tones.play(song[i][0])
            var timer = setTimeout(playOne, song[i][1]*500, song, i+1)
        }
    }

    $scope.play = function(song) {
        playOne(song, 0)
    }
}])
