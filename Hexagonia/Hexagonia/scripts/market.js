var market = {
    open: function () {
        bootbox.dialog({
            title: "<img src='images/additional/gold.png' width='20' height='20'/>&nbsp" + PlayerInfo.Gold + "&nbsp&nbsp<img src='images/additional/crystal.png' width='20' height='20'/>&nbsp" + PlayerInfo.Crystal,
            message:
                "<script>var x = $('#store').wrap('<p/>').parent().html();" +
                "$('#store').unwrap();"+            
                "x=x.replace('store','market');" +
                "$('#market_wrapper').html(x);" +
                "$('#market').css('display','block');" +
                "</script>"+
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
    }
}