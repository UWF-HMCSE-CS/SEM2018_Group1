let draftData = {}; // Will store data for a league's draft under the leagueID { <leagueID> : data } 

module.exports = function (options) {
    let dbcon = options.dbcon;
    let queries = require('./draftQueries.js')({ dbcon });

    return {
        get: async function (req, res, next) {
            let user = {
                username: (req.user && req.user.username) ? req.user.username : null
            };
            res.locals.username = user.username; // same as passing username to res.render

            // If draft hasn't started, load all of the necessary data and start it
            if (!draftData[req.params.leagueID]) {
                const allPlayers = await queries.allPlayers();
                if (!allPlayers) return res.render('draft', { error: "allPlayers query returned null" });
                else if (allPlayers.error) return res.render('draft', { error: allPlayers.error });
                else {
                    const leagueSettings = await queries.leagueSettings(req.params.leagueID);
                    if (!leagueSettings) return res.render('draft', { error: "leagueSettings query returned null" });
                    else if (leagueSettings.error) return res.render('draft', { error: leagueSettings.error });
                    else {
                        const teams = await queries.teams(req.params.leagueID);
                        if (!teams) return res.render('draft', { error: "teams query returned null" });
                        else if (teams.error) return res.render('draft', { error: teams.error });
                        else {
                            // all data loaded from DB - generate order and save draft for when other users join
                            const allPicks = generateSnakeDraftOrder(teams, leagueSettings.players_per_team);
                            draftData[req.params.leagueID] = { allPlayers, leagueSettings, teams, allPicks };
                        }
                    }
                }
            }

            const draft = draftData[req.params.leagueID];

            // Once draft is loaded, get user-specific data and current pick
            let myTeam = usersTeam(user.username, draft);
            let currentPick = getCurrentPick(draft);
            if(!currentPick) {
                //draft is over. show user their team
                return res.redirect(303, '/myTeam/' + req.params.leagueID);
            }
            let myTurn = (user.username === currentPick.team.username);
            let availablePlayers = getAvailablePlayers(draft);
            res.render('draft', { draft, myTeam, currentPick, myTurn, availablePlayers });
        },

        post: async function (req, res, next) {
            if (draftData[req.params.leagueID] && req.body && req.body.draftedPlayer && req.body.currentPickNum) {
                let player = draftData[req.params.leagueID].allPlayers.find(function(aPlayer) {
                    return aPlayer.playerID == req.body.draftedPlayer;
                });

                // Save the pick to the draftData variable
                draftData[req.params.leagueID].allPicks[req.body.currentPickNum - 1].player = player;

                // If draft is over, save it to db
                if(draftData[req.params.leagueID].allPicks.length == req.body.currentPickNum) {
                    const saveDraft = await queries.saveDraft(draftData[req.params.leagueID]);
                    if (!saveDraft) return res.render('draft', { error: "saveDraft query returned null" });
                    else if (saveDraft.error) return res.render('draft', { error: saveDraft.error });
                }

                // Let all players know the pick is in
                let io = req.app.get('socketio');
                io.emit('pick', req.params.leagueID);
            }
            res.redirect(303, '/draft/' + req.params.leagueID);
        }
    }

    /* Helper functions */
    // Generate the draft order given the list of teams and the number of rounds.
    // allPicks will be an array of objects with pickNum, team, 
    // and player properties (players added when players are picked)
    function generateSnakeDraftOrder(teams, rounds) {
        let allPicks = [];
        let pickNum = 1;
        for (let i = 1; i <= rounds; i++) {
            if (i % 2 === 1) {
                for (let j = 0; j < teams.length; j++) {
                    allPicks.push({ pickNum, team: teams[j] });
                    pickNum++;
                }
            }
            else {
                for (let j = teams.length - 1; j >= 0; j--) {
                    allPicks.push({ pickNum, team: teams[j] });
                    pickNum++;
                }
            }
        }
        return allPicks;
    }

    // Return the picks specifically for the user
    function usersTeam(username, draft) {
        let myTeam = draft.teams.find(function (team) {
            return team.username === username;
        });
        myTeam.picks = draft.allPicks.filter(function (pick) {
            return pick.team.username === username;
        });
        return myTeam;
    }

    function getCurrentPick(draft) {
        for (let i = 0; i < draft.allPicks.length; i++) {
            if (!draft.allPicks[i].player) return draft.allPicks[i];
        }
    }

    function getAvailablePlayers(draft) {
        let allPlayers = draft.allPlayers;
        let allPicks = draft.allPicks;
        return allPlayers.filter(function(player) {
            if(allPicks.find(function(pick) {
                if(pick.player) return pick.player.playerID == player.playerID;
            })) return false;
            else return true;
        });
    }
}