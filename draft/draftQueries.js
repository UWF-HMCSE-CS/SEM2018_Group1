module.exports = function (options) {
    let dbcon = options.dbcon;

    // helper function to make queries return promises
    function query(sql, args) {
        return new Promise((resolve, reject) => {
            dbcon.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    return {
        allPlayers: async function () {
            return await query('SELECT * FROM player ORDER BY playername').then(function (rows, cols) {
                if (!rows) return null;

                let allPlayers = [];
                for (let i = 0; i < rows.length; i++) {
                    allPlayers.push(rows[i]);
                }
                return allPlayers;
            }).catch(function (err) {
                return { error: err.message }
            });
        },

        leagueSettings: async function (leagueID) {
            return await query('SELECT * FROM league WHERE leagueID = ?', [leagueID]).then(function (rows, cols) {
                if (!rows) return null;

                const league = rows[0];
                return league;
            }).catch(function (err) {
                return { error: err.message }
            });
        },

        teams: async function (leagueID) {
            return await query('SELECT * FROM team WHERE leagueID = ?', [leagueID]).then(function (rows, cols) {
                if (!rows) return null;

                let teams = [];
                for (let i = 0; i < rows.length; i++) {
                    teams.push(rows[i]);
                }
                return teams;
            }).catch(function (err) {
                return { error: err.message }
            });
        },

        saveDraft: async function (draft) {
            // Make sure there are no players on any teams in the league before applying draft results
            let deleteStatement = 'DELETE FROM player_team WHERE teamID IN (SELECT teamID FROM team WHERE leagueID = ?)';
            let leagueID = draft.leagueSettings.leagueID;

            let insertStatement = 'INSERT INTO player_team (teamID, playerID) VALUES ';
            for(let i = 0; i < draft.allPicks.length; i++) {
                let teamID = draft.allPicks[i].team.teamID;
                let playerID = draft.allPicks[i].player.playerID;
                // Add values for each draft pick
                insertStatement += '(' + teamID + ', ' + playerID + ')';
                if(i < draft.allPicks.length - 1) insertStatement += ',';
            }
            return await query(deleteStatement, [leagueID]).then(async function () {
                return await query(insertStatement).then(function () { return true; }).catch(function (err) {
                    return { error: err.message };
                });
            }).catch(function (err) {
                return { error: err.message };
            });
        }
    }
}