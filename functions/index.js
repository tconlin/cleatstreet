const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const { Storage } = require('@google-cloud/storage');
const projectId = 'cleat-street-5';
let gcs = new Storage ({
  projectId
});
const spawn = require('child-process-promise').spawn;
const os = require('os');
const path = require('path');
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
                if( status === 'inprogress' || status === 'complete'){
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
        console.error(error);
    }
    return gameIDs;  
};

const nfl_updateOdds = async (url, year, type, week) => {
    try {
        let res = await request(url, {json: true});
        var events = res.sport_events;
        
        for (var indx_ev in events) {
            if (events.hasOwnProperty(indx_ev)) {
                var sport_type = events[indx_ev].tournament.uuids;
                if(sport_type === 'NFL') {
                    var curr_id = events[indx_ev].uuids;
                    var consensus_lines = events[indx_ev].consensus.lines;
                    for (var indx_ln in consensus_lines) {
                        if (consensus_lines.hasOwnProperty(indx_ln)) {
                            var line_name = consensus_lines[indx_ln].name;
                            if (line_name === 'spread_current') {
                                var the_spread = consensus_lines[indx_ln].spread;
                            }
                            else if (line_name === 'moneyline_current') {
                                var moneyline_current_home = consensus_lines[indx_ln].outcomes[0].odds;
                                var moneyline_current_away = consensus_lines[indx_ln].outcomes[1].odds;
                            }
                            else if (line_name === 'total_current') {
                                var total_current_home = consensus_lines[indx_ln].total;
                                var total_current_away = consensus_lines[indx_ln].total;
                            }
                        }
                    }
                     /* eslint-disable no-redeclare */
                    if (typeof moneyline_current_home === 'undefined' && typeof moneyline_current_away === 'undefined' &&
                        typeof total_current_home === 'undefined' && typeof total_current_away === 'undefined' &&
                        typeof the_spread === 'undefined' && typeof the_spread === 'undefined' ) {
                        admin.database()
                        .ref(`NFL/${year}/${type}/${week}/${curr_id}/Odds`)
                        .set({ 
                            MoneyLineHome: 0,
                            MoneyLineAway: 0,
                            SpreadHome: 0,
                            SpreadAway: 0,
                            TotalHome: 0,
                            TotalAway: 0
                        })
                    }
                    else if (typeof moneyline_current_home === 'undefined' && typeof moneyline_current_away === 'undefined' &&
                        typeof total_current_home === 'undefined' && typeof total_current_away === 'undefined' &&
                        typeof the_spread !== 'undefined' && typeof the_spread !== 'undefined' ) {
                        admin.database()
                        .ref(`NFL/${year}/${type}/${week}/${curr_id}/Odds`)
                        .set({ 
                            MoneyLineHome: 0,
                            MoneyLineAway: 0,
                            SpreadHome: the_spread,
                            SpreadAway: the_spread,
                            TotalHome: 0,
                            TotalAway: 0
                        })
                    }
                    else if (typeof moneyline_current_home !== 'undefined' && typeof moneyline_current_away !== 'undefined' &&
                             typeof total_current_home === 'undefined' && typeof total_current_away === 'undefined') {
                        if ( moneyline_current_away < moneyline_current_home ) {
                            var spread_current_home = parseFloat(the_spread) * 1.0;
                            var spread_current_away = parseFloat(the_spread) * -1.0;
                        }
                        else if ( moneyline_current_home < moneyline_current_away ) {
                            var spread_current_home = parseFloat(the_spread) * -1.0;
                            var spread_current_away = parseFloat(the_spread) * 1.0;
                        }
                        admin.database()
                        .ref(`NFL/${year}/${type}/${week}/${curr_id}/Odds`)
                        .set({ 
                            MoneyLineHome: moneyline_current_home,
                            MoneyLineAway: moneyline_current_away,
                            SpreadHome: spread_current_home,
                            SpreadAway: spread_current_away,
                            TotalHome: 0,
                            TotalAway: 0
                        })
                    }
                    else if (typeof moneyline_current_home !== 'undefined' && typeof moneyline_current_away !== 'undefined' &&
                             typeof total_current_home !== 'undefined' && typeof total_current_away !== 'undefined') {
                        if ( moneyline_current_away < moneyline_current_home ) {
                            var spread_current_home = parseFloat(the_spread) * 1.0;
                            var spread_current_away = parseFloat(the_spread) * -1.0;
                        }
                        else if ( moneyline_current_home < moneyline_current_away ) {
                            var spread_current_home = parseFloat(the_spread) * -1.0;
                            var spread_current_away = parseFloat(the_spread) * 1.0;
                        }
                        admin.database()
                        .ref(`NFL/${year}/${type}/${week}/${curr_id}/Odds`)
                        .set({ 
                            MoneyLineHome: moneyline_current_home,
                            MoneyLineAway: moneyline_current_away,
                            SpreadHome: spread_current_home,
                            SpreadAway: spread_current_away,
                            TotalHome: total_current_home,
                            TotalAway: total_current_away
                        })
                    }
                     /* eslint-disable no-redeclare */
                }
            }
        }
    }
    catch(error) {
        console.error(error)
    }
}

const nfl_updatePBP = async (url, curr_id, year, type, week) => {
    try {
        var currentTime = '16:00';
        var quarter = 0;
        let res = await request(url, {json: true});
        const quarters = res.quarters;
        for (var indx_qtr in quarters) {
            if (quarters.hasOwnProperty(indx_qtr)) {
                const number = quarters[indx_qtr].number;
                if (number > quarter) {
                    var currentQuarter = number;
                    
                }
            }
        }
        for (var indx_qtr in quarters) {
            if (quarters.hasOwnProperty(indx_qtr)) {
                const pbp = quarters[indx_qtr].pbp;
                const number = quarters[indx_qtr].number;
                if (number === currentQuarter) {
                    for (var indx_p in pbp) {
                        if (pbp.hasOwnProperty(indx_p)) {
                            const driveType = pbp[indx_p].type;
                            if (driveType === 'drive') {
                                const drive_id = pbp[indx_p].id;
                                const drive_start = pbp[indx_p].clock;
                                const drive_team = pbp[indx_p].team;
                                if (drive_start < currentTime) {
                                    driveStart = drive_start;
                                    driveTeam = drive_team;
                                    driveId = drive_id;
                                    admin.database()
                                    .ref(`NFL/${year}/${type}/${week}/${curr_id}/PBP/CurrentDrive`)
                                    .set({ currentQuarter: number, currentDriveId: driveId, currentTeam: driveTeam })
                                }
                                
                            }
                        }
                    }
                }
            }
        }
        for (var indx_qtr in quarters) {
            if (quarters.hasOwnProperty(indx_qtr)) {
                const pbp = quarters[indx_qtr].pbp;
                const number = quarters[indx_qtr].number;
                for (var indx_p in pbp) {
                    if (pbp.hasOwnProperty(indx_p)) {
                        const driveType = pbp[indx_p].type;

                        if (driveType === 'event') {
                            /*const ev_id = pbp[indx_p].id
                            admin.database()
                            .ref(`NFL/${year}/${type}/${week}/${curr_id}/PBP/${number}/${ev_id}`)
                            .set({
                                Type: 'event',
                                Summary: pbp[indx_p].summary,
                                EventType: pbp[indx_p].event_type
                            })*/
                        }
                        else if (driveType === 'drive') {
                            const driveEvents = pbp[indx_p].actions;
                            const drive_start = pbp[indx_p].clock;
                            const drive_team = pbp[indx_p].team;
                            const drive_id = pbp[indx_p].id
                            
                            for (var indx_drEv in driveEvents) {
                                if (driveEvents.hasOwnProperty(indx_drEv)) {
                                    const summary = driveEvents[indx_drEv].summary;
                                    const playType = driveEvents[indx_drEv].play_type;
                                    const yardLine = driveEvents[indx_drEv].yard_line;
                                    const side = driveEvents[indx_drEv].side;
                                    const down = driveEvents[indx_drEv].down;
                                    const yfd = driveEvents[indx_drEv].yfd;
                                    const time = driveEvents[indx_drEv].clock;
                                    const event_id = driveEvents[indx_drEv].id;
                                    const sequence = driveEvents[indx_drEv].sequence;
                                    
                                    
                                    if (typeof playType !== 'undefined' && 
                                        typeof summary !== 'undefined' && 
                                        typeof yardLine !== 'undefined' && 
                                        typeof side !== 'undefined' &&
                                        typeof down !== 'undefined' &&
                                        typeof yfd !== 'undefined' &&
                                        typeof time !== 'undefined' &&
                                        typeof event_id !== 'undefined' &&
                                        typeof number !== 'undefined' &&
                                        typeof sequence !== 'undefined'){
                                        admin.database()
                                        .ref(`NFL/${year}/${type}/${week}/${curr_id}/PBP/${number}/${drive_id}/${event_id}`)
                                        .set({
                                            Key: event_id,
                                            Quarter: number,
                                            DriveId: drive_id,
                                            DriveTeam: drive_team,
                                            DriveStart: drive_start,
                                            Summary: summary,
                                            PlayType: playType,
                                            YardLine: yardLine,
                                            Side: side,
                                            Down: down,
                                            YFD: yfd,
                                            Clock: time,
                                            Sequence: sequence
                                        })
                                    }
                                    else if (   typeof playType !== 'undefined' && 
                                                typeof summary !== 'undefined' && 
                                                typeof yardLine !== 'undefined' && 
                                                typeof side !== 'undefined' &&
                                                typeof down !== 'undefined' &&
                                                typeof yfd !== 'undefined' &&
                                                typeof time !== 'undefined' &&
                                                typeof event_id !== 'undefined' &&
                                                typeof number !== 'undefined' &&
                                                typeof sequence !== 'undefined'){
                                                admin.database()
                                                .ref(`NFL/${year}/${type}/${week}/${curr_id}/PBP/${number}/${drive_id}/${event_id}`)
                                                .set({
                                                    Key: event_id,
                                                    Quarter: number,
                                                    DriveId: drive_id,
                                                    DriveTeam: drive_team,
                                                    DriveStart: drive_start,
                                                    Summary: summary,
                                                    PlayType: playType,
                                                    YardLine: yardLine,
                                                    Side: side,
                                                    Down: down,
                                                    YFD: yfd,
                                                    Clock: time,
                                                    Score: false,
                                                    Sequence: sequence
                                                })
                                    }
                                    else if(    typeof drive_team !== 'undefined' &&
                                                typeof drive_id !== 'undefined' &&
                                                typeof drive_start !== 'undefined' &&
                                                typeof event_id !== 'undefined' &&
                                                typeof summary !== 'undefined' && 
                                                typeof time !== 'undefined' &&
                                                typeof number !== 'undefined' &&
                                                typeof sequence !== 'undefined' ) {
                                        admin.database()
                                        .ref(`NFL/${year}/${type}/${week}/${curr_id}/PBP/${number}/${drive_id}/${event_id}`)
                                        .set({
                                            Key: event_id,
                                            Quarter: number,
                                            DriveId: drive_id,
                                            DriveTeam: drive_team,
                                            DriveStart: drive_start,
                                            Clock: time,
                                            Summary: summary,
                                            Score: false,
                                            Sequence: sequence
                                            
                                        })
                                    }
                                }
                            }    
                        }








                    }
                }
            }  
        }
    }
    catch(error) {
        console.error(error)
    }
}



const nfl_updateBoxScore = async (url, curr_id, year, type, week) => {
    try {
        let res = await request(url, {json: true});
        const clock = res.clock;
        const quarter = res.quarter;
        const home_scoring = res.home_team.scoring;
        const away_scoring = res.away_team.scoring;
        
        const home_total = res.home_team.points;
        const away_total = res.away_team.points;
        
        /* eslint-disable no-redeclare */
        var home_scr_length = home_scoring.length;
        if(home_scr_length === 0) {
            var qtr1score_home = 0;        
            var qtr2score_home = 0;
            var qtr3score_home = 0;
            var qtr4score_home = 0;
            var qtr1score_away = 0;
            var qtr2score_away = 0;
            var qtr3score_away = 0;
            var qtr4score_away = 0;
        }
        if(home_scr_length === 1) {
            var qtr1score_home = home_scoring[0].points;        
            var qtr2score_home = 0;
            var qtr3score_home = 0;
            var qtr4score_home = 0;
            var qtr1score_away = away_scoring[0].points;
            var qtr2score_away = 0;
            var qtr3score_away = 0;
            var qtr4score_away = 0;
        }
        else if(home_scr_length === 2) {
            var qtr1score_home = home_scoring[0].points;        
            var qtr2score_home = home_scoring[1].points;
            var qtr3score_home = 0;
            var qtr4score_home = 0;
            var qtr1score_away = away_scoring[0].points;
            var qtr2score_away = away_scoring[1].points;
            var qtr3score_away = 0;
            var qtr4score_away = 0;
        }
        else if(home_scr_length === 3) {
            var qtr1score_home = home_scoring[0].points;        
            var qtr2score_home = home_scoring[1].points;
            var qtr3score_home = home_scoring[2].points;
            var qtr4score_home = 0;
            var qtr1score_away = away_scoring[0].points;
            var qtr2score_away = away_scoring[1].points;
            var qtr3score_away = away_scoring[2].points;
            var qtr4score_away = 0;
        }
        else if(home_scr_length === 4) {
            var qtr1score_home = home_scoring[0].points;        
            var qtr2score_home = home_scoring[1].points;
            var qtr3score_home = home_scoring[2].points;
            var qtr4score_home = home_scoring[3].points;
            var qtr1score_away = away_scoring[0].points;
            var qtr2score_away = away_scoring[1].points;
            var qtr3score_away = away_scoring[2].points;
            var qtr4score_away = away_scoring[3].points;
            
        }
        /* eslint-disable no-redeclare */

        admin.database()
        .ref(`NFL/${year}/${type}/${week}/${curr_id}/Live`)
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
        console.error(error)
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
                                    for (var indx_teams in teams ) {
                                        if (confs.hasOwnProperty(indx_confs)) {    
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
                const status = gameIDs[indx_ids].Status;
                admin.database()
                .ref(`NFL/${year}/${type}/${week}/${curr_id}/`)
                .set({ 
                    Schedule: {
                        Status: status,
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
        console.error(error)
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
    var SP_API_KEY = functions.config().sportradar_nfl.key;
    const schedule_url = `https://api.sportradar.us/nfl-p1/${year}/${type}/${week}/schedule.json?api_key=${SP_API_KEY}`;
    
    let gameIDs = await nfl_getGameIDs_helper(schedule_url);
    
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
    /* eslint-disable no-await-in-loop */
    for (var indx_ids in gameIDs ) {
        if (gameIDs.hasOwnProperty(indx_ids)) {
            if (gameIDs[indx_ids].Active) {
                var away = gameIDs[indx_ids].AwayAlias;
                var home = gameIDs[indx_ids].HomeAlias;
                var curr_id = gameIDs[indx_ids].Id;
                
                const pbp_url = `https://api.sportradar.us/nfl-p1/${year}/${type}/${week}/${away}/${home}/pbp.json?api_key=${SP_API_KEY}`;
                
                let updatePBP = await nfl_updatePBP(pbp_url, curr_id, year, type, week);
            }
        }
    }
    /* eslint-disable no-await-in-loop */
}

const nfl_OddsData = async () => {
    var nfl_week = findDates.findNFLWeek_2019();
    var type = nfl_week[0];
    var week = nfl_week[1];
    var year = nfl_week[2];
    
    var SP_API_KEY = functions.config().sportradar_nfl.key;
    const schedule_url = `https://api.sportradar.us/nfl-p1/${year}/${type}/${week}/schedule.json?api_key=${SP_API_KEY}`;
    
    let gameIDs = await nfl_getGameIDs_helper(schedule_url);

    /* eslint-disable no-await-in-loop */
    for (var indx_ids2 in gameIDs ) {
        if (gameIDs.hasOwnProperty(indx_ids2)) {
            const SP_ODDS_KEY = functions.config().sportradar_nfl_odds.key;
            const scheduled_date = gameIDs[indx_ids2].Scheduled;
            const game_date = findDates.extractDate(scheduled_date);
            const odds_url = `https://api.sportradar.us/oddscomparison-usp1/en/us/sports/sr:sport:16/${game_date}/schedule.json?api_key=${SP_ODDS_KEY}`;
            
            let liveOdds = await nfl_updateOdds(odds_url, year, type, week);
        }
    }
    /* eslint-disable no-await-in-loop */
}




exports.updateScore_Thurs = functions.pubsub.schedule('* 19-23 * * 4').timeZone('America/New_York').onRun((context) => {
    nfl_LiveGameData();
    return null;
});

exports.updateScore_LateThurs = functions.pubsub.schedule('* 00-02 * * 5').timeZone('America/New_York').onRun((context) => {
    nfl_LiveGameData();
    return null;
});

exports.updateScore_Saturday = functions.pubsub.schedule('* 11 * * 6').timeZone('America/New_York').onRun((context) => {
    nfl_LiveGameData();
    return null;
});

exports.updateScore_Sunday = functions.pubsub.schedule('* 00-02,11-23 * * 7').timeZone('America/New_York').onRun((context) => {
    nfl_LiveGameData();
    return null;
});


exports.updateScore_Monday = functions.pubsub.schedule('* 00-02,17-23 * * 1').timeZone('America/New_York').onRun((context) => {
    nfl_LiveGameData();
    return null;
});

exports.updateScore_LateMonday = functions.pubsub.schedule('* 00-02 * * 2').timeZone('America/New_York').onRun((context) => {
    nfl_LiveGameData();
    return null;
});



exports.updateOdds = functions.pubsub.schedule('every 6 hours').timeZone('America/New_York').onRun((context) => {
    nfl_OddsData();
    return null;
});


exports.updateOdds = functions.pubsub.schedule('0 3 * * 2').timeZone('America/New_York').onRun((context) => {
    nfl_OddsData();
    return null;
});


//every tuesday morning
exports.weeklyUpdateGameInfo = functions.pubsub.schedule('0 2 * * 2').timeZone('America/New_York').onRun((context) => {
    nfl_WeeklyGameInfo();
    return null;
});


exports.onFileChange = functions.storage.object().onFinalize(event => {
    const bucket = event.bucket;
    const contentType = event.contentType;
    const filePath = event.name;
    const fileSize = event.size;
    console.log('File change detected, function execution started');

    if(fileSize < 500000){
        console.log('already resized this file')
        return false;
    }

    const destBucket = gcs.bucket(bucket);
    const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const metadata = { contentType: contentType };
    return destBucket.file(filePath).download({
        destination: tmpFilePath
    }).then(() => {
        return spawn('convert', [tmpFilePath, '-resize', '200x200', tmpFilePath]);
    }).then(() => {
        return destBucket.upload(tmpFilePath, {
            destination: path.basename(filePath),
            metadata: metadata
        })
    }).catch(error => {
        console.error(error);
      });
});