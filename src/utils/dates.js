module.exports = {
    convertDayOfWeek: function dayOfWeek(UTCDate) {
        var date = new Date(UTCDate);
        var days = ['Sun, ','Mon, ','Tues, ','Wed, ','Thu, ','Fri, ','Sat, '];
        var months = ['Jan ','Feb ','Mar ','Apr ','May ','Jun ','Jul ','Aug ','Sep ','Oct ','Nov ','Dec '];
        var weekDay = days[ date.getDay() ];
        var month = months[ date.getMonth() ];
        var day =  date.getDate();
        date_formatted = weekDay + month + day;

        return date_formatted;
    },
    convertTime: function convertTime(UTCDate) {
        var options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            //timeZone: timezone
        };
        var date = new Date(UTCDate);
        var timeString = date.toLocaleString('en-US', options);
        
        return timeString;
    },
    findNFLWeek_2019: function findNFLWeek_2019()  {
            var now = new Date()
            var date = now.getDate(); //Get the day as a number (1-31)
            var month = now.getMonth() + 1; //	Get the month as a number (1-12)
            var year = now.getFullYear(); //Get the year as a four digit number (yyyy)
            var nfl_week = [];
        
            if ( date >= 5 && date <= 12 && month === 8 && year === 2019) {
                nfl_week = ['PRE', '1', '2019']
                return  nfl_week
            }
            else if ( date >= 13 && date <= 19 && month === 8 && year === 2019) {
                nfl_week = ['PRE', '2', '2019']
                return  nfl_week
            }
            else if ( date >= 20 && date <= 26 && month === 8 && year === 2019) {
                nfl_week = ['PRE', '3', '2019']
                return  nfl_week
            }
            else if ( date >= 27 && date <= 31 && month === 8 && year === 2019) {
                nfl_week = ['PRE', '4', '2019']
                return  nfl_week
            }
            else if ( date <= 2 && month === 9 && year === 2019) {
                nfl_week = ['PRE', '4', '2019']
                return  nfl_week
            }
            else if ( date >= 3 && date <= 9 && month === 9 && year === 2019) {
                nfl_week = ['REG', '1', '2019']
                return  nfl_week
            }
            else if ( date >= 10 && date <= 16 && month === 9 && year === 2019) {
                nfl_week = ['REG', '2', '2019']
                return  nfl_week
            }
            else if ( date >= 17 && date <= 23 && month === 9 && year === 2019) {
                nfl_week = ['REG', '3', '2019']
                return  nfl_week
            }
            else if ( date >= 24 && date <= 30 && month === 9 && year === 2019 ) {
                nfl_week = ['REG', '4', '2019']
                return  nfl_week
            }
            else if ( date === 30 && month === 9 && year === 2019) {
                nfl_week = ['REG', '4', '2019']
                return  nfl_week
            }
            else if ( date >= 1 && date <= 7 && month === 10 && year === 2019) {
                nfl_week = ['REG', '5', '2019']
                return  nfl_week
            }
            else if ( date >= 8 && date <= 14 && month === 10 && year === 2019 ) {
                nfl_week = ['REG', '6', '2019']
                return  nfl_week
            }
            else if ( date >= 15 && date <= 21 && month === 10 && year === 2019 ) {
                nfl_week = ['REG', '7', '2019']
                return  nfl_week
            }
            else if ( date >= 22 && date <= 28 && month === 10 && year === 2019 ) {
                nfl_week = ['REG', '8', '2019']
                return  nfl_week
            }
            else if ( date >= 29 && date <= 31 && month === 10 && year === 2019 ) {
                nfl_week = ['REG', '9', '2019']
                return  nfl_week
            }
            else if ( date >= 1 && date <= 4 && month === 11 && year === 2019 ) {
                nfl_week = ['REG', '9', '2019']
                return  nfl_week
            }
            else if ( date >= 5 && date <= 11 && month === 11 && year === 2019 ) {
                nfl_week = ['REG', '10', '2019']
                return  nfl_week
            }
            else if ( date >= 12 && date <= 18 && month === 11 && year === 2019 ) {
                nfl_week = ['REG', '11', '2019']
                return  nfl_week
            }
            else if ( date >= 19 && date <= 25 && month === 11 && year === 2019 ) {
                nfl_week = ['REG', '12', '2019']
                return  nfl_week
            }
            else if ( date >= 26 && date <= 30 && month === 11 && year === 2019 ) {
                nfl_week = ['REG', '13', '2019']
                return  nfl_week
            }
            else if ( date <= 2 && month === 12 && year === 2019 ) {
                nfl_week = ['REG', '13', '2019']
                return  nfl_week
            }
            else if ( date >= 3 && date <= 9 && month === 12 && year === 2019 ) {
                nfl_week = ['REG', '14', '2019']
                return  nfl_week
            }
            else if ( date >= 10 && date <= 16 && month === 12 && year === 2019 ) {
                nfl_week = ['REG', '15', '2019']
                return  nfl_week
            }
            else if ( date >= 17 && date <= 23 && month === 12 && year === 2019 ) {
                nfl_week = ['REG', '16', '2019']
                return  nfl_week
            }
            else if ( date >= 24 && date <= 30 && month === 12 && year === 2019 ) {
                nfl_week = ['REG', '17', '2019']
                return  nfl_week
            }
            else if ( date === 31 && month === 12 && year === 2019 ) {
                nfl_week = ['PST', '1' , '2019']
                return  nfl_week
            }
            else if ( date >= 1 && date <= 6 && month === 1 && year === 2020 ) {
                nfl_week = ['PST', '1' , '2019']
                return  nfl_week
            }
            else if ( date >= 7 && date <= 13 && month === 1 && year === 2020 ) {
                nfl_week = ['PST', '2', '2019']
                return  nfl_week
            }
            else if ( date >= 14 && date <= 19 && month === 1 && year === 2020 ) {
                nfl_week = ['PST', '3', '2019']
                return  nfl_week
            }
            else if ( date >= 27 && month === 1 && year === 2020 ) {
                nfl_week = ['PST', '4', '2019']
                return  nfl_week
            }
            else if ( date >= 1 && month === 2 && year === 2020 ) {
                nfl_week = ['PST', '4', '2019']
                return  nfl_week
            }
            else {
                nfl_week = [0]
                return nfl_week
            }
        }
};