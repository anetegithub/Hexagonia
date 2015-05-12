var grounds = null,
    buildings = null;

var canvaselement = document.querySelector('#display'),
    content = canvaselement.getContext('2d');

var ui = {
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
    },
    texture_ground: "images/build/ground.png",
    texture_building: "images/build/building.png",
    drawOnPictureGround: function (drawing) {
        var Img = new Image();
        Img.src = ui.texture_ground;
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


            //if (v.Height < size) {
            //    y += (size / 2) - (v.Height / 2);
            //    size = v.Height;
            //}
            //if (v.Width < sizey) {
            //    x += (sizey / 2) - (v.Width / 2);
            //    size = v.Width;
            //}
            var content = Canvas.getContext('2d');
            content.drawImage(pic, Cell.X, Cell.Y, Cell.Width, Cell.Height, x, y, SizeX, SizeY);
        }
    },
    map: {
        cellArray: [],          // [,] aray of Cell wich TextureInfo and have List<TextureInfo> as one of members
        tempArray: [],
        draw: function (cellArray) {
            ui.map.tempArray = cellArray;

            var drawing = function (pic) {
                var canvas = ui.map.getCanvas();

                for (var i = 0; i < cellArray.length; i++) {
                    var x = 14,
                    y = 9;

                    var cell = Enumerable
                        .From(grounds)
                        .Where(function (x) { if (x.Name == cellArray[i].TileName) return x; })
                        .Select(function (x) { return x; }).ToArray()[0];

                    x += cellArray[i].XCoord * 32;
                    y += cellArray[i].YCoord * 44;

                    if (cell.Width < 65)
                        x += (65 - cell.Width) / 2;


                    canvas.drawImage(pic, cell.X, cell.Y, cell.Width, cell.Height, x, y, cell.Width, cell.Height);


                }
                ui.drawOnPictureBuilding(drawing_b);
            };

            var drawing_b = function (pic) {
                var canvas = ui.map.getCanvas();
                for (var i = 0; i < cellArray.length; i++) {
                    var y = cellArray[i].YCoord * 44;
                    for (var j = 0; j < cellArray[i].buildings.length; j++) {
                        var x = 14;

                        x += cellArray[i].XCoord * 32;

                        var layer = Enumerable
                        .From(buildings)
                        .Where(function (x) { if (x.Name == cellArray[i].buildings[j].TileName) return x; })
                        .Select(function (x) { return x; }).ToArray()[0];

                        if (layer.Height > 76)
                            y -= layer.Height - 76;

                        if (layer.Height < 76)
                            y += 76 - layer.Height;

                        canvas.drawImage(pic, layer.X, layer.Y, layer.Width, layer.Height, x, y, layer.Width, layer.Height);

                        y -= 9.5;
                    }
                }
                ui.drawOnPictureGround(drawing_d);
            }

            var drawing_d = function (pic) {
                var canvas = ui.map.getCanvas();
                for (var i = 0; i < cellArray.length; i++) {
                    var y = cellArray[i].YCoord * 44;
                    for (var j = 0; j < cellArray[i].decorate.length; j++) {
                        var x = 14,
                            y = 9;

                        x += cellArray[i].XCoord * 32;
                        y += cellArray[i].YCoord * 44;

                        var layer = Enumerable
                        .From(grounds)
                        .Where(function (x) { if (x.Name == cellArray[i].decorate[j].TileName) return x; })
                        .Select(function (x) { return x; }).ToArray()[0];

                        if (layer.Width < 65)
                            x += (65 - layer.Width) / 2;

                        if (layer.Height < 89)
                            y -= (89 - layer.Height) / 2;

                        canvas.drawImage(pic, layer.X, layer.Y, layer.Width, layer.Height, x, y, layer.Width, layer.Height);
                    }
                }
            }

            ui.drawOnPictureGround(drawing);
        },
        redraw: function (cell) {
            var pic = ui.picture_ground(),
                x = 14 + (32 * cell.XCoord),
                y = 9 + (44 * cell.YCoord),
                canvas = ui.map.getCanvas();

            canvas.drawImage(pic, cell.X, cell.Y, cell.Width, cell.Height, x, y, cell.Width, cell.Height);

            for (var i = 0; i < cell.buildings.length; i++) {
                var layer = cell.buildings[i],
                    pic_b = ui.picture_building();

                canvas.drawImage(pic_b, layer.X, layer.Y, layer.Width, layer.Height, x, y, layer.Width, layer.Height);
            }

            //draw near cells by priority (wtf, priority - ?)
        },
        getCanvas: function () {
            var canvasElement = document.querySelector('#display'),
                 canvas = canvasElement.getContext('2d');
            return canvas;
        }
    }
};

//function loaded(arrayofcord) {
//    if (completeMapped == undefined) {
//        $.ajax({
//            url: 'images/build/complete.json',
//            type: 'get',
//            async: false,
//            success: function (data) {
//                if (typeof data == "string")
//                    completeMapped = JSON.parse(data);
//                else
//                    completeMapped = data;
//                draw(arrayofcord);
//            }
//        });
//        return false;
//    } else
//        return true;
//}

//function draw(arrayofcord) {
//    if (loaded(arrayofcord)) {
//        var canvas = document.getElementById("display"),
//                content = canvas.getContext('2d');

//        var pic = new Image();
//        pic.src = "images/build/ground.png";        
//        pic.onload = function () {

//            for (var i = 0; i < arrayofcord.length; i++) {
//                var x = 14, y = 9;

//                var v = completeMapped[arrayofcord[i].tileid];

//                x += arrayofcord[i].xcord * 32;
//                y += arrayofcord[i].ycord * 44;

//                if (v.Width < 65)
//                    x += Math.floor((65 - v.Width) / 2)
//                if (v.Height < 89)
//                    y += Math.floor((65 - v.Height) / 2)

//                if (v.Height > 89)
//                    y -= v.Height - 44;

//                content.drawImage(pic, v.X, v.Y, v.Width, v.Height, x, y, v.Width, v.Height);
//            }
//        }
//    }
//}



//function drawAll() {
//    var canvas = document.getElementById("display"),
//            content = canvas.getContext('2d');
//    var x = 0, y = 0;

//    var pic = new Image();
//    pic.src = "images/build/ground.png";
//    pic.onload = function () {
//        for (var i = 0; i < 9; i++) {
//            for (var j = 0; j < 9; j++) {
//                var v = Enumerable.From(completeMapped).Where(function (x) { return x.Name == "tileLava.png"; }).Select(function (x) { return x; }).ToArray()[0];

//                content.drawImage(pic, v.X, v.Y, v.Width, v.Height, x, y, v.Width, v.Height);
                                
//                x += 32;
//            }
//            x = 0;
//            y += 44;
//        }
//    }
//}

//function getRandomInt(min, max) {
//    return Math.floor(Math.random() * (max - min + 1)) + min;
//}