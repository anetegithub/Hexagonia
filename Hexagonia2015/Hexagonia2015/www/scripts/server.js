var server = {
    _platform: function () {
        if ((navigator.userAgent.toLowerCase().indexOf("windows phone") != -1))
            return "39Tbh40AG4w587hzW0CuYh5g3VjyhJSdDeb7c9HiSrmG3JyPo4Tq0Lo9yJCFFJc3THP4L96GCXgpS605427NhC1Jzij7ww1m";
        else if ((navigator.userAgent.toLowerCase().indexOf("android") != -1))
            return "0MV71O3Nph7W08VH95OiT4l3cZ059hQMa87zM880mP9Q3k8W3P8Hncz6PlMk264QH21L497v75R6D24G6OV5tyK2pRntC5ND";
        else
            return "Kxeu3052PT07F723ZqhYG38BZ2668q1473oAcQbP08rU0URgeO0ZbFd0r4ezs8Y7cfLy1k6CIm162sdicQRF8MCXVG48AToj";
    },
    token: "",
    serveraddress: "",
    localid: 0,
    login: "",
    psw: "",
    send: function (sdata, controller, action, done, fail) {
        loading.show();
        $.ajax({
            type: "POST",
            data: JSON.stringify(sdata),
            url: this.serveraddress + "api/" + controller + "/" + action,
            headers: {
                "HexaSecurityToken": this._platform(),
                "HexaOnlineToken": this.token,
                "HexaLogin": this.login,
                "HexaPassword": this.psw
            },
            contentType: "application/json"
        }).done(function (data) {
            loading.hide();
            if (data == "401" || data=="400" || data=="422" || data=="404" || data=="402") {
                if (fail != undefined)
                    fail();

            } else if (data.Token != undefined) {
                server.token = data.Token;
                server.localid = data.Id;
                if (sdata.PlayerId != undefined)
                    sdata.PlayerId = data.Id;
                server.send(sdata, controller, action, done, fail);
            } else {
                done(data);
            }
        });
    },
    //example of realization
    auth: function (login, password) {
        $('#errorBox').css('display','none');
        this.serveraddress = "http://localhost:59615/";
        this.login = login;
        this.psw = password;
        var done = function (data) {
            Player.New(data);
            showmain();            
        };
        var fail = function () {
            $('#errorBox').css('display', 'block');
            $('#errorBox').html("Wrong login or password!");
        }
        this.send({ Field: {}, PlayerId: this.localid }, "Account", "Enter", done, fail);
    }
}