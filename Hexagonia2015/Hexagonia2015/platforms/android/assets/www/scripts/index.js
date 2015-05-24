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
        
        StaticImages.load();

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

    var cl = new CanvasLoader('canvasloader-container');
    cl.setColor('#64bd31'); // default is '#000000'
    cl.setShape('spiral'); // default is 'oval'
    cl.setDiameter(30); // default is 40
    cl.setRange(1); // default is 1.3
    cl.setFPS(20); // default is 24
    cl.show(); // Hidden by default
    
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