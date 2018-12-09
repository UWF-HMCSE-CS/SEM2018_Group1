let draftData = {}; // Will store data for a league's draft under the leagueID { <leagueID> : data } 

module.exports = function (options) {
    let dbcon = options.dbcon;
    let queries = require('./draftQueries.js')({ dbcon });
    let helpers = require('./draftHelpers.js');

    return {
        get: async function (req, res, next) {
            let user = {
                username: (req.user && req.user.username) ? req.user.username : null
            };
            res.locals.username = user.username; // same as passing username to res.render
            res.locals.league = { id : req.params.leagueID };

            // If draft hasn't started, load all of the necessary data and start it
            if (!draftData[req.params.leagueID]) {
                const draftResults = await queries.draftResults(req.params.leagueID);
                if (draftResults !== 0) { // If the league has already drafted
                    if (!draftResults) return res.render('draft', { error: "draftResults query returned null" });
                    else if (draftResults.error) return res.render('draft', { error: draftResults.error });

                    return res.render('draftResults', { draftResults });
                }

                const leagueSettings = await queries.leagueSettings(req.params.leagueID);
                if (!leagueSettings) return res.render('draft', { error: "leagueSettings query returned null" });
                else if (leagueSettings.error) return res.render('draft', { error: leagueSettings.error });
                else if (leagueSettings.ownerID != user.username) {
                    return res.render('draft', {
                        error: 'The draft has not yet started. Only the league owner, ' + leagueSettings.ownerID + ', can begin the draft.'
                    });
                }

                const allPlayers = await queries.allPlayers();
                if (!allPlayers) return res.render('draft', { error: "allPlayers query returned null" });
                else if (allPlayers.error) return res.render('draft', { error: allPlayers.error });

                const teams = await queries.teams(req.params.leagueID);
                if (!teams) return res.render('draft', { error: "teams query returned null" });
                else if (teams.error) return res.render('draft', { error: teams.error });

                // all data loaded from DB - generate order and save draft for when other users join
                helpers.shuffle(teams);
                const allPicks = helpers.generateSnakeDraftOrder(teams, leagueSettings.players_per_team);
                draftData[req.params.leagueID] = { allPlayers, leagueSettings, teams, allPicks };
            }

            const draft = draftData[req.params.leagueID];

            // Once draft is loaded, get user-specific data and current pick
            let myTeam = helpers.usersTeam(user.username, draft);
            let currentPick = helpers.getCurrentPick(draft);
            let myTurn = (user.username === currentPick.team.username);
            let availablePlayers = helpers.getAvailablePlayers(draft);
            res.render('draft', { draft, myTeam, currentPick, myTurn, availablePlayers });
        },

        post: async function (req, res, next) { // When a pick is made
            if (draftData[req.params.leagueID] && req.body && req.body.draftedPlayer && req.body.currentPickNum) {
                let player = draftData[req.params.leagueID].allPlayers.find(function(aPlayer) {
                    return aPlayer.playerID == req.body.draftedPlayer;
                });

                // Save the pick to the draftData variable
                draftData[req.params.leagueID].allPicks[req.body.currentPickNum - 1].player = player;

                // If draft is over, save it to db and set server variable to null
                if(draftData[req.params.leagueID].allPicks.length == req.body.currentPickNum) {
                    const saveDraft = await queries.saveDraft(draftData[req.params.leagueID]);
                    if (!saveDraft) return res.render('draft', { error: "saveDraft query returned null" });
                    else if (saveDraft.error) return res.render('draft', { error: saveDraft.error });
                    draftData[req.params.leagueID] = null;
                }

                // Let all players know the pick is in
                let io = req.app.get('socketio');
                io.emit('pick', req.params.leagueID);
            }
            res.redirect(303, '/draft/' + req.params.leagueID);
        }
    }
}