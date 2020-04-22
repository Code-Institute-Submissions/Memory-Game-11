    // Global variables

    const colorCardsArray = ['red', 'blue', 'green', 'purple', 'yellow', 'pink', 'teal', 'gold'];
    // const colorCardsArray = ['red', 'blue', 'green', 'purple', 'yellow', 'pink'];
    // const colorCardsArray = ['red', 'blue'];
    const game = {};
    let silence = false;
    bgMusic.loop = true;

    // Initialize even listeners
    $('#start').click(startGame);
    $('#restart').click(startGame);
    $('#restart').hide();
    $('#mute').hide();

    // play button click audio on all button elements
    $('.btn').click(function() {
        playButtonAudio();
    });

    function playButtonAudio() {
        $('#buttonClickAudio')[0].currentTime = 0;
        $('#buttonClickAudio')[0].play();
    }
    // Mute button
    $('#mute').click(function() {
        muteAudio();
    });

    // mute audio function, original code from: https://css-tricks.com/forums/topic/mute-unmute-sounds-on-website/
    function muteAudio() {

        let allaudio = $('audio');

        if (silence) {
            for (let j = 0; j < allaudio.length; j++) {
                allaudio[j].muted = false;
            }
            silence = false;
        } else {
            for (let j = 0; j < allaudio.length; j++) {
                allaudio[j].muted = true;
            }
            silence = true;
        }
        $('#mute i').toggleClass('fa-volume-off');
    }

    // Game play
    $('.game').on("click", ".active", function(event) {
        if (!game.pause) {
            game.clicks++;
            $('#score').text(game.clicks);
            game.sel.push($(this));
            $(this).removeClass('active');
            $(this).find('.back-face').hide();
            $(this).find('.front-face').show();
            $('#cardFlipAudio')[0].play();
            if (game.sel.length === 2) {
                if (game.sel[0].data('val') == game.sel[1].data('val')) {
                    game.pause = false;
                    removeItems(game.sel[0].data('val'));
                    game.sel = [];
                    if (game.newArray.length == 0) {
                        gameOver();
                        stopTimer();
                    }
                } else {
                    game.pause = true;
                    game.flip = setInterval(hideCard, 800);
                }
            }
        }
    });

    //Setting the pad function for timer
    function pad(val) { return val > 9 ? val : "0" + val; }
    let myTimer;
    let sec = 0;

    //Timer
    function startTimer() {
        myTimer = setInterval(function() {
            $('#seconds').html(pad(++sec % 60));
            $('#minutes').html(pad(parseInt(sec / 60, 10)));
        }, 1000);
    }

    function stopTimer() {
        clearInterval(myTimer);
    }

    function resetTimer() {
        stopTimer();
        $('#seconds').html(pad(00));
        $('#minutes').html(pad(00));
        sec = 0;
    }

    // Restart button
    $('#restart').click(function() {
        resetGame();
    });

    // Reset game
    function resetGame() {
        resetTimer();
        startTimer();
        game.clicks = 0;
        $('#score').text(game.clicks);
    }

    // Game Over 
    function gameOver() {
        $('#start').show();
        $('#restart').hide();
        $('#score').text(game.clicks);
        $('#winAudio')[0].play();
        stopTimer();
    }

    function removeItems(val) {
        game.newArray = game.newArray.filter(function(ele) {
            return ele != val;
        });
    }

    function hideCard() {
        flipper(game.sel[0]);
        flipper(game.sel[1]);
        clearInterval(game.flip);
        game.sel = [];
        game.pause = false;
        $('#cardFlipAudio')[0].play();
    }

    function flipper(el) {
        el.addClass('active');
        el.find('.back-face').show();
        el.find('.front-face').hide();
    }

    // Shuffle function
    function arrayRandomize(arr) {
        arr.sort(function() {
            return .5 - Math.random();
        });
    }
    //Start the game
    function startGame() {
        $('#start').hide();
        $('#restart').show();
        $('#mute').show();
        $('#bgMusic')[0].play();
        resetTimer();
        startTimer();
        game.clicks = 0;
        $('#score').text(game.clicks);
        game.pause = false;
        game.sel = [];
        game.newArray = colorCardsArray.concat(colorCardsArray);
        arrayRandomize(game.newArray);
        $('.game').html('');
        $.each(game.newArray, function(key, value) {
            let card = $('<div>');
            card.addClass('card active');
            card.data('cnt', '?');
            card.data('val', value);
            let back = $('<div>');
            back.addClass('back-face');
            back.html('<img>');
            card.append(back);
            let front = $('<div>');
            front.css('background-color', value);
            front.text(value);
            front.addClass('front-face');
            card.append(front);
            $('.game').append(card);
        });
    }