// set the date we're counting down to
var target_date = new Date('Oct, 9, 2014').getTime();

var second=0;

// variables for time units
var days, hours, minutes, seconds, ms_step = 60;

var timer = {
    totalseconds: 0,
    godwhy:0,
    _timerId: 0,
    sad: 0,
    suka:0,
    enable: function (date) {
        target_date = date;        
        this._timerId = setInterval(function () {            
            var current_date = new Date().getTime();
            var seconds_left = (target_date - current_date) / 1000;
            days = parseInt(seconds_left / 86400);
            seconds_left = seconds_left % 86400;
            hours = parseInt(seconds_left / 3600);
            seconds_left = seconds_left % 3600;
            min = parseInt(seconds_left / 60);
            sec = parseInt(seconds_left % 60);
            ms = parseInt(target_date - current_date);

            $('#countdown').html('' +
               '<span class="hours">' + (hours >= 10 ? hours.toString() : "0" + hours.toString()) + ':</span>' +
               '<span class="minutes">' + (min >= 10 ? min.toString() : "0" + min.toString()) + ':</span>' +
               '<span class="seconds">' + (sec >= 10 ? sec.toString() : "0" + sec.toString()) + '</span>');
            
            timer.godwhy = timer.totalseconds - seconds_left;
            var percent = timer.godwhy / timer.totalseconds;
            percent *= 100;
            $(".progress-bar").css("width", percent.toString() + "%").attr("aria-valuenow", percent.sad);
                            //$('#progress-bar-expedition').css('width', timer.sad + '%');
                timer.sad++;
                //$('#progress-bar-expedition').html($('#progress-bar-expedition').css('width'));            
        }, ms_step);
    },
    disable: function () {
        clearInterval(this._timerId);
    }
};

var _DateTimeSimpleObject = {
    Day: 1,
    Month: 1,
    Year: 1993
};

