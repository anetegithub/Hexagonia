var grounds = null,
    buildings = null,
    merged = null;

var canvaselement = document.querySelector('#display'),
    Content = canvaselement.getContext('2d');

//User Interface
var ui = {
    cursorCoord: function () {
        var x = (this.mousePos.x) / 32,
                y = (this.mousePos.y) / 32;
        x = Math.floor(x);
        y = Math.floor(y);
        return { X: x,Y: y};
    },
    mousePos:null,
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

        canvaselement.addEventListener('mousemove', function (evt) {
            var rect = canvaselement.getBoundingClientRect();
             ui.mousePos = {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }, false);
        canvaselement.addEventListener('click', function () {
            if (shex.texture() != undefined && shex.texture() != "null") {

                var Coords = ui.map.getAbstractHex(ui.mousePos); // ui.map.positionByBlockType(BLOCK.BASE),
                if (Coords != undefined) {
                    var Obj = {
                        XCoord: Coords.x,
                        YCoord: Coords.y,
                        TileName: "flowerWhite",
                        buildings: [],
                        decorate: []
                    },
                        Cell = Enumerable
                            .From(ui.map.cellArray)
                            .Where(function (x) { if (x.XCoord == Coords.x && x.YCoord == Coords.y) return x; })
                            .Select(function (x) { return x; }).ToArray();

                    if (shex.table() == ui.texture_ground)
                        Obj.TileName = shex.texture();

                    if (Cell[0] != undefined) {
                        var index = ui.map.cellArray.indexOf(Cell[0]);
                        if (shex.table() == ui.texture_building)
                            Obj.buildings.push({
                                TileName: shex.texture()
                            });
                        ui.map.cellArray[index] = Obj;
                    } else {
                        if (shex.table() == ui.texture_building)
                            Obj.buildings.push({
                                TileName: shex.texture()
                            });
                        ui.map.cellArray.push(Obj);
                    }

                    ui.map.refresh();
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
    drawIcon: function (TileName, Canvas, Size, Src) {
        var pic = new Image();
        pic.src = Src;
        pic.onload = function () {
            var Cell = null;

            if (Src == ui.texture_ground)
                Cell = Enumerable
                    .From(grounds)
                    .Where(function (x) { if (x.Name == TileName) return x; })
                    .Select(function (x) { return x; }).ToArray()[0];
            else
                Cell = Enumerable
                    .From(buildings)
                    .Where(function (x) { if (x.Name == TileName) return x; })
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
            var content = Canvas.getContext('2d');
            content.drawImage(pic, Cell.X, Cell.Y, Cell.Width, Cell.Height, x, y, SizeX, SizeY);
        }
    },
    clearCanvas: function (canvas) {
        var content = canvas.getContext('2d');
        content.clearRect(0, 0, content.canvas.width, content.canvas.height);
    },
    map: {
        _abstractMap: [],
        getAbstractMap: function(){
            return this._abstractMap;
        },
        getAbstractHex: function (Coords) {
            var abstractCoords = Enumerable
                .From(this._abstractMap)
                .Where(function (x) {
                    if (isPointInPoly(x, Coords))
                        return x;
                })
                .Select(function (x) { return x; })
                .ToArray();
            
            if (abstractCoords.length > 0)
                return abstractCoords[0];

            return undefined;
        },
        createAbstractMap: function () {
            for (var j = 0; j < 8; j++) {
                var cy = j * 49;
                if (j % 2 == 0) {
                    for (var i = 0; i < 5; i++) {
                        var cx = 32.5 + (65 * i);

                        var tempobj = [];
                        tempobj.y = j;
                        tempobj.x = i;
                        tempobj.push({ x: cx, y: cy });
                        tempobj.push({ x: cx - 32.5, y: cy + 17 });
                        tempobj.push({ x: cx - 32.5, y: cy + 51 });
                        tempobj.push({ x: cx, y: cy + 68 });
                        tempobj.push({ x: cx + 32.5, y: cy + 51 });
                        tempobj.push({ x: cx + 32.5, y: cy + 17 });

                        Content.beginPath();
                        Content.moveTo(cx, cy);

                        Content.lineTo(cx - 32.5, cy + 17);
                        Content.lineTo(cx - 32.5, cy + 51);
                        Content.lineTo(cx, cy + 68);
                        Content.lineTo(cx + 32.5, cy + 51);
                        Content.lineTo(cx + 32.5, cy + 17);
                        Content.lineTo(cx, cy);

                        Content.stroke();
                        Content.closePath();

                        this._abstractMap.push(tempobj);
                    }
                } else {
                    for (var i = 0; i < 4; i++) {
                        var cx = 32.5 + (65 * i);
                        cx += 32.5;

                        var tempobj = [];
                        tempobj.y = j;
                        tempobj.x = i;
                        tempobj.push({ x: cx, y: cy });
                        tempobj.push({ x: cx - 32.5, y: cy + 17 });
                        tempobj.push({ x: cx - 32.5, y: cy + 51 });
                        tempobj.push({ x: cx, y: cy + 68 });
                        tempobj.push({ x: cx + 32.5, y: cy + 51 });
                        tempobj.push({ x: cx + 32.5, y: cy + 17 });

                        Content.beginPath();
                        Content.moveTo(cx, cy);

                        Content.lineTo(cx - 32.5, cy + 17);
                        Content.lineTo(cx - 32.5, cy + 51);
                        Content.lineTo(cx, cy + 68);
                        Content.lineTo(cx + 32.5, cy + 51);
                        Content.lineTo(cx + 32.5, cy + 17);
                        Content.lineTo(cx, cy);

                        Content.stroke();
                        Content.closePath();

                        this._abstractMap.push(tempobj);
                    }
                }
            }
        },
        cellArray: [],          // [,] aray of Cell wich TextureInfo and have List<TextureInfo> as one of members
        tempArray: [],
        draw: function (cellArray) {
            ui.map.tempArray = cellArray;

            var drawing = function (pic) {
                var Map = Enumerable
                    .From(cellArray)
                    .OrderBy(function (x) { return x.YCoord })
                    .ToArray();

                Map.forEach(function (TileInfo) {
                    var X = TileInfo.XCoord * 32,
                        Y = TileInfo.YCoord * 49,
                        Tile = Enumerable
                            .From(merged)
                            .Where(function (x) { if (x.Name == TileInfo.TileName) return x; })
                            .Select(function (x) { return x; })
                            .ToArray()[0];

                    X += 2;
                    Y += 2;

                    if (Tile.Width < 65)
                        X += (65 - Tile.Width) / 2;

                    Content.drawImage(pic, Tile.X, Tile.Y, Tile.Width, Tile.Height, X, Y, Tile.Width, Tile.Height);
                });
            }

            var region = function() {
                //var drawing = function (pic) {
                //    var canvas = ui.map.getCanvas();

                //    for (var i = 0; i < cellArray.length; i++) {
                //        var x = 0,
                //        y = 0;

                //        var cell = Enumerable
                //            .From(grounds)
                //            .Where(function (x) { if (x.Name == cellArray[i].TileName) return x; })
                //            .Select(function (x) { return x; }).ToArray()[0];

                //        x += cellArray[i].XCoord * 32;
                //        y += cellArray[i].YCoord * 44;

                //        if (cell.Width < 65)
                //            x += (65 - cell.Width) / 2;


                //        canvas.drawImage(pic, cell.X, cell.Y, cell.Width, cell.Height, x, y, cell.Width, cell.Height);


                //    }
                //    ui.drawOnPictureBuilding(drawing_b);
                //}
                //var drawing_b = function (pic) {
                //    var canvas = ui.map.getCanvas();
                //    for (var i = 0; i < cellArray.length; i++) {
                //        var y = cellArray[i].YCoord * 44;
                //        for (var j = 0; j < cellArray[i].buildings.length; j++) {
                //            var x = 0;

                //            x += cellArray[i].XCoord * 32;

                //            var layer = Enumerable
                //            .From(buildings)
                //            .Where(function (x) { if (x.Name == cellArray[i].buildings[j].TileName) return x; })
                //            .Select(function (x) { return x; }).ToArray()[0];

                //            if (layer.Height > 76)
                //                y -= layer.Height - 76;

                //            if (layer.Height < 76)
                //                y += 76 - layer.Height;

                //            canvas.drawImage(pic, layer.X, layer.Y, layer.Width, layer.Height, x, y, layer.Width, layer.Height);

                //            y -= 9.5;
                //        }
                //    }
                //    ui.drawOnPictureGround(drawing_d);
                //}
                //var drawing_d = function (pic) {
                //    var canvas = ui.map.getCanvas();
                //    for (var i = 0; i < cellArray.length; i++) {
                //        var y = cellArray[i].YCoord * 44;
                //        for (var j = 0; j < cellArray[i].decorate.length; j++) {
                //            var x = 0,
                //                y = 0;

                //            x += cellArray[i].XCoord * 32;
                //            y += cellArray[i].YCoord * 44;

                //            var layer = Enumerable
                //            .From(grounds)
                //            .Where(function (x) { if (x.Name == cellArray[i].decorate[j].TileName) return x; })
                //            .Select(function (x) { return x; }).ToArray()[0];

                //            if (layer.Width < 65)
                //                x += (65 - layer.Width) / 2;

                //            if (layer.Height < 89)
                //                y -= (89 - layer.Height) / 2;

                //            canvas.drawImage(pic, layer.X, layer.Y, layer.Width, layer.Height, x, y, layer.Width, layer.Height);
                //        }
                //    }
                //}
                //ui.drawOnPictureGround(drawing);
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
    }
};

var BLOCK = {
    BASE: 0,
};

//Selected block 'hex' container
var shex = {
    init: function () {
        document.querySelector('#hexTopBtn').addEventListener('click', function () {
            var canvas = document.querySelector('#hexTop'),
                content = canvas.getContext('2d');
            content.clearRect(0, 0, content.canvas.width, content.canvas.height);
            shex._texture = "null";
        });
        this._canvas = document.querySelector('#hexTop');
    },
    _texture: "null",
    _tiletable: ui.texture_ground,
    texture: function (TileName,TileTable) {
        if (TileName == undefined)
            return this._texture;

        if(TileTable!=undefined)
            if(TileTable==ui.texture_ground || TileTable==ui.texture_building)
                this._tiletable=TileTable;

        this._texture = TileName;

        this.refresh();

        return this._texture;
    },
    table: function(){
        return this._tiletable;
    },
    _canvas:null,
    refresh: function () {
        var canvas = document.querySelector('#hexTop'),
              content = canvas.getContext('2d');
        content.clearRect(0, 0, content.canvas.width, content.canvas.height);
        ui.drawIcon(this._texture, this._canvas, this._canvas.width, this._tiletable);
    }
}

//Bottom interface, block of carousel
var bcui = {
    _blocks: [],
    init: function (arrayOfBlocks) {
        if (Array.isArray(arrayOfBlocks))
            for (var i = 0; i < arrayOfBlocks.length; i++) {
                if (ObjectValidator.Validate(arrayOfBlocks[i], { TileName: "", texture: "" })) {
                    this._blocks.push(arrayOfBlocks[i]);
                }
            }
        if (this._blocks.length > 3)
            $('#hexrightbtn').removeAttr('disabled');
        this.refresh();
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
                ui.drawIcon(this._blocks[i].TileName, document.querySelector(selector), document.querySelector(selector).width, this._blocks[i].texture);
                selector = '#btnHex' + (j + 1);

                $(selector).click((function (x) {
                    return function () {
                        var block = bcui.getBlock(x);
                        shex.texture(block.TileName, block.texture);
                    }
                })(i));
            } else
                document.querySelector('#btnHex' + (j + 1).toString()).setAttribute('disabled', 'disabled');
            j++;
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
            if (this._blocks[(this._page - 1) * 3] == undefined) {
                $('#hexleftbtn').attr('disabled', 'disabled');
            }
            $('#hexrightbtn').removeAttr('disabled');
            this.refresh();
        }
    }
}

function isPointInPoly(poly, pt) {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
        && (c = !c);
    return c;
}