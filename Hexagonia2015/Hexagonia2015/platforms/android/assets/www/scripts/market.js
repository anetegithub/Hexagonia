var market = {
    items: [],
    open: function () {
        bootbox.dialog({
            closeButton: false,
            title: "<img src='images/additional/gold.png' width='20' height='20'/>&nbsp" + Player.Gold + "&nbsp&nbsp<img src='images/additional/crystal.png' width='20' height='20'/>&nbsp" + Player.Crystal,
            message:
                "<script>var x = $('#store').wrap('<p/>').parent().html();" +
                "$('#store').unwrap();" +
                "x=x.replace('store','market');" +
                "x=x.replace('storeitems','marketitems');" +
                "x=x.replace('storeAlert','marketAlert');" +
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
                        market.itemsClear();
                    }
                }
            }
        });
    },
    _setItems: function () {
        var html = "",
            id = 0,
            backBtn = "<button data-bb-handler='success' type='button' class='btn btn-success'>Back</button>",
            buyBtn = "<button type='button' onclick='market.checkout();' class='btn btn-success'>Checkout</button>";

        if (this._forBuy.length == 0)
            $('.modal-footer').html(backBtn);
        else
            $('.modal-footer').html(buyBtn + backBtn);

        this.items.forEach(function (block) {
            if (!Player.ishaveBlock(block)) {

                var sze = (window.innerWidth - 5) / 7;

                html += "&nbsp<button type='button' class='btn btn-success navbar-btn' ><img id='marketitemimg" + id + "' width='" + sze + "' height='" + sze + "'/></button>";
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

                        if (market.itemChecked(block))
                            tcontext.drawImage(StaticImages.check, 0, 0, StaticImages.check.width, StaticImages.check.height, x + ((SizeX + Cell.Width) / 3.5), 2, Size / 3, Size / 3);

                        var imgcur = null;
                        if (block.Currency == Currency.Gold)
                            imgcur = StaticImages.gold;
                        else if (block.Currency == Currency.Crystal)
                            imgcur = StaticImages.crystal;

                        var costlenght = (block.Cost.toString().length * ((Size / 2.3)/2));

                        tcontext.font = (Size/2.5).toString()+"px Arial";
                        tcontext.drawImage(imgcur, 0, 0, imgcur.width, imgcur.height, Size - (Size / 3), Size - (Size / 3), Size / 3, Size / 3);
                        tcontext.fillText(block.Cost, Size - ((Size / 3) + (costlenght)), Size - (Size / 3) + ((Size/2.5)/1.3));

                        $('#marketitemimg' + idd.toString()).attr('src', tcanvas.toDataURL());
                        $('#marketitemimg' + idd.toString()).click(function () {
                            market.buyItem(idd);
                        });
                    }
                })(id);
                img.onload = function () {
                    some();
                }
            }
            id++;
        });
        $('#marketitems').html(html);
    },
    updItems: function () {
        this._setItems();
    },
    _forBuy: [],
    itemsClear: function () {
        this._forBuy = [];
    },
    itemChecked: function (item) {
        var check = Enumerable
            .From(this._forBuy)
            .Where(function (x) { if (x.TileName == item.TileName) return x; })
            .Select(function (x) { return x; })
            .ToArray();
        if (check.length == 0)
            return false;
        else
            return true;
    },
    buyItem: function (index) {
        var block = this.items[index],
            check = Enumerable
                .From(this._forBuy)
                .Where(function (x) { if (x.TileName == block.TileName) return x; })
                .Select(function (x) { return x; })
                .ToArray();

        if (check.length == 0)
            this._forBuy.push(block);
        else
            this._forBuy.splice(this._forBuy.indexOf(check[0]), 1);

        this.updItems();
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
                        Cost: 500,
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
                        SourceY: 0,
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
    },
    checkout: function () {
        var gold = 0,
            crystal = 0;

        this._forBuy.forEach(function (block) {
            if (block.Currency == Currency.Gold)
                gold += block.Cost;
            else
                crystal += block.Cost;
        });

        bootbox.confirm("From your account will be debited <strong style='color: orange;'>" + gold + " gold</strong> and <strong style='color: DeepSkyBlue'>" + crystal + " crystals</strong>", function (result) {
            if (!result)
                market.open();
            else {
                if (Player.Gold < gold || Player.Crystal < crystal) {
                    market.open();
                    market.alert();
                } else
                    market.buy(gold,crystal);
            }
        });
    },
    _alertHtml: "<div class='alert alert-warning alert-dismissible' role='alert'>" +
  "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
  "<strong>Attention!</strong> You don't have enough resources for buying this items... <a onclick='market.opencard();'>Do you want to buy?</a></div>",
    alert: function () {
        $('#marketAlert').html(this._alertHtml);
    },
    buy: function (gold, crystal) {
        loading.show();
        alert('send ajax to server with gold,crystal,blockarray values, show loader,when end get new player_values, result will be:');
        $.ajax({}).done(function () {
            loading.hide();
        });
        
        var newgold = Player.Gold - gold,
            newcryst = Player.Crystal - crystal;
        Player.Gold = newgold;
        Player.Crystal = newcryst;
        Player.Blocks = Player.Blocks.concat(this._forBuy);
        bcui.init(Player.Blocks);
        this.itemsClear();
    },
    opencard: function () {
        alert('open card form, then send to server using ajax, start loading, when server end up, or ~min show result');
    }
}

var Currency = {
    Gold: 0,
    Crystal: 1
};