const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const request = require('request-promise');
const findDates = require('./week_2019');

const nfl_getGameIDs_helper = async (url) => { 
    var gameIDs = [];
    try {
        let res = await request(url, {json: true});
        var games = res.games;
        for (var i in games) {
            if (games.hasOwnProperty(i)) {
                var status = games[i].status;
                
                /*
                *    CHANGE TO ACTIVE
                */


                if(status === 'active'){
                    gameIDs.push({
                        Id: games[i].id,
                        AwayAlias: games[i].away,
                        HomeAlias: games[i].home,
                        Scheduled: games[i].scheduled,
                        Active: true,
                        Status: games[i].status
                    })
                }
                else {
                    gameIDs.push({
                        Id: games[i].id,
                        AwayAlias: games[i].away,
                        HomeAlias: games[i].home,
                        Scheduled: games[i].scheduled,
                        Active: false,
                        Status: games[i].status
                    })

                }
            }
        }
    }
    catch(error){
        console.warn(error);
    }
    return gameIDs;  
};

const nfl_updateBoxScore = async (url, curr_id, year, type, week) => {
    try {
        let res = await request(url, {json: true})
        const clock = res.clock;
        const quarter = res.quarter;
        const home_scoring = res.home_team.scoring;
        const away_scoring = res.away_team.scoring;
        const home_total = res.home_team.points;
        const away_total = res.away_team.points;
        for (var indx_hscr in home_scoring) {
            if (home_scoring.hasOwnProperty(indx_hscr)) {
                if( indx_hscr === 0 ) {
                    var qtr1score_home = home_scoring[indx_hscr].points;
                }
                else if (indx_hscr === 1) {
                    var qtr2score_home = home_scoring[indx_hscr].points;
                }
                else if (indx_hscr === 2) {
                    var qtr3score_home = home_scoring[indx_hscr].points;
                }
                else if (indx_hscr === 3) {
                    var qtr4score_home = home_scoring[indx_hscr].points;
                }
            }
        }
        for (var indx_ascr in away_scoring) {
            if (away_scoring.hasOwnProperty(indx_ascr)) {
                if( indx_ascr === 0 ) {
                    var qtr1score_away = away_scoring[indx_ascr].points;
                }
                else if (indx_ascr === 1) {
                    var qtr2score_away = away_scoring[indx_ascr].points;
                }
                else if (indx_ascr === 2) {
                    var qtr3score_away = away_scoring[indx_ascr].points;
                }
                else if (indx_ascr === 3) {
                    var qtr4score_away = away_scoring[indx_ascr].points;
                }
            }
        }
        const drives = res.scoring_drives;
        for (var indx_dr in drives) {
            if (drives.hasOwnProperty(indx_dr)) {
                const events = drives[indx_dr].scores;
                const sequence = drives[indx_dr].sequence;
                admin.database()
                .ref(`NFL/${year}/${type}/${week}/${curr_id}/PBP/${sequence}/`).once("value", snapshot => {
                    if (!snapshot.exists()){
                        for ( var indx_ev in events) {
                            if (events.hasOwnProperty(indx_ev)) {
                                admin.database()
                                .ref(`NFL/${year}/${type}/${week}/${curr_id}/PBP/${sequence}/`)
                                .push({
                                    Quarter: events[indx_ev].quarter,
                                    Time: events[indx_ev].clock,
                                    Team: events[indx_ev].team,
                                    Summary: events[indx_ev].summary
                                })
                            }
                        }
                     }
                 });
            }  
        }
        if (qtr1score_home === null) {
            qtr1score_home = 0;
        }
        if (qtr2score_home === null) {
            qtr2score_home = 0;
        }
        if (qtr3score_home === null) {
            qtr3score_home = 0;
        }
        if (qtr4score_home === null) {
            qtr4score_home = 0;
        }
        if (qtr1score_away === null) {
            qtr1score_away = 0;
        }
        if (qtr2score_away === null) {
            qtr2score_away = 0;
        }
        if (qtr3score_away === null) {
            qtr3score_away = 0;
        }
        if (qtr4score_away === null) {
            qtr4score_away = 0;
        }
        admin.database()
        .ref(`NFL/${year}/${type}/${week}/${curr_id}/Live/`)
        .set({
            Clock: clock,
            Quarter: quarter,
            Quarter1: {
                Home: qtr1score_home,
                Away: qtr1score_away
            },
            Quarter2: {
                Home: qtr2score_home,
                Away: qtr2score_away
            },
            Quarter3: {
                Home: qtr3score_home,
                Away: qtr3score_away
            },
            Quarter4: {
                Home: qtr4score_home,
                Away: qtr4score_away
            },
            Total: {
                HomeTotal: home_total,
                AwayTotal: away_total

            }
        })
    }
    catch(error) {
        console.warn(error)
    }
}

const nfl_loadWeeklyInfo = async (gameIDs, url, year, type, week) => {
    try {
        let res = await request(url, {json: true})
        var confs = res.conferences;
        for(var indx_ids in gameIDs) {
            if (gameIDs.hasOwnProperty(indx_ids)) {
                var curr_id = gameIDs[indx_ids].Id;
                
                if(week > 1) {    
                    for (var indx_confs in confs ) {
                        if (confs.hasOwnProperty(indx_confs)) {
                            var divs = confs[indx_confs].divisions; 
                            for (var indx_divs in divs ) {
                                if (divs.hasOwnProperty(indx_divs)) {
                                    var teams = divs[indx_divs].teams
                                    console.log(teams);
                                    for (var indx_teams in teams ) {
                                        if (confs.hasOwnProperty(indx_confs)) {    
                                            console.log(gameIDs[indx_ids].HomeAlias);
                                            if( gameIDs[indx_ids].HomeAlias === teams[indx_teams].id) {
                                                var HomeAlias = teams[indx_teams].id;
                                                var HomeWins = teams[indx_teams].overall.wins;
                                                var HomeLosses =  teams[indx_teams].overall.losses;
                                                var HomeTies = teams[indx_teams].overall.ties;
                                            }
                                            if( gameIDs[indx_ids].AwayAlias === teams[indx_teams].id) {
                                                var AwayAlias = teams[indx_teams].id;
                                                var AwayWins = teams[indx_teams].overall.wins;
                                                var AwayLosses =  teams[indx_teams].overall.losses;
                                                var AwayTies = teams[indx_teams].overall.ties;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    var gameTime_2 = gameIDs[indx_ids].Scheduled;
                    var HomeAlias_2 = gameIDs[indx_ids].HomeAlias;
                    var HomeWins_2 = 0;
                    var HomeLosses_2 =  0;
                    var HomeTies_2 = 0;
                    var AwayAlias_2 = gameIDs[indx_ids].AwayAlias;
                    var AwayWins_2 = 0;
                    var AwayLosses_2 =  0;
                    var AwayTies_2 = 0;
                    admin.database()
                    .ref(`NFL/${year}/${type}/${week}/${curr_id}/`)
                    .set({ 
                        Schedule: {
                            GameTime: gameTime_2
                        },
                        HomeTeam: {
                            Alias: HomeAlias_2,
                            Wins: HomeWins_2,
                            Losses: HomeLosses_2,
                            Ties: HomeTies_2
                        },
                        AwayTeam: {
                            Alias: AwayAlias_2,
                            Wins: AwayWins_2,
                            Losses: AwayLosses_2,
                            Ties: AwayTies_2
                        }
                    })
                }
            }
            if (week > 1) {
                const gameTime = gameIDs[indx_ids].Scheduled;
                admin.database()
                .ref(`NFL/${year}/${type}/${week}/${curr_id}/`)
                .set({ 
                    Schedule: {
                        GameTime: gameTime
                    },
                    HomeTeam: {
                        Alias: HomeAlias,
                        Wins: HomeWins,
                        Losses: HomeLosses,
                        Ties: HomeTies
                    },
                    AwayTeam: {
                        Alias: AwayAlias,
                        Wins: AwayWins,
                        Losses: AwayLosses,
                        Ties: AwayTies
                    }
                })
            }
        }
    }
    catch(error) {
        console.warn(error)
    }
}

const nfl_WeeklyGameInfo = async () => {
    var nfl_week = findDates.findNFLWeek_2019();
    var type = nfl_week[0];
    var week = nfl_week[1];
    var year = nfl_week[2];
    
    var SP_API_KEY = functions.config().sportradar_nfl.key
    const schedule_url = `https://api.sportradar.us/nfl-p1/${year}/${type}/${week}/schedule.json?api_key=${SP_API_KEY}`;
    const standings_url = `https://api.sportradar.us/nfl-p1/teams/${year}/${type}/standings.json?api_key=${SP_API_KEY}`;
    
    let gameIDs = await nfl_getGameIDs_helper(schedule_url);
    let teamrecords = await nfl_loadWeeklyInfo(gameIDs, standings_url, year, type, week);
};

const nfl_LiveGameData = async () => {  
    var nfl_week = findDates.findNFLWeek_2019();
    var type = nfl_week[0];
    var week = nfl_week[1];
    var year = nfl_week[2];
    
    var SP_API_KEY = functions.config().sportradar_nfl.key
    const schedule_url = `https://api.sportradar.us/nfl-p1/${year}/${type}/${week}/schedule.json?api_key=${SP_API_KEY}`;
    
    let gameIDs = await nfl_getGameIDs_helper(schedule_url);
    
    const gamesToRun = [];
    /* eslint-disable no-await-in-loop */
    for (var indx_ids in gameIDs ) {
        if (gameIDs.hasOwnProperty(indx_ids)) {
            if (gameIDs[indx_ids].Active) {
                var away = gameIDs[indx_ids].AwayAlias;
                var home = gameIDs[indx_ids].HomeAlias;
                var curr_id = gameIDs[indx_ids].Id;
                const box_url = `https://api.sportradar.us/nfl-p1/${year}/${type}/${week}/${away}/${home}/boxscore.json?api_key=${SP_API_KEY}`;
                
                let liveData = await nfl_updateBoxScore(box_url, curr_id, year, type, week);
            }
        }
    }
    /* eslint-disable no-await-in-loop */
    
}


exports.updateScore = functions.pubsub.schedule('* * * * *').timeZone('America/New_York').onRun((context) => {
    nfl_LiveGameData();
    return null;
});

//every tuesday morning
exports.weeklyUpdateGameInfo = functions.pubsub.schedule('0 2 * * 2').timeZone('America/New_York').onRun((context) => {
    nfl_WeeklyGameInfo();
    return null;
});
