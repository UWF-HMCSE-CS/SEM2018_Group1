/* Helper functions for draft set up */
module.exports = {
    // Generate the draft order given the list of teams and the number of rounds.
    // allPicks will be an array of objects with pickNum, team, 
    // and player properties (players added when players are picked)
    generateSnakeDraftOrder: function (teams, rounds) {
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
    },
    
    // Shuffle order of teams
    shuffle: function (teams) {
        let currentIndex = teams.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = teams[currentIndex];
            teams[currentIndex] = teams[randomIndex];
            teams[randomIndex] = temporaryValue;
        }

        return teams;
    },

    // Return the picks specifically for the user
    usersTeam: function (username, draft) {
        let myTeam = draft.teams.find(function (team) {
            return team.username === username;
        });
        myTeam.picks = draft.allPicks.filter(function (pick) {
            return pick.team.username === username;
        });
        return myTeam;
    },

    getCurrentPick: function (draft) {
        for (let i = 0; i < draft.allPicks.length; i++) {
            if (!draft.allPicks[i].player) return draft.allPicks[i];
        }
    },

    getAvailablePlayers: function (draft) {
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