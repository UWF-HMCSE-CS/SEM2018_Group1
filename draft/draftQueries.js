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
        }
    }
}