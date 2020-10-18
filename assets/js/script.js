// Global variables
// (we'll get rid of these as a luxury)
let movesMade = 0;
let timeLeft = 30;
let checkArray = [];

// Card List Information
var fellowshipCardList = [
    {name:"Frodo", image:"frodo-baggins.jpg"},
    {name:"Samwise", image:"samwise-gamgee.jpg"},
    {name:"Gandalf", image:"gandalf-the-grey.jpg"},
    {name:"Gimli", image:"gimli-son-of-gloin.jpg"},
    {name: "Aragorn", image:"aragorn.jpg"},
    {name: "Legolas", image:"legolas.jpg"},
    {name: "Boromir", image:"boromir.jpg"},
    {name: "Elrond", image:"elrond.jpg"},
]


// Moves Counter Constructor
class movesCounter {
    constructor(){

    }

    startMovesCounter() {
        $(".game-card").on("click", function(){
            movesMade ++;
            document.getElementById("movesCounter").textContent = movesMade;
        })
    }

    resetMovesCounter() {
        movesMade = 0;
        document.getElementById("movesCounter").textContent = movesMade;
        this.startMovesCounter();
    }
};


//Pairs Counter Constructor
class pairsCounter {
    constructor() {
    this.pairsMatched = null;
    }
    
    incrementPairsCounter() {
        this.pairsMatched ++;
        document.getElementById("pairs").textContent = this.pairsMatched;
    }

    resetPairsCounter(){
        this.pairsMatched = 0;
        document.getElementById("pairs").textContent = this.pairsMatched;
    }
}

//Count Down Timer Constructor
class Timer {
    constructor(time) {
        this.time = time;
        this.levelTimer = null;
        this.startTimer();
    }

    startTimer() {
        timeLeft = this.time;
        this.levelTimer = setInterval(function(){
            if (timeLeft >= 0) {
                document.getElementById("timeRemaining").textContent = timeLeft;
                timeLeft--;               
            }
        }, 1000);
        console.log(this.levelTimer);
    }

    stopTimer() {
        clearInterval(this.levelTimer);
    }

    resetTimer() {
        this.stopTimer();
        this.startTimer();
    }
};


//Card Constructor
class Card {
    constructor(name, image, cardId) {
        this.name = name;
        this.image = image;
        this.cardId = cardId;
        this.html = 
            `<div class="game-card" id="${this.cardId}" >
                <div class="card-front">
                    <img src="assets/images/${this.image}" class="card-image" alt="${this.name}" >
                    <p>${this.name}</p>
                </div>
                <div class="card-back">
                    <img src="assets/images/card-back-green.png" class="card-image show" alt="Tree of Gondor Image">
                </div>
            </div>`;
    }

        is_equal_to(otherCard) {
            if (otherCard.name === this.name) {
                return true;
            } else {
                return false;
            }
        }
};


// Make a new deck of new cards for each level dependent on the number of divs to be filled
function makeDeck(num, array) {
    var newDeck = [];
    cardCounter = 0;
    for (let i = 0; i < num ; i ++) {
        cardCounter++;
        var newCardA = new Card(array[i].name, array[i].image, "card" + cardCounter.toString());
        cardCounter++;
        var newCardB = new Card(array[i].name, array[i].image, "card" + cardCounter.toString());
        newDeck.push(newCardA);
        newDeck.push(newCardB);
    }
    console.log(newDeck.length);
    return newDeck;
};


// Assign cards to the divs and print the names of the characters underneath.
function assignCards(){
    var cardSlots = document.getElementsByClassName('game-card-column');
    levelDeck = makeDeck(cardSlots.length / 2, fellowshipCardList);
    for (var i = 0; i < cardSlots.length; i ++){
        //var gameCard = getRandomCard(levelDeck);
        var gameCard = levelDeck[i];
        cardSlots[i].innerHTML = gameCard.html;
    }
    //When card is clicked reveal front-of-card.
    $(".game-card").click(function (){
        $(this).children(".card-front").toggleClass("face-up");
        var cardName = $(this).children().children("p").text();
        
        // if checkArray length is equal to 0 add the first card name and id to the array
        if (checkArray.length === 0) {    
            var cardId = $(this).attr("id");
            checkArray.push([cardName, cardId]);
        }
        // check and see whether the cards match
        else {
            if (checkArray[0][0] == cardName) {
                console.log("we match even though I am not also in the array");
                pairs.incrementPairsCounter();
                checkArray.splice(0, 1);
            }
            else if (checkArray[0][0] !== cardName) {
                console.log("we do not match");
                //$(this).children().removeClass("face-up");
                checkArray.splice(0, 1);
            }
        }
    });
};


$(document).ready(function(){
    //creates new timer and starts it
    timer = new Timer(30);
    moves = new movesCounter();
    moves.startMovesCounter();
    pairs = new pairsCounter();
});


// On receiving the Advance Level message.
// Clone card-row-2 and reclassify clone as extra-row.
document.getElementById("advanceButton").addEventListener("click", function() {
    $(".card-row-2").clone().removeClass( "card-row-2" ).addClass( "extra-row" ).appendTo("#gameBoard");
    assignCards();
    timer.resetTimer();
    moves.resetMovesCounter();
    pairs.resetPairsCounter();
});


assignCards();


// On receiving the Home Button clicked message.
// Delete the level 2 and/or level 3 card rows with the class "extra-row".
// Assign cards to the first eight divs.
$(".restart").click(function(){
    $(".extra-row").remove();
    assignCards();
    timer.resetTimer();
    moves.resetMovesCounter();
});