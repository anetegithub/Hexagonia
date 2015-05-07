var CompleteMapped = undefined;

function loaded(arrayofcord) {
    if (CompleteMapped == undefined) {
        $.ajax({
            url: 'images/build/complete.xml',
            type: 'get',
            async: false,
            success: function (html) {
                CompleteMapped = JSON.parse(xml2json(html, "")).TextureAtlas.SubTexture;
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

                var v = CompleteMapped[arrayofcord[i].tileid];

                x += arrayofcord[i].xcord * 32;
                y += arrayofcord[i].ycord * 44;

                if (v["@width"] < 65)
                    x += Math.floor((65 - v["@width"]) / 2)
                if (v["@height"] < 89)
                    y += Math.floor((65 - v["@height"]) / 2)

                if (v["@height"] > 89)
                    y -= v["@height"] - 44;

                content.drawImage(pic, v["@x"], v["@y"], v["@width"], v["@height"], x, y, v["@width"], v["@height"]);
            }
        }
    }
}

function drawOnmyCanvas(tileid, content, size) {
    var pic = new Image();
    pic.src = "images/build/complete.png";
    pic.onload = function () {
        var v = CompleteMapped[tileid];
        var x = 0, y = 0, sizex = size, sizey = size;

        if (v["@height"] < size) {
            y += (size/2) - (v["@height"]/2);
            size = v["@height"];
        }
        if (v["@width"] < sizey) {
            x += (sizey / 2) - (v["@width"] / 2);
            size = v["@width"];
        }



        content.drawImage(pic, v["@x"], v["@y"], v["@width"], v["@height"], x, y, size, size);
    }
}

function drawAll() {
    var canvas = document.getElementById("display"),
            content = canvas.getContext('2d');    
    var x=14,y=9,times=0;
    for (var i = 0; i < 12; i++) {
        for (var j = 0; j < 5; j++) {
            var pic = new Image();
            pic.src = "images/build/complete.png";
            pic.onload = function () {
                var v = CompleteMapped[34];

                if (v["@width"] < 65)
                    x += Math.floor((65 - v["@width"])/2)

                content.drawImage(pic, v["@x"], v["@y"], v["@width"], v["@height"], x, y, v["@width"], v["@height"]);
                x += 65;
                times++;
                if (times == 5) {
                    x = 14;
                    y += 32;
                    times = 0;
                }
            }
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}