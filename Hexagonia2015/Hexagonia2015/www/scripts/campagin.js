var campw = {
    location: [],
    run: function () {
        var centerX = Math.floor(Player.Field.X / 2),
            centerY = Math.floor(Player.Field.Y / 2);
        var campagin = [
            {
                X: centerX,
                Y: centerY,
                Base: {
                    TileName: "tileMagic",
                    Layer: 0,
                    Source: "images/buildings/ground.json",
                    SourceY: 0,
                    Land: 0,
                    Cost: 0,
                    Currency: 0,
                    State: Process.End
                },
                Decorate: []
            },
            {
                X: centerX - 1,
                Y: centerY + 1,
                Base: {
                    TileName: "tileSnow",
                    Layer: 0,
                    Source: "images/buildings/ground.json",
                    SourceY: 0,
                    Land: 0,
                    Cost: 0,
                    Currency: 0,
                    State: Process.Yes
                },
                Decorate: []
            },
            {
                X: centerX - 1,
                Y: centerY,
                Base: {
                    TileName: "tileSand",
                    Layer: 0,
                    Source: "images/buildings/ground.json",
                    SourceY: 0,
                    Land: 0,
                    Cost: 0,
                    Currency: 0,
                    State: Process.None
                },
                Decorate: []
            },
            {
                X: centerX - 1,
                Y: centerY - 1,
                Base: {
                    TileName: "tileStone",
                    Layer: 0,
                    Source: "images/buildings/ground.json",
                    SourceY: 0,
                    Land: 0,
                    Cost: 0,
                    Currency: 0,
                    State: Process.None
                },
                Decorate: []
            },
            {
                X: centerX,
                Y: centerY - 1,
                Base: {
                    TileName: "tileAutumn",
                    Layer: 0,
                    Source: "images/buildings/ground.json",
                    SourceY: 0,
                    Land: 0,
                    Cost: 0,
                    Currency: 0,
                    State: Process.None
                },
                Decorate: []
            },
            {
                X: centerX + 1,
                Y: centerY,
                Base: {
                    TileName: "tileLava",
                    Layer: 0,
                    Source: "images/buildings/ground.json",
                    SourceY: 0,
                    Land: 0,
                    Cost: 0,
                    Currency: 0,
                    State: Process.None
                },
                Decorate: []
            },
            {
                X: centerX,
                Y: centerY + 1,
                Base: {
                    TileName: "tileGrass",
                    Layer: 0,
                    Source: "images/buildings/ground.json",
                    SourceY: 0,
                    Land: 0,
                    Cost: 0,
                    Currency: 0,
                    State: Process.None
                },
                Decorate: []
            },
            {
                X: centerX,
                Y: centerY + 2,
                Base: {
                    TileName: "tileWater",
                    Layer: 0,
                    Source: "images/buildings/ground.json",
                    SourceY: 0,
                    Land: 0,
                    Cost: 0,
                    Currency: 0,
                    State: Process.None
                },
                Decorate: []
            },
            {
                X: centerX,
                Y: centerY - 2,
                Base: {
                    TileName: "tileRock",
                    Layer: 0,
                    Source: "images/buildings/ground.json",
                    SourceY: 0,
                    Land: 0,
                    Cost: 0,
                    Currency: 0,
                    State: Process.None
                },
                Decorate: []
            }
        ];
        bcui.campagin();
        this.location = campagin;
        ui.map.afterDraw = this._draw.pins;
        ui.map.draw(campagin);
        CampaginTime = true;
        this.init();
    },
    init: function () {
        dcanvaselement.addEventListener('click', function () {
            if (CampaginTime) {
                var Coords = ui.map.getAbstractHex(ui.mousePos); // ui.map.positionByBlockType(BLOCK.BASE),
                if (Coords != undefined) {
                    //Coords have x and y
                    var Area = Enumerable
                        .From(campw.location)
                        .Where(function (x) { if (x.X == Coords.x && x.Y == Coords.y) return x; })
                        .Select(function (x) { return x; })
                        .ToArray();

                    if (Area.length > 0) {
                        var size = ($('#display-wrapper').width() - 5) / 7;
                        if (Area[0].Base.State == Process.End) {
                            var data={
                                IsGold:false,
                                IsCrystal:false,
                                IsBlock: true,
                                Data:{
                                    TileName: "tileGrass",
                                    Layer: 0,
                                    Source: "images/buildings/ground.json",
                                    SourceY: 0, //number of plus by Y coord, cuz merged tiles have Y shift
                                    Land: 0,
                                    Cost: 50,
                                    Currency: 0,
                                    State: 0
                                }
                            };
                            data.IsBlock = false;
                            data.IsGold = false;
                            data.IsCrystal = true;
                            data.Data = 50;

                            campw.reward_data = data;

                            loading.show();
                            alert("ajax to server");//new player object, info about gold/cryst/block
                            loading.hide();
                            var box = bootbox.dialog({
                                closeButton: false,
                                title: "<div class='text-center'>Reward</label><script>$('.modal-footer').html(\"<div class='text-center'><button class='btn btn-success form-control'>Ok</button></div>\");",
                                message: "<div class='text-center'><canvas id='rewardcanvas' width='" + size.toString() + "' height='" + size.toString() + "'></canvas><script>campw.reward();</script></div>",
                                buttons: { success: { label: "Ok", className: "btn-success", callback: function () { } } }
                            });
                            box.css({
                                'top': '50%',
                                'margin-top': function () {
                                    return -(box.height() / 2);
                                }
                            });
                        } else if (Area[0].Base.State == Process.Yes) {
                            //$('.progress-bar').css('width', valeur + '%').attr('aria-valuenow', valeur);
                            var bar = "<div class='progress'><div class='progress-bar' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100' style='width:75%;color:black;background-color:#ffd800'></div></div>";
                        }
                    }

                    ui.map.draw(campw.location);
                }
            }
        });
    },
    reward_data:null,
    reward: function(){
        var img = new Image(),
            size = ($('#display-wrapper').width() - 5) / 7,
            data = this.reward_data;

        var script = function () {
            var canvas = document.querySelector('#rewardcanvas'),
               context = canvas.getContext('2d'),
               offsetX = 0,
               offsetY = 0,
               rectX = img.width,
               rectY = img.height,
               X = 0,
               Y = 0,
               SizeX = size,
               SizeY = size;

            if (data.IsBlock) {
                var Tiles = Enumerable
                    .From(sourceJson(data.Data.Source))
                    .Where(function (x) { if (x.Name == data.Data.TileName) return x; })
                    .Select(function (x) { return x; })
                    .ToArray();
                if (Tiles.length > 0) {
                    var Tile = Tiles[0];
                    offsetX = Tile.X, offsetY = Tile.Y, rectX = Tile.Width, rectY = Tile.Height;
                }
            }
            context.drawImage(img, offsetX, offsetY, rectX, rectY, X, Y, SizeX, SizeY);


            if (data.IsGold || data.IsCrystal) {
                var Size = (window.innerWidth - 5) / 7;
                var costlenght = (data.Data.toString().length * ((Size / 2.3) / 2));

                context.font = (Size*0.5).toString() + "px Arial";
                context.fillText(data.Data, Size - ((Size / 3) + (costlenght)), Size - (Size / 3));
            }
        };

        if (data.IsBlock) {
            img.src = ui.texture_merged;
            img.onload = script;
        }
        else {
            if (data.IsGold)
                img = StaticImages.gold;
            if (data.IsCrystal)
                img = StaticImages.crystal;
            script();
        }

    },
    _draw: {
        pins: function () {
            var canvas = document.createElement('canvas');
            canvas.width = dContent.canvas.width;
            canvas.height = dContent.canvas.height;
            var context = canvas.getContext('2d');

            campw.location.forEach(function (block) {
                var X = block.X * OneBlockPosition.X,
                    Y = block.Y * (OneBlockPosition.Y / 1.35),
                    SizeX = OneBlockPosition.X / 1.5,
                    SizeY = (OneBlockPosition.Y * 1.4) / 2,
                    img = null;

                if (block.Y % 2 != 0)
                    X += OneBlockPosition.X / 2;

                Y += SizeY / 5;
                X += SizeX / 2;

                if (block.Base.State == Process.None)
                    img = new Image();
                else if (block.Base.State == Process.Yes)
                    img = StaticImages.flagRed;
                else if (block.Base.State = Process.End)
                    img = StaticImages.flagGreen;

                context.drawImage(img, 0, 0, img.width, img.height, X, Y, SizeX, SizeY);
            });

            dContent.drawImage(canvas, 0, 0);
        }
    },
}