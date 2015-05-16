var FieldSize = {
    X: 5,
    Y: 8
};

var OneBlockPosition = {
    X: 0,
    Y: 0
};

var ScaleFactor = {};

Object.defineProperty(ScaleFactor, "X", {
    get: function () {
        return OneBlockPosition.X / 65;
    },
    set: function (val) {
        this.val = val;
    }
});

Object.defineProperty(ScaleFactor, "Y", {
    get: function () {
        return OneBlockPosition.Y / 68;
    },
    set: function (val) {
        this.val = val;
    }
});

var BuildingTime = false;