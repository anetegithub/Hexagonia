var sampleBlockClass = {
    Name: "",
    TileName: "SomeName",
    Layer: 0, //0 - fundament, 1 decorate, 2 resize, 3 background
    Source: "images/somefile.json",
    SourceY: 0, //number of plus by Y coord, cuz merged tiles have Y shift
    Land: 0,
    Cost: 50,
    Currency: 0
};

var Land = {
    Baseland: 0,
    Building: 1,
    Loft: 2,
    Roof: 3
};

var sampleTileInfoClass = {
    X: 0, //X abstract coord
    Y: 0, //Y abstract coord
    Base: sampleBlockClass,
    Decorate: [
        sampleBlockClass,
        sampleBlockClass
    ]
};
