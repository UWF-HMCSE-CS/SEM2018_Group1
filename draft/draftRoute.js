let draftData = {}; // Will store data for a league's draft under the leagueID { <leagueID> : data } 

module.exports = function (options) {
    let dbcon = options.dbcon;
    let queries = require('./draftQueries.js')({ dbcon });

    // Generate the draft order given the list of teams and the number of rounds.
    // Draft order will be an array of objects with pickNum, team, and player properties
    function generateSnakeDraftOrder(teams, rounds) {
        let draftOrder = [];
        let pickNum = 1;
        for (let i = 1; i <= rounds; i++) {
            if (i % 2 === 1) {
                for (let j = 0; j < teams.length; j++) {
                    draftOrder.push({ pickNum, team: teams[j] });
                    pickNum++;
                }
            }
            else {
                for (let j = teams.length - 1; j >= 0; j--) {
                    draftOrder.push({ pickNum, team: teams[j] });
                    pickNum++;
                }
            }
        }
        return draftOrder;
    }

    // Return the picks specifically for the user
    function usersTeam(username, draftOrder) {
        let myTeam = {};
        myTeam.picks = draftOrder.filter(function (pick) {
            return pick.team.username === username;
        });
        myTeam.teamName = myTeam.picks[0].team.teamName;
        return myTeam;
    }

    return async function (req, res, next) {
        let user = {
            username: (req.user && req.user.username) ? req.user.username : null
        };
        res.locals.username = user.username; // same as passing username to res.render

        // If the draft is already in progress, load the data 
        if (draftData[req.params.leagueID]) {
            let myTeam = usersTeam(user.username, draftData[req.params.leagueID].draftOrder);
            return res.render('draft', { draft: draftData[req.params.leagueID], myTeam });
        }

        // If draft hasn't started, load all of the necessary data and start it
        const allPlayers = await queries.allPlayers();
        if (!allPlayers) res.render('draft', { error: "allPlayers query returned null" });
        else if (allPlayers.error) res.render('draft', { error: allPlayers.error });
        else {
            const leagueSettings = await queries.leagueSettings(req.params.leagueID);
            if (!leagueSettings) res.render('draft', { error: "leagueSettings query returned null" });
            else if (leagueSettings.error) res.render('draft', { error: leagueSettings.error });
            else {
                const teams = await queries.teams(req.params.leagueID);
                if (!teams) res.render('draft', { error: "teams query returned null" });
                else if (teams.error) res.render('draft', { error: teams.error });
                else {
                    // all data loaded from DB - generate order, load user's team, and save draft for when other users join
                    const draftOrder = generateSnakeDraftOrder(teams, leagueSettings.players_per_team);

                    let myTeam = usersTeam(user.username, draftOrder);

                    draftData[req.params.leagueID] = { allPlayers, leagueSettings, teams, draftOrder };

                    res.render('draft', { draft: draftData[req.params.leagueID], myTeam });
                }
            }
        }
    }
}