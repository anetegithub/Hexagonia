function showmain() {
    $('#index').css('display', 'none');
    $('#main').css('display', 'block');
    var canvas = document.getElementById("display"),
        content = canvas.getContext('2d'),
        dcanvas = document.querySelector('#display_decorations'),
        dcontent = dcanvas.getContext('2d');

    if ((navigator.userAgent.toLowerCase().indexOf("windows phone") != -1))
        h = 640 - $('#bot').outerHeight(true) * 2

    OneBlockPosition = {
        X: (window.innerWidth - 10) / FieldSize.X,
        Y: window.innerHeight / (FieldSize.Y + 1)
    };

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


    html = "&nbsp<button type='button' class='btn btn-success navbar-btn' ><span class='fa fa-2x fa-money'></span></button>";
    html += "&nbsp<button type='button' class='btn btn-success navbar-btn' onclick='ui.changeView(View.Movement);' ><span class='fa fa-2x fa-street-view'></span></button>";
    html += "&nbsp<button type='button' id='hexTopBtn' class='btn btn-success navbar-btn'><canvas id='hexTop' height='" + rectangles + "' width='" + rectangles + "'></canvas></button>";
    html += "&nbsp<button type='button' class='btn btn-success navbar-btn' onclick='ui.changeView(View.Building);' ><span class='fa fa-2x fa-building'></span></button>";
    html += "&nbsp<button type='button' class='btn btn-success navbar-btn' onclick='delitingTool()' ><span class='fa fa-2x fa-recycle'></span></button>";
    $('#top').html(html);

    $('body').css('padding-top', $('#top').outerHeight().toString() + 'px');

    content.canvas.height = window.innerHeight - $('#bot').outerHeight(true) * 2.1;
    content.canvas.width = window.innerWidth - 10;

    dcontent.canvas.height = window.innerHeight - $('#bot').outerHeight(true) * 2.1;
    dcontent.canvas.width = window.innerWidth - 10;



    ui.map.createAbstractMap(false);
    //ui.map.draw([
    //        {
    //            XCoord: 4,
    //            YCoord: 3,
    //            TileName: "tileGrass",
    //            buildings: [
    //                {
    //                    TileName: "stoneDoorRight"
    //                },
    //                {
    //                    TileName: "sandRing"
    //                },
    //                {
    //                    TileName: "stoneRing"
    //                },
    //                {
    //                    TileName: "sandRing"
    //                },
    //                {
    //                    TileName: "stoneDoorWindowBlindsMirror"
    //                },
    //                {
    //                    TileName: "stoneRoofPointy"
    //                }
    //            ],
    //            decorate: []
    //        },
    //        {
    //            XCoord: 0,
    //            YCoord: 0,
    //            TileName: "tileGrass_tile",
    //            buildings: [],
    //            decorate: []
    //        },
    //        {
    //            XCoord: 3,
    //            YCoord: 4,
    //            TileName: "tileGrass",
    //            buildings: [],
    //            decorate: []
    //        },
    //        {
    //            XCoord: 5,
    //            YCoord: 4,
    //            TileName: "tileMagic",
    //            buildings: [],
    //            decorate:
    //                [
    //                    {
    //                        TileName: "treeCactus_3"
    //                    }
    //                ]
    //        }
    //]);

    shex.init();

    bcui.init([
        {
            block: { TileName: "tileMagic", Layer: 0, Source: "images/build/ground.json", SourceY: 0, Land: Land.Baseland },
            texture: ui.texture_ground
        },
        {
            block: { TileName: "tileMagic", Layer: 1, Source: "images/build/ground.json", SourceY: 0, Land: Land.Building },
            texture: ui.texture_ground
        },
        {
            block: { TileName: "rockStone_moss3", Layer: 1, Source: "images/build/ground.json", SourceY: 0, Land: Land.Loft },
            texture: ui.texture_building
        },
        {
            block: { TileName: "stoneDoorWindow", Layer: 1, Source: "images/build/building.json", SourceY: 509, Land: Land.Building },
            texture: ui.texture_building
        },
        {
            block: { TileName: "redRoofTall", Layer: 1, Source: "images/build/building.json", SourceY: 509, Land: Land.Loft },
            texture: ui.texture_building
        },
        {
            block: { TileName: "rockGateLeft", Layer: 1, Source: "images/build/building.json", SourceY: 509, Land: Land.Building },
            texture: ui.texture_building
        },
        {
            block: { TileName: "rockRing", Layer: 1, Source: "images/build/building.json", SourceY: 509, Land: Land.Building },
            texture: ui.texture_building
        },
        {
            block: { TileName: "woodRoofPointy", Layer: 1, Source: "images/build/building.json", SourceY: 509, Land: Land.Loft },
            texture: ui.texture_building
        },
        {
            block: { TileName: "flowerRed", Layer: 1, Source: "images/build/ground.json", SourceY: 0, Land: Land.Roof },
            texture: ui.texture_building
        }
    ]);
}

