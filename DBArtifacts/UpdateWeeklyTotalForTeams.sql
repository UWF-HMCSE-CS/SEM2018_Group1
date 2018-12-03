drop table if exists x;
drop table if exists y;

/* I know two temporary tables is a lot for a single operation, but I couldnt find a cleanerr way to do it in the time alotted*/

create temporary table x select team.teamID, weeklyTotal from team, player_team, players 
where team.teamID = player_team.teamID and players.playerID = player_team.playerID;

create temporary table y select teamID, sum(weeklyTotal) as weeklyTotal from x group by teamID;

update team set weeklysum = (select weeklyTotal from y where team.teamID = y.teamID);


drop table if exists x;
drop table if exists y;