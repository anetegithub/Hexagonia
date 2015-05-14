function showmain() {
    $('#index').css('display', 'none');
    $('#main').css('display', 'block');
    var h = 640 - $('#bot').outerHeight(true) * 2,
        canvas = document.getElementById("display"),
        content = canvas.getContext('2d');

    if ((navigator.userAgent.toLowerCase().indexOf("windows phone") != -1))
        h = 640 - $('#bot').outerHeight(true) * 2

    content.canvas.height = 420;
    content.canvas.width = 325;


    var rectangles = ($('#display-wrapper').width() - 5) / 7;
    var html = "";
    for (var i = 0; i < 5; i++) {

        if (i != 0 && i < 4)
            html += "&nbsp<button type='button' id='btnHex" + i + "' class='btn btn-success navbar-btn'><canvas id='hex" + i + "' height='" + rectangles + "' width='" + rectangles + "'></canvas></button>";
        else if (i == 0)
            html += "&nbsp<button type='button' id='hexleftbtn' disabled='disabled' onclick='bcui.pagePrev();' class='btn btn-success navbar-btn' ><span class='fa fa-arrow-left'></span></button>";
        else
            html += "&nbsp<button type='button' id='hexrightbtn' disabled='disabled' onclick='bcui.pageNext();' class='btn btn-success navbar-btn' ><span class='fa fa-arrow-right'></span></button>";
    }
    $('#bot').html(html);

    html = "&nbsp<button type='button' class='btn btn-success navbar-btn' ><span class='fa fa-2x fa-street-view'></span></button>";
    html += "&nbsp<button type='button' id='hexTopBtn' class='btn btn-success navbar-btn'><canvas id='hexTop' height='" + rectangles + "' width='" + rectangles + "'></canvas></button>";
    html += "&nbsp<button type='button' class='btn btn-success navbar-btn' ><span class='fa fa-2x fa-building'></span></button>";
    $('#top').html(html);

    if ((navigator.userAgent.toLowerCase().indexOf("windows phone") == -1))
        $('#display-wrapper').css('margin-top', "8%");
    else
        $('#display-wrapper').css('margin-top', "20%");
    $('#display-wrapper').height(window.innerHeight - ($('#bot').height() * 2));

    //if (window.innerHeight > 500)
    //    $('#display').css('height', $('#display-wrapper').height()-15);
    //if (window.innerWidth > 415)
    //    $('#display').css('width', $('#display-wrapper').width());


    ui.map.createAbstractMap();
    ui.map.draw([
            {
                XCoord: 4,
                YCoord: 3,
                TileName: "tileGrass",
                buildings: [
                    {
                        TileName: "stoneDoorRight"
                    },
                    {
                        TileName: "sandRing"
                    },
                    {
                        TileName: "stoneRing"
                    },
                    {
                        TileName: "sandRing"
                    },
                    {
                        TileName: "stoneDoorWindowBlindsMirror"
                    },
                    {
                        TileName: "stoneRoofPointy"
                    }
                ],
                decorate: []
            },
            {
                XCoord: 0,
                YCoord: 0,
                TileName: "tileGrass_tile",
                buildings: [],
                decorate: []
            },
            {
                XCoord: 3,
                YCoord: 4,
                TileName: "tileGrass",
                buildings: [],
                decorate: []
            },
            {
                XCoord: 5,
                YCoord: 4,
                TileName: "tileMagic",
                buildings: [],
                decorate:
                    [
                        {
                            TileName: "treeCactus_3"
                        }
                    ]
            }
    ]);

    shex.init();

    bcui.init([
        {
            TileName: "tileGrass",
            texture: ui.texture_ground
        },
        {
            TileName: "tileMagic",
            texture: ui.texture_ground
        },
        {
            TileName: "woodDoorWindow",
            texture: ui.texture_building
        }, {
            TileName: "stoneDoorWindow",
            texture: ui.texture_building
        }
    ]);
}