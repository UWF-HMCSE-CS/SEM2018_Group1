module.exports = function (options) {
    let dbcon = options.dbcon;
    let queries = require('./draftQueries.js')({ dbcon });

    function generateSnakeDraftOrder(teams, rounds) {
        let draftOrder = [];
        let pickNum = 1;
        for(let i = 1; i <= rounds; i++) {
            if(i%2 === 1) {
                for(let j = 0; j < teams.length; j++) {
                    draftOrder.push({ pickNum, team: teams[j] });
                    pickNum++;
                }
            }
            else {
                for(let j = teams.length-1; j >= 0; j--) {
                    draftOrder.push({ pickNum, team: teams[j] });
                    pickNum++;
                }
            }
        }
        return draftOrder;
    }
    return async function (req, res, next) {
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
                    const draftOrder = generateSnakeDraftOrder(teams, leagueSettings.players_per_team);
                    let myTeam = {};
                    myTeam.picks = draftOrder.filter(function(pick) {
                        return pick.team.username === req.user.username;
                    });
                    myTeam.teamName = myTeam.picks[0].team.teamName;
                    res.render('draft', { allPlayers, leagueSettings, teams, myTeam, draftOrder });
                }
            }
        }
    }
}