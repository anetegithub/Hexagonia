var campw = {
    run: function () {
        shex.disable();
        var centerX = Math.floor(Player.Field.X / 2),
            centerY = Math.floor(Player.Field.Y / 2);
        var campagin = [
            {
                X: centerX,
                Y: centerY,
                Base: {
                    TileName: "tileGrass",
                    Layer: 0,
                    Source: "images/buildings/ground.json",
                    SourceY: 0,
                    Land: 0,
                    Cost: 0,
                    Currency: 0
                },
                Decorate: []
            },
            {
                X: centerX-1,
                Y: centerY-1,
                Base: {
                    TileName: "tileSnow",
                    Layer: 0,
                    Source: "images/buildings/ground.json",
                    SourceY: 0,
                    Land: 0,
                    Cost: 0,
                    Currency: 0
                },
                Decorate: []
            }
        ];

        ui.map.draw(campagin);
    }
}