function newdb() {
    var db = new Object();

    //db.map=    
    
    // To store a value
    window.localStorage.setItem('key', value);

    // To retrieve a value
    value = window.localStorage.getItem('key');

    // To delete a storage
    window.localStorage.removeItem('key');
}

function newmap() {
    var o = new Object();

    o.source = [];
    o.cellByCoord = function (x, y) {
        for (var i = 0; i < this.source.length; i++) {
            if (this.source[i].xcoord == x && this.source[i].ycood == y)
                return this.source[i];
        }
    };
    o.cellByPixels = function (x, y) {
        xresult = x / 32;
        if (xresult < 0)
            xresult = 0;
        xresult = Math.round(xresult);

        yresult = x / 44;
        if (yresult < 0)
            yresult = 0;
        yresult = Math.round(yresult);

        return this.cellByCoord(xresult, yresult);
    };
}

//cell mapping
// steppable