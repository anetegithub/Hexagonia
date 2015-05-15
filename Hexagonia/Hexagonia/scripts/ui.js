var grounds = null,
    buildings = null,
    merged = null;

function sourceJson(source) {
    if (source == "images/build/ground.json")
        return grounds;
    else if (source == "images/build/building.json")
        return buildings;
}

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
                            .Where(function (x) { if (x.XCoord == Coords.x && x.YCoord == Coords.y) return x; })
                            .Select(function (x) { return x; }).ToArray();

                    if (Block.Layer == 0)
                        Obj.Base = Block;

                    if (Cell.length == 1) {
                        var index = ui.map.cellArray.indexOf(Cell[0]);

                        if (Block.Layer == 0)
                            Cell[0].Base = Block;
                        else
                            if (0 == 0) //check level high
                                Cell[0].Decorate.push(Block);

                        ui.map.cellArray[index] = Cell[0];
                    } else {
                        if (Block.Layer == 0)
                            ui.map.cellArray.push(Obj);
                        //warning No baseland
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
    drawIcon: function (block, Canvas, Size) {
        var pic = new Image();
        pic.src = ui.texture_merged;
        pic.onload = function () {
            if (block != "null") {
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
                var content = Canvas.getContext('2d');
                content.drawImage(pic, Cell.X, Cell.Y + block.SourceY, Cell.Width, Cell.Height, x, y, SizeX, SizeY);
                content.fillStyle = "#000000";
                content.font = "bold 15px Arial";
                content.fillText(block.Layer == 0 ? "B" : "D", SizeY - 10, 15);
            }
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
                    if (isPointInHexagon(Coords, x))
                        return x;
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
                var cy = j * (OneBlockPosition.Y/1.4)//49;
                if (j % 2 == 0) {
                    for (var i = 0; i < FieldSize.X; i++) {
                        var cx = OneBlockPosition.X/2 + (OneBlockPosition.X * i);

                        var tempobj = [];
                        tempobj.y = j;
                        tempobj.x = i;

                        tempobj.push({ x: cx, y: cy });
                        tempobj.push({ x: cx - OneBlockPosition.X / 2, y: cy + (OneBlockPosition.Y / 4) });
                        tempobj.push({ x: cx - OneBlockPosition.X / 2, y: cy + (OneBlockPosition.Y / 4)*3 });
                        tempobj.push({ x: cx, y: cy + OneBlockPosition.Y });
                        tempobj.push({ x: cx + OneBlockPosition.X / 2, y: cy + (OneBlockPosition.Y / 4)*3 });
                        tempobj.push({ x: cx + OneBlockPosition.X / 2, y: cy + (OneBlockPosition.Y / 4) });

                        if (drawHexagons) {
                            Content.beginPath();
                            Content.moveTo(cx, cy);

                            Content.lineTo(cx, cy);
                            Content.lineTo(cx - OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4));
                            Content.lineTo(cx - OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4) * 3);
                            Content.lineTo(cx, cy + OneBlockPosition.Y);
                            Content.lineTo(cx + OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4) * 3);
                            Content.lineTo(cx + OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4));

                            Content.lineTo(cx, cy);

                            Content.stroke();
                            Content.closePath();
                        }

                        this._abstractMap.push(tempobj);
                    }
                } else {
                    for (var i = 0; i < FieldSize.X-1; i++) {
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
                            Content.beginPath();
                            Content.moveTo(cx, cy);

                            Content.lineTo(cx, cy);
                            Content.lineTo(cx - OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4));
                            Content.lineTo(cx - OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4) * 3);
                            Content.lineTo(cx, cy + OneBlockPosition.Y);
                            Content.lineTo(cx + OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4) * 3);
                            Content.lineTo(cx + OneBlockPosition.X / 2, cy + (OneBlockPosition.Y / 4));
                            Content.lineTo(cx, cy);

                            Content.stroke();
                            Content.closePath();
                        }

                        this._abstractMap.push(tempobj);
                    }
                }
            }
        },
        cellArray: [],          // see sampleTileInfoClass
        draw: function (cellArray) {
            ui.map.tempArray = cellArray;
            var drawing = function (pic) {
                var Map = Enumerable
                    .From(cellArray)
                    .OrderBy(function (x) { return x.Y })
                    .ToArray();

                Map.forEach(function (TileInfo) {
                    var X = TileInfo.X * OneBlockPosition.X,
                        Y = TileInfo.Y * (OneBlockPosition.Y / 1.4),
                        Tile = Enumerable
                            .From(sourceJson(TileInfo.Base.Source))
                            .Where(function (x) { if (x.Name == TileInfo.Base.TileName) return x; })
                            .Select(function (x) { return x; })
                            .ToArray()[0];

                    if (TileInfo.Y % 2 != 0)
                        X += OneBlockPosition.X/2;


                    Content.drawImage(pic, Tile.X, Tile.Y, Tile.Width, Tile.Height, X, Y, OneBlockPosition.X, OneBlockPosition.Y*1.3);
                });
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
            shex.texture("null");
        });
        this._canvas = document.querySelector('#hexTop');
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


function isPointInHexagon(point, hex) {
    var xPointFromHex = { l: hex[1].x, r: hex[4].x },
        yPointFromHex = { t: hex[0].y, b: hex[3].y };

    if (point.x >= xPointFromHex.l && point.x <= xPointFromHex.r)
        if (point.y >= yPointFromHex.t && point.y <= yPointFromHex.b)
            return true;

    return false;
}