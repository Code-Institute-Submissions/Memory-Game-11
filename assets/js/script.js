    // Global variables

    const colorCardsArray = ['red', 'blue', 'green', 'purple', 'yellow', 'pink', 'teal', 'gold'];
    // const colorCardsArray = ['red', 'blue'];
    const game = {};
    let button;
    let countdown = 90;
    let sec = 0;

    function pad(val) { return val > 9 ? val : "0" + val; }
    let func;

    //Start timer
    function startTimer() {
        func = setInterval(function() {
            $('#seconds').html(pad(++sec % 60));
            $('#minutes').html(pad(parseInt(sec / 60, 10)));
        }, 1000);
    }

    function stopTimer() {
        clearInterval(func);
    }

    function resetTimer() {
        stopTimer();
        $('#seconds').html(pad(00));
        $('#minutes').html(pad(00));
        sec = 0;
    }

    // Toggle Playing 
    // function togglePlaying() {
    //     if (!gameOver()) {
    //         game.play = true;

    //     } else {
    //         game.pause = true;
    //         button.html('play')
    //     }
    // }

    // Initialize even listeners
    $('#start').click(startGame);
    $('#reset').click(startGame);
    $('#reset').hide();
    $('#pause').hide();
    // $('#pause').click(togglePlaying);

    $('.game').on("click", ".active", function(event) {
        console.log($(this).data('val'));
        if (!game.pause) {
            game.clicks++;
            $('#score').text(game.clicks);
            game.sel.push($(this));
            $(this).removeClass('active');
            $(this).find('.back-face').hide();
            $(this).find('.front-face').show();
            if (game.sel.length === 2) {
                if (game.sel[0].data('val') == game.sel[1].data('val')) {
                    game.pause = false;
                    console.log('Match');
                    removeItems(game.sel[0].data('val'));
                    game.sel = [];
                    if (game.newArray.length == 0) {
                        console.log('GAME OVER');
                        gameOver();
                        stopTimer();
                    }
                } else {
                    game.pause = true;
                    game.flip = setInterval(hideCard, 1000);
                }
            }
        }
    });

    // Game Over 
    function gameOver() {
        console.log('*********GAMEOVER*********');
        $('#start').show();
        $('#reset').hide();
        $('#pause').hide();
        $('#score').text(game.clicks);
        stopTimer();
        // alert('GAME OVER! ' + game.clicks + 'clicks');
    }

    // Reset
    function reset() {
        console.log('RESET');
        game.clicks = 0;
    }

    function removeItems(val) {
        console.log(game.newArray);
        game.newArray = game.newArray.filter(function(ele) {
            return ele != val;
        })
    }

    function hideCard() {
        console.log('no match');
        flipper(game.sel[0]);
        flipper(game.sel[1]);
        clearInterval(game.flip);
        game.sel = [];
        game.pause = false;
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
        })
    }
    //Start the game
    function startGame() {
        console.log('start');
        $('#start').hide();
        $('#reset').show();
        $('#pause').show();
        startTimer();
        reset();
        game.clicks = 0;
        game.pause = false;
        game.sel = [];
        game.newArray = colorCardsArray.concat(colorCardsArray);
        console.log(game.newArray);
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