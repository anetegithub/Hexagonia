// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();

$(document).ready(function () {
    ui.init();
    if ((navigator.userAgent.toLowerCase().indexOf("windows phone") != -1)) {
        $('#bot').css('margin-bottom', '12%');
    }

    ////var some = new Media("/android_asset/www/images/sounds/theme.np3");
    ////some.play();

    //aud.enabled_music = false;

    //aud.maintheme();
    //aud.play_song();

    var f = new Audio("http://indiegamemusic.com/diskspace/mr_lou/Arcade80kbps.mp3");
    alert('wtf');
    f.play();
    alert('wtf1');
});

function playAudio(src) {
    alert("0");
    // HTML5 Audio

    alert("2");


    //src = '/android_asset/www/' + src;
    alert(src);
    

    alert("3");

    var mediaRes = new Media(src,
        function onSuccess() {
            alert("4");
            // release the media resource once finished playing
            //mediaRes.release();
        },
        function onError(e) {

            alert("5");

            alert(e.message);
        });

    alert("6");

    mediaRes.play();

    alert("7");
}