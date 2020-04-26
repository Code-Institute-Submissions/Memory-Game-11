    // Global variables

    // Cards arrays
    const easyArray = ['red', 'blue', 'green', 'purple', ];
    const mediumArray = ['red', 'blue', 'green', 'purple', 'yellow', 'pink'];
    const hardArray = ['red', 'blue', 'green', 'purple', 'yellow', 'pink', 'teal', 'gold'];
    const game = {};
    let colorCardsArray = [];
    
    // Audio variables 
    let silence = false;
    buttonClickAudio.volume = 0.5;
    cardFlipAudio.volume = 0.5;
    correctMatchAudio.volume = 0.5;
    winAudio.volume = 0.8;
    bgMusic.volume = 0.6;
    bgMusic.loop = true;

    // Timer variables
    let myTimer = null;
    let sec = 0;

    // Initialize even listeners

    $('#restart').click(startGame);
    $('#restart').hide();
    $('#mute').hide();

    // Play button click audio on all button elements
    
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

    // Mute audio function, original code from: https://css-tricks.com/forums/topic/mute-unmute-sounds-on-website/

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

     /**When an element with the class buttons is clicked difficulty is set 
     * with the ID of the child element that was clicked
     **/

    $('.buttons').click(function() {
        difficulty(this.children[0].id);
    });

    //  When difficulty is set with a value it will run the code associated with that "case"

    function difficulty(value) {
        switch (value) {
            case "easy":
                startGame();
                colorCardsArray = easyArray;
                selectedDifficulty = "easy";
                break;
            case "medium":
                startGame();
                colorCardsArray = mediumArray;
                selectedDifficulty = "medium";
                break;
            case "hard":
                startGame();
                colorCardsArray = hardArray;
                selectedDifficulty = "hard";
            default:
                break;
        }
    };

    // Game play event listeners

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
                    $('#correctMatchAudio')[0].play();
                    removeItems(game.sel[0].data('val'));
                    game.sel = [];
                    if (game.newArray.length == 0) {
                        gameOver();
                        stopTimer();
                    }
                } else {
                    game.pause = true;
                    game.flip = setInterval(hideCard, 1000);
                }
                //check match
            }
        }
    });

    // Setting the pad function for timer

    function pad(val) { return val > 9 ? val : "0" + val; }
    
    // Timer functions that can be started, stoped and reseted 

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
        $('#restart').hide();
        $('#score').text(game.clicks);
        $('#winAudio')[0].play();
        $('#winModal').modal('show');
        stopTimer();
    }

    // Remove the matched cards from the array

    function removeItems(val) {
        game.newArray = game.newArray.filter(function(ele) {
            return ele != val;
        });
    }

    // Flip the cards

    function hideCard() {
        flipper(game.sel[0]);
        flipper(game.sel[1]);
        clearInterval(game.flip);
        game.sel = [];
        game.pause = false;
        $('#cardFlipAudio')[0].play();
    }

    // Flip the cards back

    function flipper(el) {
        el.addClass('active');
        el.find('.back-face').show();
        el.find('.front-face').hide();
    }

    // Shuffle function randomizing the selected array

    function arrayRandomize(arr) {
        arr.sort(function() {
            return .5 - Math.random();
        });
    }

    // Starts the game function that creates the html elements

    function startGame() {
        $('#restart').show();
        $('#mute').show();
        $('#bgMusic')[0].play();
        $('#winModal').modal('hide');
        resetTimer();
        startTimer();
        game.clicks = 0;
        $('#score').text(game.clicks);
        game.pause = false;
        game.sel = [];
        game.newArray = colorCardsArray.concat(colorCardsArray); //doubles the selected array
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

    /**When the element with the ID infoModal is clicked
     * Info Modal is shown
     **/

    $('#infoModal').click(function() {
        $('#info').modal('show');
    });
    
    // winModal
    $('#winModal').on('show.bs.modal', function(event) {
        let moves = $(event.relatedTarget);
        let timerHtml = $('.timer').html();
        let winTime = timerHtml.replace("Timer:", "")
        content = $('#winScore').html("You finished the game in" + winTime + " with " + game.clicks + " moves."),
            modal = $(this);
        modal.find('.modal-body').html(content);
    });

    /**Reload the page when the button refresh is clicked on winModal
     * This will reload the page destroying the older cache and displaying the contents from scratch 
     **/

    $('#refresh').click(function() {
        location.reload(true);
    });