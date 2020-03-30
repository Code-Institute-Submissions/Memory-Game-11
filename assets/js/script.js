$(document).ready(function() {

    // Global variables

    const cards = ['red', 'blue', 'green', 'purple', 'yellow', 'pink', 'teal', 'gold'];
    const game = {};

    // Game Play
    $('.startBtn').click(startGame);
    $('#restart').click(startGame);
    $('#restart').hide();

    $('.game').on("click", ".active", function(event) {
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
                    removeItems(game.sel[0].data('val'));
                    game.sel = [];
                    if (game.newArray.length == 0) {
                        gameOver();
                    }
                } else {
                    game.pause = true;
                    game.timer = setInterval(hideCard, 1000);
                }
            }
        }
    });

    function gameOver() {
        $('.startBtn').show();
        $('#restart').hide();
        $('#score').text(game.clicks + 'clicks');
    }

    function removeItems(val) {
        game.newArray = game.newArray.filter(function(ele) {
            return ele != val;
        })
    }

    function hideCard() {
        flipper(game.sel[0]);
        flipper(game.sel[1]);
        clearInterval(game.timer);
        game.sel = [];
        game.pause = false;
    }

    function flipper(el) {
        el.addClass('active');
        el.find('.back-face').show();
        el.find('.front-face').hide();
    }

    function arrayRandomize(arr) {
        arr.sort(function() {
            return .5 - Math.random();
        })
    }

    function startGame() {
        $('.startBtn').hide();
        $('#restart').show();
        game.clicks = 0;
        game.pause = false;
        game.sel = [];
        game.newArray = cards.concat(cards);

        arrayRandomize(game.newArray);
        $('.game').html('');
        $.each(game.newArray, function(key, value) {
            let card = $('<div>');
            card.addClass('card active');
            card.data('cnt', '?');
            card.data('val', value);
            let back = $('<div>');
            back.addClass('back-face');
            back.html('?');
            card.append(back);
            let front = $('<div>');
            front.css('background-color', value);
            front.text(value);
            front.addClass('front-face');
            card.append(front);
            $('.game').append(card);
        })
    }

});