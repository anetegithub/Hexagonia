function showmain() {
    $('#index').css('display', 'none');
    $('#main').css('display', 'block');
    var h = 640 - $('#bot').outerHeight(true) * 2,
        canvas = document.getElementById("display"),
        content = canvas.getContext('2d');

    if ((navigator.userAgent.toLowerCase().indexOf("windows phone") != -1))
        h = 640 - $('#bot').outerHeight(true) * 2

    content.canvas.height = 420;
    content.canvas.width = 315;
    

    var rectangles = ($('#display-wrapper').width() - 5) / 7;
    var html = "";
    for (var i = 0; i < 5; i++) {

        if (i != 0 && i < 4)
            html += "&nbsp<button type='button' class='btn btn-success navbar-btn'><canvas id='hex" + i + "' height='" + rectangles + "' width='" + rectangles + "'></canvas></button>";
        else if (i==0)
            html += "&nbsp<button type='button' class='btn btn-success navbar-btn' ><span class='fa fa-arrow-left'></span></button>";
        else
            html += "&nbsp<button type='button' class='btn btn-success navbar-btn' ><span class='fa fa-arrow-right'></span></button>";
    }
    $('#bot').html($('#bot').html() + html);

    $('#display-wrapper').height(window.innerHeight - ($('#bot').height() * 2));

    $('#display').css('width',$('#display-wrapper').width());
    $('#display').css('height',$('#display-wrapper').height());
    

    draw([
            { xcord: 3, ycord: 4, tileid: 49 },
            { xcord: 5, ycord: 4, tileid: 49 },
            { xcord: 4, ycord: 5, tileid: 49 },
            { xcord: 3, ycord: 4, tileid: 34 },
            { xcord: 3, ycord: 4, tileid: 13 },
            { xcord: 5, ycord: 4, tileid: 90 },
            { xcord: 4, ycord: 5, tileid: 2 },
    ]);
    drawAll();

    canvas = document.getElementById("hex1"),
        content = canvas.getContext('2d');
    drawOnmyCanvas(90, content, rectangles);

    canvas = document.getElementById("hex2"),
        content = canvas.getContext('2d');
    drawOnmyCanvas(13, content, rectangles);

    canvas = document.getElementById("hex3"),
        content = canvas.getContext('2d');
    drawOnmyCanvas(2, content, rectangles);

}