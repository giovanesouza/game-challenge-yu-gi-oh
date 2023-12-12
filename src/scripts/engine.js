// Estados de memória da aplicação
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'),
    },
    // imagens do card
    cardsSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },
    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card'),
    },
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector('#player-cards'),
        computer: "computer-cards",
        computerBox: document.querySelector('#computer-cards')
    },
    actions: {
        button: document.getElementById('next-duel'),
    }
};


const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper", // Utilizado para definir quem vai ganhar
        img: `${pathImages}dragon.png`,
        WinOf: [1], // Ganha para a carta de id 1
        LoseOf: [2] // perde para a carta com id 2
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1]
    },
];

// Seta as cartas em campo
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);

    return cardData[randomIndex].id;
};

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    cardImage.setAttribute('data-id', idCard);
    cardImage.classList.add('card');

    // Permite o clique apenas do lado do player
    if (fieldSide === state.playerSides.player1) {

        cardImage.addEventListener('mouseover', () => {
            drawSelectCard(idCard);
        });

        cardImage.addEventListener('click', () => {
            setCardsField(cardImage.getAttribute('data-id'));
        });

    };

    return cardImage; // Retorna as imagens criadas

};


// Seta as cardas no campo
async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    // Verifica quem ganhou
    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
};


async function removeAllCardsImages() {

    let { computerBox, player1Box } = state.playerSides;

    let cards = computerBox;
    let imgElements = cards.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());

    cards = player1Box;
    imgElements = cards.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());

};

async function drawSelectCard(index) {
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = "Attribute: " + cardData[index].type;
};


// Preenche as cartas do player e computer
async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
};

// Chama o estado inicial do jogo
function init() {
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
};

init();