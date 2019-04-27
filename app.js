document.body.onload = restartGame();
var all_cards = [];
all_cards = document.getElementsByClassName("card");
var shuffeledone, cardslist;

////////////////////////////// start shuffle /////////////////////////////////////

function displaycards() { // cards reorder again
    var list = changecards(shuffeledone);
    replacer(list);
}

function cardsIntialization() { //intializing the cards and return the transformed array
    var domcards = [];
    domcards = document.getElementsByClassName("card");
    return transformer(domcards);
}
//-----------------------------------------------------------------------------------------
function transformer(obj) { // transform or cast the object to array for the shuffle method
    var mapped = []; // the transformed array
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) { // if the key of the object has avalue  push it's inner html to the new arrey "mapped"
            mapped.push(obj[key].innerHTML);
        }
    }
    return mapped;
}

//----------------------------------------------------
function shuffle(array) { // mix the position of cards
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//----------------------------------------------------------
function replacer(list) { // add cards(ul) to main div(deck)
    document.getElementsByClassName("deck")[0].innerHTML = list.innerHTML; //shuffle
}

//------------------------------------------
function changecards(shh) { // create new cards
    var list = document.createElement("ul");
    for (var i = 0; i < shh.length; i++) {
        var li = document.createElement("li");
        li.innerHTML = shh[i]; //put the shuffled cards in the new li
        li.classList.add("card"); // give the li a class named card
        list.appendChild(li);
    }
    console.log("from changrcard");
    return list;
}

////////////////////////////// end shuffle //////////////////////////////////////////







////////////////////////////// start game logic /////////////////////////////////////

var matchedCard = document.getElementsByClassName("match"); // invoke matched card
const cards = document.querySelectorAll('.card'); // invoke all cards
cards.forEach(card => card.addEventListener('click', flipCard)); // add event to all cards
cards.forEach(card => card.addEventListener('click', congratulations)); // add event to all cards

var moveCounter = 0;
var hasFlippedCard = false;
var lockBoard = false;
var firstCard, secondCard;

//-------------------------------------------------
function flipCard() { // flip card when click on it
    if (lockBoard) return;
    if (this === firstCard) return; // handel double click
    this.classList.add('open', 'show');
    if (!hasFlippedCard) {
        // first click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    // second click
    rateController();
    secondCard = this;
    checkForMatch();
}

//---------------------------------------------------------
function checkForMatch() { // chech if 2 cards match or not
    if (firstCard.firstElementChild.className === secondCard.firstElementChild.className) {
        disableCards(); // match
    } else {
        unflipCards(); // not match
    }
}

//---------------------------------------------------
function disableCards() { // when 2 cards are matched
    firstCard.removeEventListener('click', flipCard);
    firstCard.classList.add('match');
    secondCard.removeEventListener('click', flipCard);
    secondCard.classList.add('match');
    resetBoard();
}

//------------------------------------------------------
function unflipCards() { // when 2 cards are not matched
    firstCard.classList.add('unmatched');
    secondCard.classList.add('unmatched');
    console.log(firstCard);
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('open', 'show', "unmatched");
        secondCard.classList.remove('open', 'show', "unmatched");
        resetBoard();
    }, 1500);
}

//----------------------------------------------------
function resetBoard() { // reset vars after any action
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

//--------------------------------------------------------------
function rateController() { // manage move counter and rate stars
    moveCounter++;
    $('.moves').text(moveCounter);
    //start timer on first click
    if (moveCounter == 1) {
        second = 0;
        minute = 0;
        hour = 0;
        startTimer();
    }
    const stars = document.querySelectorAll(".fa-star");
    // setting rates based on moves
    if (moveCounter > 8 && moveCounter < 12) {
        for (i = 0; i < 3; i++) {
            if (i > 1) {
                stars[i].style.color = "gray";
            }
        }
    } else if (moveCounter > 13) {
        for (i = 0; i < 3; i++) {
            if (i > 0) {
                stars[i].style.color = "gray";
            }
        }
    }
}

//-----------------------------------
var second = 0,
    minute = 0,
    hour = 0;
var timer = document.querySelector(".timer");
var interval;

function startTimer() { // create timer
    interval = setInterval(function () {
        timer.innerHTML = minute + " mins " + second + " secs ";
        second++;
        if (second == 60) {
            minute++;
            second = 0;
        }
        if (minute == 60) {
            hour++;
            minute = 0;
        }
    }, 1000);
}

//------------------------------------------------------------------------
function restartGame() { // reset all components in the game when it finish
    resetBoard();
    // mix cards
    cardslist = cardsIntialization();
    shuffeledone = shuffle(cardslist);
    displaycards();
    // reset cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.classList.remove('open', 'show', 'match', 'unmatched'));
    cards.forEach(card => card.addEventListener('click', flipCard)); // add event to all cards
    cards.forEach(card => card.addEventListener('click', congratulations)); // add event to all cards
    // reset moves
    moveCounter = 0;
    $('.moves').text(moveCounter);
    // reset timer
    second = 0;
    minute = 0;
    hour = 0;
    var timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);
    // reset stars
    const stars = document.querySelectorAll(".fa-star");
    for (i = 0; i < 3; i++) {
        stars[i].style.color = "yellow";
    }
}

//----------------------------------------------------------------------------------------
function congratulations() { //when all cards match, show modal and moves, time and rating
    if (matchedCard.length == 16) { // if all cards were opend
        clearInterval(interval); // stop timer
        var finalTime = timer.innerHTML;
        // show congratulations modal
        $(".modal").css("display", "block");
        $(".modal").addClass("show");
        $(".modal-backdrop").css("display", "block");
        $(".modal-backdrop").addClass("show");
        // declare star rating variable
        var starRating = document.querySelector(".stars").innerHTML;
        //showing move, rating, time on modal
        document.getElementById("finalMove").innerHTML = moveCounter;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = finalTime;
    };
}

//----------------------------------------------
function playAgain() { // restart the game again
    $(".modal").css("display", "none");
    $(".modal").removeClass("show");
    $(".modal-backdrop").css("display", "none");
    $(".modal-backdrop").removeClass("show");
    restartGame();
}

////////////////////////////// end game logic /////////////////////////////////////
