$(function () {
    var socket = io();

    // When a player has been picked, reload the page
    socket.on('pick', function () {
        location.reload(true);
    });
});