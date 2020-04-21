    // Global variables

    // const colorCardsArray = ['red', 'blue', 'green', 'purple', 'yellow', 'pink', 'teal', 'gold'];
    // const colorCardsArray = ['red', 'blue', 'green', 'purple', 'yellow', 'pink'];
    const colorCardsArray = ['red', 'blue'];

    const game = {};
    let silence = false;
    let sec = 0;

    // Initialize even listeners
    $('#start').click(startGame);
    $('#restart').click(startGame);
    $('#restart').hide();
    $('#pause').hide();
    // $('#pause').click(togglePlaying);

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

    // Restart button
    $('#restart').click(function() {
        resetGame();
    });

    function resetGame() {
        resetTimer();
        startTimer();
        game.clicks = 0;
        $('#score').text(game.clicks);
    }

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
                    game.flip = setInterval(hideCard, 500);
                }
            }
        }
    });

    // Game Over 
    function gameOver() {
        console.log('*****GAMEOVER*****');
        $('#start').show();
        $('#restart').hide();
        $('#pause').hide();
        $('#score').text(game.clicks);
        stopTimer();
        // alert('GAME OVER! ' + game.clicks + 'clicks');
    }

    function removeItems(val) {
        game.newArray = game.newArray.filter(function(ele) {
            return ele != val;
        });
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
        });
    }
    //Start the game
    function startGame() {
        console.log('start');
        $('#start').hide();
        $('#restart').show();
        $('#pause').show();
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