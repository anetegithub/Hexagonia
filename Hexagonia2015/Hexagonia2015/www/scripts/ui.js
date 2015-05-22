var grounds = null,
    buildings = null,
    merged = null;

var View = {
    Movement: 0,
    Building: 1,
    Neighbor: 2
}

var StaticImages = {
    gold: new Image(),
    crystal: new Image(),
    right: new Image(),
    down: new Image(),
    check: new Image(),
    load: function () {
        this.gold.onload = function () { };
        this.crystal.onload = function () { };
        this.right.onload = function () { };
        this.down.onload = function () { };
        this.check.onload = function () { };
        this.check.src = "images/additional/check.png";
        this.gold.src = "images/additional/gold.png";
        this.crystal.src = "images/additional/crystal.png";
        this.down.src = "images/additional/down.png";
        this.right.src = "images/additional/right.png";
    }
};

function sourceJson(source) {
    if (source == "images/buildings/ground.json")
        return grounds;
    else if (source == "images/buildings/building.json")
        return buildings;
}

function delitingTool() {
    if (ui.currentView == View.Building)
        shex.texture({ Layer: -1, TileName: "none" });
}

var canvaselement = document.querySelector('#display'),
    Content = canvaselement.getContext('2d'),
    dcanvaselement = document.querySelector('#display_decorations'),
    dContent = dcanvaselement.getContext('2d');

//User Interface
var ui = {
    currentView: View.Movement,
    neighborData: null,
    neighborWindow: function(){
        bootbox.dialog({
            title: "Visit the land of another player",
            message: '<div class="row">' +
            '<div class="col-md-12">' +
                '<form class="form-horizontal">' +
                   ' <div class="form-group">' +
                        '<label class="col-md-4 control-label" for="name">Name</label>' +
                        '<div class="col-md-4">' +
                         '<input id="name" name="name" type="text" placeholder="Enter nickname another player" class="form-control input-md">' +
                        '</div>' +
                    '</div>' +
                '</form>' +
            '</div>' +
        '</div>' + '<div class="row">' +
            '<div class="col-md-12">' +
                '<form class="form-horizontal">' +
                   ' <div class="form-group">' +
                        '<label class="col-md-4 control-label" for="name">Friends</label>' +
                        '<div class="col-md-4">' +
                         frlist.getHtml() +
                        '</div>' +
                    '</div>' +
                '</form>' +
            '</div>' +
        '</div>',
            buttons: {
                success: {
                    label: "Find",
                    className: "btn-success",
                    callback: function () {
                        //send server side and see result
                        //emulate
                        var neighbordata = {
                            Avatar: "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",
                            Map: [
                            {
                                X: 0, Y: 0, Base: {
                                    TileName: "tileGrass",
                                    Layer: 0,
                                    Source: "images/buildings/ground.json",
                                    SourceY: 0,
                                    Land: 0
                                },
                                Decorate: []
                            }
                            ],
                            Field: {
                                X: 15,
                                Y: 25
                            },
                            Login: $('#name').val()
                        };
                        ui.neighborData = neighbordata;
                        ui.changeView(View.Neighbor);
                    }
                }
            }
        });
    },
    cursorCoord: function () {
        var x = (this.mousePos.x) / 32,
                y = (this.mousePos.y) / 32;
        x = Math.floor(x);
        y = Math.floor(y);
        return { X: x, Y: y };
    },
    mousePos: null,
    scale: 0,
    init: function () {
        $.ajax({
            url: 'images/buildings/ground.json',
            type: 'get',
            async: false,
            success: function (data) {
                if (typeof data == "string")
                    grounds = JSON.parse(data);
                else
                    grounds = data;
                merged = grounds;
            }
        });
        $.ajax({
            url: 'images/buildings/building.json',
            type: 'get',
            async: false,
            success: function (data) {
                if (typeof data == "string")
                    buildings = JSON.parse(data);
                else
                    buildings = data;
            }
        });

        dcanvaselement.addEventListener('mousemove', function (evt) {
            var rect = canvaselement.getBoundingClientRect();
            ui.mousePos = {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }, false);
        dcanvaselement.addEventListener('click', function () {
            if (BuildingTime) {
                if (shex.texture() != undefined && shex.texture() != "null") {

                    var Coords = ui.map.getAbstractHex(ui.mousePos); // ui.map.positionByBlockType(BLOCK.BASE),
                    if (Coords != undefined) {
                        var Block = shex.texture(),
                            Obj =
                            {
                                X: Coords.x,
                                Y: Coords.y,
                                Base: null,
                                Decorate: []
                            },
                            Cell = Enumerable
                                .From(ui.map.cellArray)
                                .Where(function (x) { if (x.X == Coords.x && x.Y == Coords.y) return x; })
                                .Select(function (x) { return x; }).ToArray();

                        if (Block.Layer == 0)
                            Obj.Base = Block;

                        if (Block.Layer != -1) {

                            if (Cell.length == 1) {
                                var index = ui.map.cellArray.indexOf(Cell[0]);

                                if (Block.Layer == 0)
                                    Cell[0].Base = Block;
                                else
                                    if (ui.map.landAccess(Cell[0], Block))
                                        Cell[0].Decorate.push(Block);
                                ui.map.cellArray[index] = Cell[0];
                                aud.installblock();
                                aud.play_sound();
                            } else {
                                if (Block.Layer == 0) {
                                    ui.map.cellArray.push(Obj);
                                    aud.installblock();
                                    aud.play_sound();
                                }
                                else
                                    bootbox.dialog({
                                        message: "Can not put the decorations without basic land",
                                        title: "Hey cap we've got a situation!",
                                        buttons: {
                                            success: {
                                                label: "Ok",
                                                className: "btn-success"
                                            }
                                        }
                                    });
                            }
                        }
                        else {
                            if (Cell.length == 1) {
                                var index = ui.map.cellArray.indexOf(Cell[0]);

                                if (Cell[0].Decorate.length != 0)
                                    Cell[0].Decorate.splice(Cell[0].Decorate.length - 1, 1);
                                else
                                    ui.map.cellArray.splice(index, 1);

                                aud.removeblock();
                                aud.play_sound();
                            } else
                                bootbox.dialog({
                                    message: "Nothing to to destroy!",
                                    title: "Hey cap we've got a situation!",
                                    buttons: {
                                        success: {
                                            label: "Ok",
                                            className: "btn-success"
                                        }
                                    }
                                });
                        }
                        ui.map.refresh();
                    }
                }
            }
        });
    },
    texture_ground: "images/buildings/ground.png",
    texture_building: "images/buildings/building.png",
    texture_merged: "images/buildings/merged.png",
    drawOnPictureGround: function (drawing) {
        var Img = new Image();
        Img.src = ui.texture_ground;
        Img.onload = function () {
            drawing(Img);
        };
        return Img;
    },
    drawOnPictureMerged: function (drawing) {
        var Img = new Image();
        Img.src = ui.texture_merged;
        Img.onload = function () {
            drawing(Img);
        };
        return Img;
    },
    drawOnPictureBuilding: function (drawing) {
        var Img = new Image();
        Img.src = ui.texture_building;
        Img.onload = function () {
            drawing(Img);
        };
        return Img;
    },
    drawIcon: function (block, Canvas, Size) {
        var pic = new Image();

        if (block.TileName != undefined && block.TileName != "Custom")
            pic.src = ui.texture_merged;
        else if (block.TileName == "Custom")
            pic.src = block.src;        

        pic.onload = function () {

            var preCanvas = document.createElement('canvas');
            preCanvas.width = Canvas.width;
            preCanvas.height = Canvas.height;
            preContent = preCanvas.getContext('2d');

            Canvas.width = Canvas.width;

            if (block != "null") {
                if (block.Layer != -1 && block.TileName != "Custom") {
                    var Cell = Enumerable
                            .From(sourceJson(block.Source))
                            .Where(function (x) { if (x.Name == block.TileName) return x; })
                            .Select(function (x) { return x; }).ToArray()[0];

                    var x = 0, y = 0, SizeX = Size, SizeY = Size;

                    if (Cell.Width < Size) {
                        x += (Size - Cell.Width) / 2;
                        SizeX = Cell.Width;
                    }

                    if (Cell.Height < Size) {
                        y += (Size - Cell.Height) / 2;
                        SizeY = Cell.Height;
                    }

                    preContent.drawImage(pic, Cell.X, Cell.Y + block.SourceY, Cell.Width, Cell.Height, x, y, SizeX, SizeY);
                    preContent.fillStyle = "#000000";
                    preContent.font = "bold 15px Arial";

                    if (block.Cost == undefined || block.Cost == 0) {
                        var sign = "";
                        switch (block.Land) {
                            case 0: { sign = "B"; break; }
                            case 1: { sign = "D"; break; }
                            case 2: { sign = "L"; break; }
                            case 3: { sign = "R"; break; }
                        }
                    } else {
                        //var img = null;
                        //if (block.Currency == Currency.Gold)
                        //    img = StaticImages.gold;
                        //else if (block.Currency == Currency.Crystal)
                        //    img = StaticImages.crystal;

                        //preContent.strokeStyle = "arial 10px #FFF";
                        //preContent.drawImage(img, 0, 0, img.width, img.height, Size - (Size / 3), Size - (Size / 3), Size / 3, Size / 3);
                        //preContent.strokeText(block.Cost, (Size - (Size / 3)) - (block.Cost.toString().length * 10), Size / 3);
                        //content = Canvas.getContext('2d');
                        //content.drawImage(preCanvas, 0, 0);                        

                    }

                    preContent.fillText(sign, SizeY - 10, 15);
                }
                else if (block.Layer == -1) {
                    preContent.fillStyle = "#fff";
                    preContent.font = "bold 50px Arial";
                    preContent.fillText("X", (Size - 35) / 2, (Size + 35) / 2);
                } else if (block.TileName == "Custom") {

                    var x = 0,
                        y = 0,
                        SizeX = Size,
                        SizeY = Size;

                    if (pic.width < Size) {
                        x += (Size - pic.width) / 2;
                        SizeX = pic.width;
                    }

                    if (pic.height < Size) {
                        y += (Size - pic.height) / 2;
                        SizeY = pic.height;
                    }

                    preContent.drawImage(pic, 0, 0, pic.height, pic.width, x, y, SizeX, SizeY);
                }
            }

            content = Canvas.getContext('2d');
            content.drawImage(preCanvas, 0, 0);
        }
    },
    clearCanvas: function (canvas) {
        canvas.width = canvas.width;
    },
    map: {
        _abstractMap: [],
        getAbstractMap: function () {
            return this._abstractMap;
        },
        getAbstractHex: function (Coords) {
            var abstractCoords = Enumerable
                .From(this._abstractMap)
                .Where(function (x) {
                    if (pnpoly(x, Coords) == 1)
                        return x;
                    //if (isPointInHexagon(Coords, x))
                    //    return x;
                })
                .Select(function (x) { return x; })
                .ToArray();

            if (abstractCoords.length > 0)
                if (abstractCoords.length > 1) {
                    if (abstractCoords.length % 2 == 0)
                        return abstractCoords[abstractCoords.length / 2 + 1];
                    else
                        return abstractCoords[abstractCoords.length / 2 + 0.5];
                } else
                    return abstractCoords[0];

            return undefined;
        },
        createAbstractMap: function (drawHexagons) {
            for (var j = 0; j < FieldSize.Y; j++) {
                var cy = j * (OneBlockPosition.Y / 1.35)//49;
                if (j % 2 == 0) {
                    for (var i = 0; i < FieldSize.X; i++) {
                        var cx = OneBlockPosition.X / 2 + (OneBlockPosition.X * i);

                        var tempobj = [];
                        tempobj.y = j;
                        tempobj.x = i;

                        tempobj.push({ x: cx, y: cy });
                        tempobj.push({ x: cx - OneBlockPosition.X / 2, y: cy + (OneBlockPosition.Y / 4) });
                        tempobj.push({ x: cx - OneBlockPosition.X / 2, y: cy + (OneBlockPosition.Y / 4) * 3 });
                        tempobj.push({ x: cx, y: cy + OneBlockPosition.Y });
                        tempobj.push({ x: cx + OneBlockPosition.X / 2, y: cy + (OneBlockPosition.Y / 4) * 3 });
                        tempobj.push({ x: cx + OneBlockPosition.X / 2, y: cy + (OneBlockPosition.Y / 4) });

                        if (drawHexagons) {

                            dContent.strokeStyle = "#ff0000";

                            dContent.beginPath();
                            dContent.moveTo(cx, cy);

                            dContent.lineTo(cx, cy);
                            dContent.lineTo(cx - OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4));
                            dContent.lineTo(cx - OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4) * 3);
                            dContent.lineTo(cx, cy + OneBlockPosition.Y);
                            dContent.lineTo(cx + OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4) * 3);
                            dContent.lineTo(cx + OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4));

                            dContent.lineTo(cx, cy);

                            dContent.stroke();
                            dContent.closePath();
                        }

                        this._abstractMap.push(tempobj);
                    }
                } else {
                    for (var i = 0; i < FieldSize.X - 1; i++) {
                        var cx = OneBlockPosition.X / 2 + (OneBlockPosition.X * i);
                        cx += OneBlockPosition.X / 2;

                        var tempobj = [];
                        tempobj.y = j;
                        tempobj.x = i;
                        tempobj.push({ x: cx, y: cy });
                        tempobj.push({ x: cx - 32.5, y: cy + 17 });
                        tempobj.push({ x: cx - 32.5, y: cy + 51 });
                        tempobj.push({ x: cx, y: cy + 68 });
                        tempobj.push({ x: cx + 32.5, y: cy + 51 });
                        tempobj.push({ x: cx + 32.5, y: cy + 17 });

                        if (drawHexagons) {

                            dContent.strokeStyle = "#ff0000";

                            dContent.beginPath();
                            dContent.moveTo(cx, cy);

                            dContent.lineTo(cx, cy);
                            dContent.lineTo(cx - OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4));
                            dContent.lineTo(cx - OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4) * 3);
                            dContent.lineTo(cx, cy + OneBlockPosition.Y);
                            dContent.lineTo(cx + OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4) * 3);
                            dContent.lineTo(cx + OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4));

                            dContent.lineTo(cx, cy);

                            dContent.stroke();
                            dContent.closePath();
                        }

                        this._abstractMap.push(tempobj);
                    }
                }
            }
        },
        landAccess: function (block, decore) {
            if (block.Decorate.length > 0)
                if (3 + block.Y == block.Decorate.length) {
                    bootbox.dialog({
                        message: "This is the highest level of construction...",
                        title: "Hey cap we've got a situation!",
                        buttons: {
                            success: {
                                label: "Ok",
                                className: "btn-success"
                            }
                        }
                    });
                    return false;
                }
                else if (block.Decorate[block.Decorate.length - 1].Land == Land.Roof) {
                    bootbox.dialog({
                        message: "This is the highest level of construction...",
                        title: "Hey cap we've got a situation!",
                        buttons: {
                            success: {
                                label: "Ok",
                                className: "btn-success"
                            }
                        }
                    });
                    return false;
                }
                else if (block.Decorate[block.Decorate.length - 1].Land == Land.Loft && decore.Land == Land.Loft) {
                    bootbox.dialog({
                        message: "You can install only one loft to build...",
                        title: "Hey cap we've got a situation!",
                        buttons: {
                            success: {
                                label: "Ok",
                                className: "btn-success"
                            }
                        }
                    });
                    return false;
                }
                else if (block.Decorate[block.Decorate.length - 1].Land == Land.Roof && decore.Land == Land.Roof) {
                    bootbox.dialog({
                        message: "You can install only one spire to build...",
                        title: "Hey cap we've got a situation!",
                        buttons: {
                            success: {
                                label: "Ok",
                                className: "btn-success"
                            }
                        }
                    });
                    return false;
                }
                else if (block.Decorate[block.Decorate.length - 1].Land > decore.Land) {
                    bootbox.dialog({
                        message: "Follow order: the base land, construction, loft spire.",
                        title: "Hey cap we've got a situation!",
                        buttons: {
                            success: {
                                label: "Ok",
                                className: "btn-success"
                            }
                        }
                    });
                    return false;
                }

            return true;
        },
        cellArray: [],          // see sampleTileInfoClass
        draw: function (cellArray) {
            if (ui.currentView == View.Neighbor) {
                FieldSize = ui.neighborData.Field;
                OneBlockPosition = {
                    X: (window.innerWidth - 10) / FieldSize.X,
                    Y: window.innerHeight / (FieldSize.Y + 1)
                };
            } else {
                FieldSize = Player.Field;
                OneBlockPosition = {
                    X: (window.innerWidth - 10) / FieldSize.X,
                    Y: window.innerHeight / (FieldSize.Y + 1)
                };
            }

            ui.map.tempArray = cellArray;
            var drawing = function (pic) {


                canvaselement.width = canvaselement.width;
                dcanvaselement.width = dcanvaselement.width;

                //Content.clearRect(0, 0, Content.canvas.width, Content.canvas.height);
                //dContent.clearRect(0, 0, Content.canvas.width, Content.canvas.height);

                var preCanvas = document.createElement('canvas');
                preCanvas.width = canvaselement.width;
                preCanvas.height = canvaselement.height;
                var preContent = preCanvas.getContext('2d');

                var Map = Enumerable
                    .From(cellArray)
                    .OrderBy(function (x) { return x.Y })
                    .ToArray();

                Map.forEach(function (TileInfo) {
                    var X = TileInfo.X * OneBlockPosition.X,
                        Y = TileInfo.Y * (OneBlockPosition.Y / 1.35),
                        Tile = Enumerable
                            .From(sourceJson(TileInfo.Base.Source))
                            .Where(function (x) { if (x.Name == TileInfo.Base.TileName) return x; })
                            .Select(function (x) { return x; })
                            .ToArray()[0];

                    if (TileInfo.Y % 2 != 0)
                        X += OneBlockPosition.X / 2;

                    preContent.drawImage(pic, Tile.X, Tile.Y, Tile.Width, Tile.Height, X, Y, OneBlockPosition.X, OneBlockPosition.Y * 1.4);
                });

                Content.drawImage(preCanvas, 0, 0);

                preCanvas = document.createElement('canvas');
                preCanvas.width = dcanvaselement.width;
                preCanvas.height = dcanvaselement.height;
                preContent = preCanvas.getContext('2d');

                if (BuildingTime) {
                    for (var j = 0; j < FieldSize.Y; j++) {
                        var cy = j * (OneBlockPosition.Y / 1.35)//49;

                        var somevariable = 0;
                        if (j % 2 != 0)
                            somevariable = 1;

                        for (var i = 0; i < FieldSize.X - somevariable; i++) {
                            var cx = OneBlockPosition.X / 2 + (OneBlockPosition.X * i);
                            if (j % 2 != 0)
                                cx += OneBlockPosition.X / 2;

                            preContent.beginPath();
                            preContent.moveTo(cx, cy);

                            preContent.lineTo(cx, cy);
                            preContent.lineTo(cx - OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4));
                            preContent.lineTo(cx - OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4) * 3);
                            preContent.lineTo(cx, cy + OneBlockPosition.Y);
                            preContent.lineTo(cx + OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4) * 3);
                            preContent.lineTo(cx + OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4));

                            preContent.lineTo(cx, cy);

                            preContent.stroke();
                            preContent.closePath();
                        }
                    }
                }

                Map.forEach(function (TileInfo) {
                    var X = TileInfo.X * OneBlockPosition.X,
                        Y = TileInfo.Y * (OneBlockPosition.Y / 1.35),
                        Level = OneBlockPosition.Y / 3;
                    if (TileInfo.Y % 2 != 0)
                        X += OneBlockPosition.X / 2;
                    TileInfo.Decorate.forEach(function (DecorTileInfo) {
                        Tile = Enumerable
                            .From(sourceJson(DecorTileInfo.Source))
                            .Where(function (x) { if (x.Name == DecorTileInfo.TileName) return x; })
                            .Select(function (x) { return x; })
                            .ToArray()[0];

                        var width = Tile.Width * ScaleFactor.X,
                            height = Tile.Height * ScaleFactor.Y;

                        if (height > 68) {
                            if (height < OneBlockPosition.Y * 1.4)
                                Y += OneBlockPosition.Y * 1.4 - height;
                        } else
                            Y += (OneBlockPosition.Y * 1.4 - height) / 1.5;



                        preContent.drawImage(pic, Tile.X, Tile.Y + DecorTileInfo.SourceY, Tile.Width, Tile.Height,
                            X + (width < OneBlockPosition.X ? (OneBlockPosition.X - width) / 2 : 0),
                            Y - Level, width,
                            height);
                        Level += (height / 3) * (OneBlockPosition.Y * 1.2 / height);
                    });
                });

                dContent.drawImage(preCanvas, 0, 0);
            }
            ui.drawOnPictureMerged(drawing);
        },
        redraw: function (cell) {
            alert('sf');
            //var pic = ui.picture_ground(),
            //    x = 14 + (32 * cell.XCoord),
            //    y = 9 + (44 * cell.YCoord),
            //    canvas = ui.map.getCanvas();

            //canvas.drawImage(pic, cell.X, cell.Y, cell.Width, cell.Height, x, y, cell.Width, cell.Height);

            //for (var i = 0; i < cell.buildings.length; i++) {
            //    var layer = cell.buildings[i],
            //        pic_b = ui.picture_building();

            //    canvas.drawImage(pic_b, layer.X, layer.Y, layer.Width, layer.Height, x, y, layer.Width, layer.Height);
            //}

            //draw near cells by priority (wtf, priority - ?)
        },
        getCanvas: function () {
            var canvasElement = document.querySelector('#display'),
                 canvas = canvasElement.getContext('2d');
            return canvas;
        },
        refresh: function () {
            this.draw(this.cellArray);
        },
        positionByBlockType: function (typeBLOCK) {
            var Coords = ui.cursorCoord();
            if (typeBLOCK == BLOCK.BASE) {
                if (Coords.Y % 2 == 0) {
                    if (Coords.X % 2 != 0)
                        Coords.X += 1;
                } else
                    if (Coords.X % 2 == 0)
                        Coords.X += 1;
                if (Coords.X >= 8)
                    if (Coords.Y % 2 == 0)
                        Coords.X = 8;
                    else
                        Coords.X = 7;
                return Coords;
            }
        }
    },
    changeView: function (viewType) {
        this.currentView = viewType;
        shex.changeMode(viewType);
        if (viewType == View.Building) {
            BuildingTime = true;
            bcui.build();
            this.map.refresh();
            shex.enable();
            this._UiEnabled(true);
        } else if (viewType == View.Movement) {
            BuildingTime = false;
            shex.click();
            bcui.menu();
            this.map.refresh();
            shex.enable();
            this._UiEnabled(true);
        } else if (viewType == View.Neighbor) {
            shex.click();
            shex.disable();
            this._UiEnabled(false);
            BuildingTime = false;
            bcui.neigbor();
            this.map.draw(this.neighborData.Map);
        }
    },
    _UiEnabled: function (enabled) {
        if (enabled) {
            $('#marketBtn').removeAttr('disabled');
            $('#playBtn').removeAttr('disabled');
            $('#buildBtn').removeAttr('disabled');
            $('#deleteBtn').removeAttr('disabled');
        } else {
            $('#marketBtn').attr('disabled', 'disabled');
            $('#playBtn').attr('disabled', 'disabled');
            $('#buildBtn').attr('disabled', 'disabled');
            $('#deleteBtn').attr('disabled', 'disabled');
        }
    }
};

//Selected block 'hex' container
var shex = {
    init: function () {
        document.querySelector('#hexTopBtn').addEventListener('click', this.click);
        this._canvas = document.querySelector('#hexTop');
    },
    click: function () {
        var canvas = document.querySelector('#hexTop'),
                content = canvas.getContext('2d');
        content.clearRect(0, 0, content.canvas.width, content.canvas.height);
        shex.texture("null");
    },
    _block: "null",
    _tiletable: ui.texture_ground,
    texture: function (block) {
        if (block == undefined)
            return this._block;

        this._block = block;

        this.refresh();

        return this._block;
    },
    table: function () {
        return this._tiletable;
    },
    _canvas: null,
    refresh: function () {
        var canvas = document.querySelector('#hexTop'),
              content = canvas.getContext('2d');
        content.clearRect(0, 0, content.canvas.width, content.canvas.height);
        ui.drawIcon(this._block, this._canvas, this._canvas.width);
    },
    disable: function () {
        $('#hexTopBtn').attr('disabled', 'disabled');
    },
    enable: function () {
        $('#hexTopBtn').removeAttr('disabled');
    },
    changeMode: function (viewState) {
        if (viewState == View.Movement) {
            document.querySelector('#hexTopBtn').removeEventListener('click', this.click);
            ui.drawIcon({ TileName: "Custom", src: "data:image/png;base64," + Player.Avatar }, this._canvas, this._canvas.width);
        } else if (viewState == View.Building) {
            this.texture("null");
            document.querySelector('#hexTopBtn').addEventListener('click', this.click);
        } if (viewState == View.Neighbor) {
            document.querySelector('#hexTopBtn').removeEventListener('click', this.click);
            ui.drawIcon({ TileName: "Custom", src: "data:image/png;base64," + ui.neighborData.Avatar }, this._canvas, this._canvas.width);
        }
    }
}

//Bottom interface, block of carousel
var bcui = {
    _state: -1,
    resetState: function () { this._state = -1;},
    _blocks: [],
    init: function (arrayOfBlocks) {
        if (Array.isArray(arrayOfBlocks))
            for (var i = 0; i < arrayOfBlocks.length; i++) {
                if (ObjectValidator.Validate(arrayOfBlocks[i], { block: sampleBlockClass, texture: "" })) {
                    this._blocks.push(arrayOfBlocks[i]);
                }
            }
        if (this._blocks.length > 3)
            $('#hexrightbtn').removeAttr('disabled');
    },
    changeBlock: function (position, TileName, texture) {
        if (this._blocks[position] != undefined) {
            if (texture == ui.texture_building || texture == ui.texture_ground) {
                this._blocks[position].TileName = TileName;
                this._blocks[position].texture = texture;
            }
        }
    },
    addBlock: function (newBlock) {
        if (ObjectValidator.Validate(block, { TileName: "", texture: "" })) {
            newBlock.id = this._blocks.length;
            _blocks.push(newBlock);
        }
    },
    getBlock: function (position) {
        return this._blocks[position];
    },
    _page: 0,
    _clearblocks: function () {
        for (var i = 1; i < 4; i++) {
            ui.clearCanvas(document.querySelector("#hex" + i.toString()));
            $("#btnHex" + i.toString()).unbind("click");
            $("#btnHex" + i.toString()).removeAttr('disabled');
        }
    },
    refresh: function () {
        this._clearblocks();
        var j = 0;
        for (var i = this._page * 3; i < (this._page * 3) + 3; i++) {
            if (this._blocks[i] != undefined) {

                var selector = '#hex' + (j + 1);
                ui.drawIcon(this._blocks[i].block, document.querySelector(selector), document.querySelector(selector).width);
                selector = '#btnHex' + (j + 1);

                $(selector).click((function (x) {
                    return function () {
                        var block = bcui.getBlock(x);
                        shex.texture(block.block);
                    }
                })(i));
            } else
                document.querySelector('#btnHex' + (j + 1).toString()).setAttribute('disabled', 'disabled');
            j++;
        }
    },
    menu: function () {
        if (this._state != 0) {
            this._state = 0;
            this._clearblocks();
            $('#hexrightbtn').attr('disabled', 'disabled');
            $('#hexleftbtn').attr('disabled', 'disabled');
            ui.drawIcon({ TileName: "Custom", src: "images/additional/playing.png" }, document.querySelector('#hex1'), document.querySelector('#hex1').width);
            ui.drawIcon({ TileName: "Custom", src: "images/additional/naibor.png" }, document.querySelector('#hex2'), document.querySelector('#hex2').width);
            ui.drawIcon({ TileName: "Custom", src: "images/additional/exit.png" }, document.querySelector('#hex3'), document.querySelector('#hex3').width);

            shex.changeMode(View.Movement);

            $('#btnHex3').click(function () {
                navigator.app.exitApp();
            });
            $('#btnHex2').click(function () {
                ui.changeView(View.Building);                
            });
        }
    },
    build: function () {
        if (this._state != 1) {
            this._state = 1;
            this._page = 0;
            if (this._blocks.length > 3)
                $('#hexrightbtn').removeAttr('disabled');
            $('#hexleftbtn').removeAttr('disabled');
            this.refresh();
        }
    },
    pageNext: function () {
        if (this._blocks[(this._page + 1) * 3] != undefined) {
            this._page += 1;
            if (this._blocks[(this._page + 1) * 3] == undefined) {
                $('#hexrightbtn').attr('disabled', 'disabled');
            }
            $('#hexleftbtn').removeAttr('disabled');
            this.refresh();
        }
    },
    pagePrev: function () {
        if (this._blocks[(this._page - 1) * 3] != undefined) {
            this._page -= 1;
            $('#hexrightbtn').removeAttr('disabled');
            this.refresh();
        } else {
            ui.changeView(View.Movement);
        }
    },
    neigbor: function () {
        if (this._state != 2) {
            this._state = 2;
            this._clearblocks();

            $('#hexrightbtn').attr('disabled', 'disabled');
            $('#hexleftbtn').attr('disabled', 'disabled');

            if (Player.isFriend(ui.neighborData)) {
                ui.drawIcon({ TileName: "Custom", src: "images/additional/unfriend.png" }, document.querySelector('#hex3'), document.querySelector('#hex3').width);
                $('#btnHex3').click(function () {
                    alert("sended ajax request for add player in friendly list, and then updated Player object and switches this statement");
                    ui.neighborData.Login = "";
                    bcui.resetState();
                    bcui.neigbor();
                });
                $('#btnHex1').attr('disabled', 'disabled');
            } else {
                ui.drawIcon({ TileName: "Custom", src: "images/additional/friend.png" }, document.querySelector('#hex1'), document.querySelector('#hex1').width);
                $('#btnHex1').click(function () {
                    alert("sended ajax request for remove player from friendly list, and then updated Player object and switches this statement");
                    ui.neighborData.Login = "james";
                    bcui.resetState();
                    bcui.neigbor();
                });
                $('#btnHex3').attr('disabled', 'disabled');
            }

            ui.drawIcon({ TileName: "Custom", src: "images/additional/exit.png" }, document.querySelector('#hex2'), document.querySelector('#hex2').width);
            $('#btnHex2').click(function () {
                ui.changeView(View.Movement);
            });
        }
    }
}

//List of friends
var frlist = {
    _html: "",
    _iteration: 0,
    _size: function () {
        return document.querySelector('#hex1').width;
    },
    getHtml: function () {
        var html = this._html,
            size = this._size();
        Player.Friends.forEach(function (friend) {
            html += "&nbsp<button type='button' class='btn btn-success navbar-btn' onclick=\"frlist.click('"+friend.Login+"')\" ><img src=\"data:image/png;base64," + friend.Avatar + "\" width='" + size + "' height='" + size + "'/></button>";
        });
        return html;
    },
    click: function (name) {
        $('#name').val(name);
        $(".modal-footer > button").trigger("click");
    }
};

// copyright
//http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
function pnpoly(hex, point) {
    var i, j, c = 0,
        nvert = 6;
    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
        if (((hex[i].y > point.y) != (hex[j].y > point.y)) &&
         (point.x < (hex[j].x - hex[i].x) * (point.y - hex[i].y) / (hex[j].y - hex[i].y) + hex[i].x))
            c = !c;
    }
    return c;
}
