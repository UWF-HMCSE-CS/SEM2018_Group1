$(function () {
    var socket = io();

    // When a player has been picked, reload the page
    socket.on('pick', function (leagueID) {
        if(leagueID == $('#leagueID').val()) { // Make sure pick is in user's league
            location.reload(true);
        }
    });
});