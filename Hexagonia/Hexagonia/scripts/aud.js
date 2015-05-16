var aud = {
    enabled_effects: true,
    enabled_music: true,
    _current_sound: null,
    _current_song: null,
    installblock: function () {
        this._current_sound = new Audio("images/sounds/installblock.ogg");
        this._current_sound.volume = 0.2;
    },
        removeblock: function () {
        this._current_sound = new Audio("images/sounds/earseblock.ogg");
        },
            alert: function(){
                this._current_sound = new Audio("images/sounds/alert.mp3");
                this._current_sound.volume = 0.5;
},
        maintheme: function () {
        this._current_song = new Audio("images/sounds/theme.mp3");
        this._current_song.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
    },
        play_sound: function () {
            if (this.enabled_effects)
            this._current_sound.play();
    },
        play_song: function () {
        if (this.enabled_music)
            this._current_song.play();
    },
}