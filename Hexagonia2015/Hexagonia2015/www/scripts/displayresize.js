function server_showmain() {
    server.login($('#log').val(), $('#psw').val(), server_showmain_done);
}
function server_showmain_done(data){
    alert(data);
}

function showmain() {
    $('#index').css('display', 'none');
    $('#main').css('display', 'block');
    var canvas = document.getElementById("display"),
        content = canvas.getContext('2d'),
        dcanvas = document.querySelector('#display_decorations'),
        dcontent = dcanvas.getContext('2d');

    

    FieldSize = Player.Field;

    OneBlockPosition = {
        X: (window.innerWidth - 10) / FieldSize.X,
        Y: window.innerHeight / (FieldSize.Y + 1)
    };

    Player.Blocks.push({
        TileName: "tileMagic",
        Layer: 0, 
        Source: "images/buildings/ground.json",
        SourceY: 0, 
        Land: Land.Baseland,
        Cost:0,
        Currency: 0,
        State:0
    });



    var rectangles = ($('#display-wrapper').width() - 5) / 7;
    var html = "";
    for (var i = 0; i < 5; i++) {

        if (i != 0 && i < 4)
            html += "&nbsp<button type='button' id='btnHex" + i + "' class='btn btn-success navbar-btn'><canvas id='hex" + i + "' height='" + rectangles + "' width='" + rectangles + "'></canvas></button>";
        else if (i == 0)
            html += "&nbsp<button type='button' id='hexleftbtn' onclick='bcui.pagePrev();' class='btn btn-success navbar-btn' ><span class='fa fa-arrow-left'></span></button>";
        else
            html += "&nbsp<button type='button' id='hexrightbtn' disabled='disabled' onclick='bcui.pageNext();' class='btn btn-success navbar-btn' ><span class='fa fa-arrow-right'></span></button>";
    }
    $('#bot').html(html);
    if ((navigator.userAgent.toLowerCase().indexOf("windows phone") != -1))
        $('#bot').css('margin-bottom', '20%');


    html = "&nbsp<button  type='button' id='marketBtn' class='btn btn-success navbar-btn' onclick='market.open();' ><span class='fa fa-2x fa-money'></span></button>";
    html += "&nbsp<button type='button' id='playBtn' class='btn btn-success navbar-btn' onclick='ui.changeView(View.Movement);' ><span class='fa fa-2x fa-street-view'></span></button>";
    html += "&nbsp<button type='button' id='hexTopBtn' class='btn btn-success navbar-btn'><canvas id='hexTop' height='" + rectangles + "' width='" + rectangles + "'></canvas></button>";
    html += "&nbsp<button type='button' id='buildBtn' class='btn btn-success navbar-btn' onclick='ui.neighborWindow()' ><span class='fa fa-2x fa-building'></span></button>";
    html += "&nbsp<button type='button' id='deleteBtn' class='btn btn-success navbar-btn' onclick='delitingTool()' ><span class='fa fa-2x fa-recycle'></span></button>";
    $('#top').html(html);

    $('body').css('padding-top', $('#top').outerHeight().toString() + 'px');

    content.canvas.height = window.innerHeight - $('#top').outerHeight(true) * 1.5;
    content.canvas.width = window.innerWidth - 10;

    dcontent.canvas.height = window.innerHeight - $('#top').outerHeight(true) * 1.5;
    dcontent.canvas.width = window.innerWidth - 10;



    ui.map.createAbstractMap(false);

    shex.init();

    bcui.init(Player.Blocks);

    bcui.menu();
}

