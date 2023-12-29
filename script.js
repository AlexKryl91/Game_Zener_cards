// ===> CONSTANTS ==================================================================
const topBar = document.querySelector('.top-bar');
const bottomBar = document.querySelector('.bottom-bar');
const gameField = document.querySelector('.game-field');
const dynamicField = document.querySelector('.dynamic-field');
const mainHeader = document.querySelector('.header_main');
const subHeader = document.querySelector('.header_sub');
const restartBtn = document.querySelector('.restart-btn');
// Creating playing cards
const cards = [];
for (let i = 0; i < 20; i++) {
  let div = document.createElement('div');
  div.className = 'card active';
  div.innerHTML = '<div class="back"></div><div class="face"></div>';
  gameField.append(div);
  cards.push(div);
}

// ===> FUNCTIONS ==================================================================
function scoreEstimation(score) {
  if (score == 10) {
    return "Wow! You're a psychic!?";
  }
  if (score <= 15) {
    return 'Good intuition!';
  }
  if (score <= 20) {
    return 'Impressive!';
  }
  if (score <= 25) {
    return 'Nice try';
  } else {
    return 'You can do better';
  }
}

function cardBehavior(...cardNodes) {
  cardNodes.forEach((el) => {
    el.style.transform = el.classList.toggle('active')
      ? 'rotateY(0deg)'
      : 'rotateY(180deg)';
  });
}
// Random shuffling of symbols on the faces of cards
function randomCardShuffle(cardNodes) {
  let randomValues = new Set();
  while (randomValues.size < 20) {
    randomValues.add(Math.round(Math.random() * 19));
  }

  let positionArr = Array.from(randomValues).map(
    (el, i) => Math.floor(el / 4) * 25
  );

  cardNodes.forEach((el, i) => {
    el.lastChild.style.backgroundPosition = `${positionArr[i]}% 0%`;
  });

  // return arrayOfTags;
}

// ===> MAIN ==================================================================
randomCardShuffle(cards);
let moveCounter = 0;
let activeCounter = cards.length;
let previuos; // to memorize the first card in pair
let isAnimationEnded = true; // to account for animation delay when selecting a new card
//
setTimeout(() => {
  topBar.classList.add('moveUp');
  bottomBar.classList.add('moveDown');
}, 1400);
//

gameField.addEventListener('click', (event) => {
  let node = event.target.closest('.active');
  if (node && isAnimationEnded) {
    cardBehavior(node);
    activeCounter--;

    if (previuos === undefined) {
      previuos = node;
    } else {
      //
      moveCounter++;
      //
      if (
        previuos.lastChild.style.backgroundPosition !==
        node.lastChild.style.backgroundPosition
      ) {
        activeCounter += 2;
        isAnimationEnded = false;
        setTimeout(
          (previousCard, currentCard) => {
            cardBehavior(previousCard, currentCard);
            isAnimationEnded = true;
          },
          500,
          previuos,
          node
        );
      }
      //
      previuos = undefined;
    }

    if (activeCounter === 0) {
      //
      //
      mainHeader.textContent = 'WELL DONE';
      subHeader.textContent = `You did it in ${moveCounter} moves. ${scoreEstimation(
        moveCounter
      )}`;
      //
      restartBtn.classList.toggle('hidden');
      //
      topBar.classList.replace('moveUp', 'toDefaultPosition');
      bottomBar.classList.replace('moveDown', 'toDefaultPosition');
      dynamicField.classList.replace('disappear', 'appear');
      //
    }
  }
});

// <=== MAIN ==================================================================

restartBtn.onclick = () => {
  // Reinitialize procedure
  moveCounter = 0;
  activeCounter = cards.length;
  cardBehavior(...cards);
  randomCardShuffle(cards);
  //
  //
  mainHeader.textContent = 'GOOD LUCK';
  subHeader.textContent = 'Trust your senses!';
  //
  restartBtn.classList.toggle('hidden');
  //
  topBar.classList.replace('toDefaultPosition', 'moveUp');
  bottomBar.classList.replace('toDefaultPosition', 'moveDown');
  dynamicField.classList.replace('appear', 'disappear');
  //
};
