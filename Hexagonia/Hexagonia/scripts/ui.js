var completeMapped = undefined;

function loaded(arrayofcord) {
    if (completeMapped == undefined) {
        $.ajax({
            url: 'images/build/complete.json',
            type: 'get',
            async: false,
            success: function (data) {
                if (typeof data == "string")
                    completeMapped = JSON.parse(data);
                else
                    completeMapped = data;
                draw(arrayofcord);
            }
        });
        return false;
    } else
        return true;
}

function draw(arrayofcord) {
    if (loaded(arrayofcord)) {
        var canvas = document.getElementById("display"),
                content = canvas.getContext('2d');

        var pic = new Image();
        pic.src = "images/build/complete.png";        
        pic.onload = function () {

            for (var i = 0; i < arrayofcord.length; i++) {
                var x = 14, y = 9;

                var v = completeMapped[arrayofcord[i].tileid];

                x += arrayofcord[i].xcord * 32;
                y += arrayofcord[i].ycord * 44;

                if (v.Width < 65)
                    x += Math.floor((65 - v.Width) / 2)
                if (v.Height < 89)
                    y += Math.floor((65 - v.Height) / 2)

                if (v.Height > 89)
                    y -= v.Height - 44;

                content.drawImage(pic, v.X, v.Y, v.Width, v.Height, x, y, v.Width, v.Height);
            }
        }
    }
}

function drawOnmyCanvas(tileid, content, size) {
    var pic = new Image();
    pic.src = "images/build/complete.png";
    pic.onload = function () {
        var v = completeMapped[tileid];
        var x = 0, y = 0, sizex = size, sizey = size;

        if (v.Height < size) {
            y += (size/2) - (v.Height/2);
            size = v.Height;
        }
        if (v.Width < sizey) {
            x += (sizey / 2) - (v.Width / 2);
            size = v.Width;
        }
        content.drawImage(pic, v.X, v.Y, v.Width, v.Height, x, y, size, size);
    }
}

function drawAll() {
    var canvas = document.getElementById("display"),
            content = canvas.getContext('2d');
    var x = 0, y = 0;

    var pic = new Image();
    pic.src = "images/build/complete.png";
    pic.onload = function () {
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                var v = Enumerable.From(completeMapped).Where(function (x) { return x.Name == "tileLava.png"; }).Select(function (x) { return x; }).ToArray()[0];

                content.drawImage(pic, v.X, v.Y, v.Width, v.Height, x, y, v.Width, v.Height);
                                
                x += 32;
            }
            x = 0;
            y += 44;
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}