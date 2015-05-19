var market = {
    items: [],
    open: function () {
        bootbox.dialog({
            title: "<img src='images/additional/gold.png' width='20' height='20'/>&nbsp" + Player.Gold + "&nbsp&nbsp<img src='images/additional/crystal.png' width='20' height='20'/>&nbsp" + Player.Crystal,
            message:
                "<script>var x = $('#store').wrap('<p/>').parent().html();" +
                "$('#store').unwrap();" +
                "x=x.replace('store','market');" +
                "x=x.replace('storeitems','marketitems');" +
                "x=x.replace('storeItemTypesList','marketItemTypesList');" +
                "$('#market_wrapper').html(x);" +
                "$('#market').css('display','block');" +
                "market.updateItems();" +
                "</script>" +
                "<span id='market_wrapper'></span>",
            buttons: {
                success: {
                    label: "Back",
                    className: "btn-success",
                    callback: function () {
                    }
                }
            }
        });
    },
    _setItems: function () {
        var html = "",
            id = 0;
        this.items.forEach(function (block) {

            if (!Player.ishaveBlock(block)) {

                var sze = (window.innerWidth - 5) / 7;

                html += "&nbsp<button type='button' class='btn btn-success navbar-btn' onclick='market.buyItem(" + market.items.indexOf(block) + ")' ><img id='marketitemimg" + id + "' width='" + sze + "' height='" + sze + "'/></button>";
                img = new Image();
                img.src = "images/buildings/merged.png";
                var some = (function (idd) {
                    return function () {
                        var tcanvas = document.createElement('canvas');
                        tcanvas.width = (window.innerWidth - 5) / 7;
                        tcanvas.height = tcanvas.width;
                        var tcontext = tcanvas.getContext('2d');

                        var Size = (window.innerWidth - 5) / 7;

                        if (block.Layer == 2) {
                            block.TileName = "tileGrass";
                            block.Source = "images/buildings/ground.json";
                        }

                        var Cell = Enumerable
                            .From(sourceJson(block.Source))
                            .Where(function (xx) { if (xx.Name == block.TileName) return xx; })
                            .Select(function (xx) { return xx; }).ToArray()[0];

                        var x = 0, y = 0, SizeX = Size, SizeY = Size;

                        if (Cell.Width < Size) {
                            x += (Size - Cell.Width) / 2;
                            SizeX = Cell.Width;
                        }

                        if (Cell.Height < Size) {
                            y += (Size - Cell.Height) / 2;
                            SizeY = Cell.Height;
                        }

                        tcontext.drawImage(img, Cell.X, Cell.Y + block.SourceY, Cell.Width, Cell.Height, x, y, SizeX, SizeY);

                        if (block.Layer == 2) {
                            var imgarrow = null;
                            if (block.SourceY == 0)
                                imgarrow = StaticImages.right;
                            else
                                imgarrow = StaticImages.down;
                            tcontext.drawImage(imgarrow, 0, 0, imgarrow.width, imgarrow.height, x, y, SizeX / 2, SizeY / 2);
                        }

                        var imgcur = null;
                        if (block.Currency == Currency.Gold)
                            imgcur = StaticImages.gold;
                        else if (block.Currency == Currency.Crystal)
                            imgcur = StaticImages.crystal;

                        var costlenght = (block.Cost.toString().length * 10);

                        tcontext.font = "18px Arial";
                        tcontext.drawImage(imgcur, 0, 0, imgcur.width, imgcur.height, Size - (Size / 3), Size - (Size / 3), Size / 3, Size / 3);
                        tcontext.fillText(block.Cost, Size - ((Size / 3) + (costlenght)), Size - (Size / 3) + 14);

                        $('#marketitemimg' + idd.toString()).attr('src', tcanvas.toDataURL());
                        //buy here
                    }
                })(id);
                img.onload = function () {
                    some();
                }
                id++;
            }
        });
        $('#marketitems').html(html);
    },
    updItems:function(){
        this._setItems();
    },
    buyItem: function (index) {

    },
    updateItems: function () {
        //ajax load items by selected
        var itemsType = $('#marketItemTypesList').val();
        switch (itemsType) {
            case "Baseland": {
                this.items = [
                    {
                        TileName: "tileMagic",
                        Layer: 0,
                        Source: "images/buildings/ground.json",
                        SourceY: 0,
                        Land: 0,
                        Cost: 50,
                        Currency: 0
                    },
                    {
                        TileName: "tileLava",
                        Layer: 0,
                        Source: "images/buildings/ground.json",
                        SourceY: 0,
                        Land: 0,
                        Cost: 2,
                        Currency: 1
                    }
                ];
                break;
            }
            case "Building": {
                this.items = [
                    {
                        TileName: "woodWindowBlinds",
                        Layer: 1,
                        Source: "images/buildings/building.json",
                        SourceY: 509,
                        Land: Land.Building,
                        Cost: 15,
                        Currency: 1
                    },
                    {
                        TileName: "woodDoorRight",
                        Layer: 1,
                        Source: "images/buildings/building.json",
                        SourceY: 509,
                        Land: Land.Building,
                        Cost: 200,
                        Currency: 0
                    }
                ];
                break;
            }
            case "Loft": {
                this.items = [
                    {
                        TileName: "sandRoofPointy",
                        Layer: 1,
                        Source: "images/buildings/building.json",
                        SourceY: 509,
                        Land: Land.Loft,
                        Cost: 15,
                        Currency: 1
                    },
                    {
                        TileName: "rockDirt",
                        Layer: 1,
                        Source: "images/buildings/ground.json",
                        SourceY:  0,
                        Land: Land.Loft,
                        Cost: 200,
                        Currency: 0
                    }
                ];
                break;
            }
            case "Roof": {
                this.items = [
                    {
                        TileName: "treeGreen_high",
                        Layer: 1,
                        Source: "images/buildings/ground.json",
                        SourceY: 0,
                        Land: Land.Roof,
                        Cost: 15,
                        Currency: 1
                    },
                    {
                        TileName: "flowerYellow",
                        Layer: 1,
                        Source: "images/buildings/ground.json",
                        SourceY: 0,
                        Land: Land.Roof,
                        Cost: 200,
                        Currency: 0
                    }
                ];
                break;
            }
            case "Area": {
                this.items = [
                    {
                        TileName: "",
                        Layer: 2,
                        Source: "",
                        SourceY: 0,
                        Land: -1,
                        Cost: 15,
                        Currency: 1
                    },
                    {
                        TileName: "",
                        Layer: 2,
                        Source: "",
                        SourceY: 1,
                        Land: 0,
                        Cost: 200,
                        Currency: 0
                    }
                ];
                break;
            }
        }
        this._setItems();
    }
}

var Currency = {
    Gold: 0,
    Crystal: 1
};