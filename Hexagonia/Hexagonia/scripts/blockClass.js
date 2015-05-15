var sampleBlockClass = {
    TileName: "SomeName",
    Layer: 0, //0 - fundament, 1 decorate
    Source: "images/somefile.json",
    SourceY: 0 //number of plus by Y coord, cuz merged tiles have Y shift
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