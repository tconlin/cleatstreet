module.exports = {
    convertDayOfWeek: function dayOfWeek(datetime) {
        var date = new Date(datetime);
        var days = ['Sun, ','Mon, ','Tues, ','Wed, ','Thu, ','Fri, ','Sat, '];
        var months = ['Jan ','Feb ','Mar ','Apr ','May ','Jun ','Jul ','Aug ','Sep ','Oct ','Nov ','Dec '];
        var weekDay = days[ date.getDay() ];
        var month = months[ date.getMonth() ];
        var day =  date.getDate();
        date_formatted = weekDay + month + day;

        return date_formatted;
    },
    extractDate: function extractDate(datetime) {
        var date = new Date(datetime),
        month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');

    },
    convertTime: function convertTime(datetime, timezone) {
        var options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: timezone
        };
        var date = new Date(datetime);
        var timeString = date.toLocaleString('en-US', options);
        
        return timeString;
    },
    findNFLWeek_2019: function findNFLWeek_2019()  {
            var now = new Date()
            var date = now.getDate(); //Get the day as a number (1-31)
            var month = now.getMonth() + 1; //Get the month as a number (1-12)
            var year = now.getFullYear(); //Get the year as a four digit number (yyyy)
            var nfl_week = [];
        
            if ( date >= 5 && date <= 11 && month === 8 && year === 2019) {
                nfl_week = ['PRE', '1', '2019']
                return  nfl_week
            }
            else if ( date >= 12 && date <= 18 && month === 8 && year === 2019) {
                nfl_week = ['PRE', '2', '2019']
                return  nfl_week
            }
            else if ( date >= 19 && date <= 25 && month === 8 && year === 2019) {
                nfl_week = ['PRE', '3', '2019']
                return  nfl_week
            }
            else if ( date >= 26 && date <= 31 && month === 8 && year === 2019) {
                nfl_week = ['PRE', '4', '2019']
                return  nfl_week
            }
            else if ( date === 1 && month === 9 && year === 2019) {
                nfl_week = ['PRE', '4', '2019']
                return  nfl_week
            }
            else if ( date >= 2 && date <= 8 && month === 9 && year === 2019) {
                nfl_week = ['REG', '1', '2019']
                return  nfl_week
            }
            else if ( date >= 9 && date <= 15 && month === 9 && year === 2019) {
                nfl_week = ['REG', '2', '2019']
                return  nfl_week
            }
            else if ( date >= 16 && date <= 22 && month === 9 && year === 2019) {
                nfl_week = ['REG', '3', '2019']
                return  nfl_week
            }
            else if ( date >= 23 && date <= 29 && month === 9 && year === 2019 ) {
                nfl_week = ['REG', '4', '2019']
                return  nfl_week
            }
            else if ( date === 30 && month === 9 && year === 2019) {
                nfl_week = ['REG', '5', '2019']
                return  nfl_week
            }
            else if ( date >= 1 && date <= 6 && month === 10 && year === 2019) {
                nfl_week = ['REG', '5', '2019']
                return  nfl_week
            }
            else if ( date >= 7 && date <= 13 && month === 10 && year === 2019 ) {
                nfl_week = ['REG', '6', '2019']
                return  nfl_week
            }
            else if ( date >= 14 && date <= 20 && month === 10 && year === 2019 ) {
                nfl_week = ['REG', '7', '2019']
                return  nfl_week
            }
            else if ( date >= 21 && date <= 27 && month === 10 && year === 2019 ) {
                nfl_week = ['REG', '8', '2019']
                return  nfl_week
            }
            else if ( date >= 28 && date <= 31 && month === 10 && year === 2019 ) {
                nfl_week = ['REG', '9', '2019']
                return  nfl_week
            }
            else if ( date >= 1 && date <= 3 && month === 11 && year === 2019 ) {
                nfl_week = ['REG', '9', '2019']
                return  nfl_week
            }
            else if ( date >= 4 && date <= 10 && month === 11 && year === 2019 ) {
                nfl_week = ['REG', '10', '2019']
                return  nfl_week
            }
            else if ( date >= 11 && date <= 17 && month === 11 && year === 2019 ) {
                nfl_week = ['REG', '11', '2019']
                return  nfl_week
            }
            else if ( date >= 18 && date <= 24 && month === 11 && year === 2019 ) {
                nfl_week = ['REG', '12', '2019']
                return  nfl_week
            }
            else if ( date >= 25 && date <= 30 && month === 11 && year === 2019 ) {
                nfl_week = ['REG', '13', '2019']
                return  nfl_week
            }
            else if ( date === 1 && month === 12 && year === 2019 ) {
                nfl_week = ['REG', '13', '2019']
                return  nfl_week
            }
            else if ( date >= 2 && date <= 8 && month === 12 && year === 2019 ) {
                nfl_week = ['REG', '14', '2019']
                return  nfl_week
            }
            else if ( date >= 9 && date <= 15 && month === 12 && year === 2019 ) {
                nfl_week = ['REG', '15', '2019']
                return  nfl_week
            }
            else if ( date >= 16 && date <= 22 && month === 12 && year === 2019 ) {
                nfl_week = ['REG', '16', '2019']
                return  nfl_week
            }
            else if ( date >= 23 && date <= 29 && month === 12 && year === 2019 ) {
                nfl_week = ['REG', '17', '2019']
                return  nfl_week
            }
            else if ( date >= 30 && date <= 31 && month === 12 && year === 2019 ) {
                nfl_week = ['PST', '1' , '2019']
                return  nfl_week
            }
            else if ( date >= 1 && date <= 5 && month === 1 && year === 2020 ) {
                nfl_week = ['PST', '1' , '2019']
                return  nfl_week
            }
            else if ( date >= 6 && date <= 12 && month === 1 && year === 2020 ) {
                nfl_week = ['PST', '2', '2019']
                return  nfl_week
            }
            else if ( date >= 13 && date <= 19 && month === 1 && year === 2020 ) {
                nfl_week = ['PST', '3', '2019']
                return  nfl_week
            }
            else if ( date >= 27 && month === 1 && year === 2020 ) {
                nfl_week = ['PST', '4', '2019']
                return  nfl_week
            }
            else {
                nfl_week = [0]
                return nfl_week
            }
        }
};