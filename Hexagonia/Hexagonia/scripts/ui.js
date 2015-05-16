var grounds = null,
    buildings = null,
    merged = null;

function sourceJson(source) {
    if (source == "images/build/ground.json")
        return grounds;
    else if (source == "images/build/building.json")
        return buildings;
}

function delitingTool() {
    shex.texture({ Layer: -1,TileName:"none" });
    //bootbox.dialog({
    //    message: "Are you sure you want to use a tool for the destruction that would remove the block or decorations?",
    //    title: "Hey cap we've got a situation!",
    //    buttons: {
    //        warning: {
    //            label: "Yes",
    //            className: "btn-warning",
    //            callback: function () {
    //                shex.texture({ Layer: -1 });
    //            }
    //        },
    //        success: {
    //            label: "No",
    //            className: "btn-success"
    //        },
    //    }
    //});
}

var canvaselement = document.querySelector('#display'),
    Content = canvaselement.getContext('2d'),
    dcanvaselement = document.querySelector('#display_decorations'),
    dContent = dcanvaselement.getContext('2d');

//User Interface
var ui = {
    cursorCoord: function () {
        var x = (this.mousePos.x) / 32,
                y = (this.mousePos.y) / 32;
        x = Math.floor(x);
        y = Math.floor(y);
        return { X: x,Y: y};
    },
    mousePos: null,
    scale:0,
    init: function () {
        $.ajax({
            url: 'images/build/ground.json',
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
            url: 'images/build/building.json',
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
    texture_ground: "images/build/ground.png",
    texture_building: "images/build/building.png",
    texture_merged: "images/build/merged.png",
    drawOnPictureGround: function (drawing) {
        var Img = new Image();
        Img.src = ui.texture_ground;
        Img.onload = function () {
            drawing(Img);
        };
        return Img;
    },
    drawOnPictureMerged:function(drawing){
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

                    var sign = "";
                    switch (block.Land) {
                        case 0: { sign = "B"; break; }
                        case 1: { sign = "D"; break; }
                        case 2: { sign = "L"; break; }
                        case 3: { sign = "R"; break; }
                    }

                    preContent.fillText(sign, SizeY - 10, 15);
                }
                else if (block.Layer == -1) {
                    preContent.fillStyle = "#fff";
                    preContent.font = "bold 50px Arial";
                    preContent.fillText("X", (Size - 35) / 2, (Size + 35) / 2);
                } else if (block.TileName == "Custom") {

                    var x=0,
                        y=0,
                        SizeX=Size,
                        SizeY=Size;

                    if (pic.width < Size) {
                        x += (Size - pic.width) / 2;
                        SizeX =pic.width;
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
                if (3+block.Y==block.Decorate.length) {
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
                else if (block.Decorate[block.Decorate.length-1].Land == Land.Roof) {
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
                else if (block.Decorate[block.Decorate.length-1].Land == Land.Loft && decore.Land == Land.Loft) {
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
                else if (block.Decorate[block.Decorate.length-1].Land == Land.Roof && decore.Land == Land.Roof) {
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
                else if (block.Decorate[block.Decorate.length-1].Land > decore.Land) {
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
        if (viewType == View.Building) {
            BuildingTime = true;
            bcui.build();
            this.map.refresh();
        } else {
            BuildingTime = false;
            shex.click();
            bcui.menu();
            this.map.refresh();
        }
    }
};

var View = {
    Movement: 0,
    Building: 1
}

//Selected block 'hex' container
var shex = {
    init: function () {
        document.querySelector('#hexTopBtn').addEventListener('click', this.click);
        this._canvas = document.querySelector('#hexTop');
    },
    click:function(){
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
    table: function(){
        return this._tiletable;
    },
    _canvas:null,
    refresh: function () {
        var canvas = document.querySelector('#hexTop'),
              content = canvas.getContext('2d');
        content.clearRect(0, 0, content.canvas.width, content.canvas.height);
        ui.drawIcon(this._block,this._canvas, this._canvas.width);
    }
}

//Bottom interface, block of carousel
var bcui = {
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
            if(texture==ui.texture_building || texture==ui.texture_ground)
            {
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
    getBlock:function(position){
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
    menu : function(){
        this._clearblocks();
        $('#hexrightbtn').attr('disabled', 'disabled');
        $('#hexleftbtn').attr('disabled', 'disabled');
        ui.drawIcon({ TileName: "Custom", src: "images/additional/playing.png" }, document.querySelector('#hex1'), document.querySelector('#hex1').width);
        ui.drawIcon({ TileName: "Custom", src: "images/additional/naibor.png" }, document.querySelector('#hex2'), document.querySelector('#hex2').width);
        ui.drawIcon({ TileName: "Custom", src: "images/additional/exit.png" }, document.querySelector('#hex3'), document.querySelector('#hex3').width);
    },
    build: function () {
        this._page = 0;
        if (this._blocks.length > 3)
            $('#hexrightbtn').removeAttr('disabled');
        this.refresh();
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
            if (this._blocks[(this._page - 1) * 3] == undefined) {
                $('#hexleftbtn').attr('disabled', 'disabled');
            }
            $('#hexrightbtn').removeAttr('disabled');
            this.refresh();
        }
    }
}

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