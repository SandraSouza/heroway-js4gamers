/* ===================================================================================================
>> Heroway - Game
>> Data: 28/02/2021
>> Sandra Souza
=================================================================================================== */

/* ===================================================================================================
>> Parametros do jogo
=================================================================================================== */

const TILE_SIZE = 48;
const HELMET_OFFSET = 12;
const GAME_SIZE = TILE_SIZE * 20;

const root = document.documentElement;
      root.style.setProperty('--tile-size',     `${TILE_SIZE}px`); //48px
      root.style.setProperty('--helmet-offset', `${HELMET_OFFSET}px`); //12px
      root.style.setProperty('--game-size',     `${GAME_SIZE}px`); //960px

/* ===================================================================================================
>> Botão Reset - reinicia o game
=================================================================================================== */

const resetButton = document.getElementById('reset');
      resetButton.addEventListener('click', () => {
      location.reload();
})

/* ===================================================================================================
>> Contador - contagem de passos do Hero
=================================================================================================== */

let initialSteps = 50;
let currentSteps = initialSteps;
const stepsCounter = document.getElementById('steps');
      stepsCounter.innerHTML = `Passos: ${initialSteps}`;

/* ===================================================================================================
>> CreateBoard - cria a lógica do jogo
=================================================================================================== */

function createBoard() {

    const boardElement = document.getElementById('board');
    const elements = [];

    // Cria os elementos, com base nos parâmetros passados.
    function createElement(options) {

        let { item, top, left } = options;
        const currentElement = { item, currentPosition: { top, left } };

        elements.push(currentElement);

        const htmlElement = document.createElement('div');
              htmlElement.className = item;
              htmlElement.style.top = `${top}px`;
              htmlElement.style.left = `${left}px`;

        boardElement.appendChild(htmlElement);

    // Movimenta o Hero de acordo com a tecla pressionada.
    function getNewDirection(buttonPressed, position) {

        switch (buttonPressed) {

            case 'ArrowUp':
            return { top: position.top - TILE_SIZE, left: position.left };

            case 'ArrowRight':
            return { top: position.top, left: position.left + TILE_SIZE };

            case 'ArrowDown':
            return { top: position.top + TILE_SIZE, left: position.left };

            case 'ArrowLeft':
            return { top: position.top, left: position.left - TILE_SIZE };

            default:
                return position;
        }
    }

    // Valida os movimentos
    function validateMoviment(position, conflictItem) {

        return (
            position.left >= 48 &&
            position.left <= 864 &&
            position.top >= 96 &&
            position.top <= 816 &&
            conflictItem?.item !== 'forniture'
        );
    }

    // Verifica se houve conflito
    function getMovimentConflict(position, els) {

        const conflictItem = els.find((currentElement) => {

        return (
            currentElement.currentPosition.top === position.top &&
            currentElement.currentPosition.left === position.left
            );

        });

        return conflictItem;
    }

    // Valida os conflitos
    function validateConflicts(currentEl, conflictItem) {

        function finishGame(message) {

            setTimeout(() => {
                alert(message);
                location.reload();
            }, 100);

        }

        if (!conflictItem) {
            return;
        }

        if (currentEl.item === 'hero') {

            if (conflictItem.item === 'mini-demon' || conflictItem.item === 'trap') {
                finishGame('Você Morreu!');
            }

            if (conflictItem.item === 'chest') {
                finishGame('Parabéns, você venceu =]');
            }
        }

        if (currentEl.item === 'mini-demon' && conflictItem.item === 'hero') {
            finishGame('Você Morreu!');
        }
    }

    // Movimenta o hero e valida os movimentos
    function move(buttonPressed) {

        const newPosition = getNewDirection(buttonPressed, currentElement.currentPosition);
        const conflictItem = getMovimentConflict(newPosition, elements);
        const isValidMoviment = validateMoviment(newPosition, conflictItem);

        if (isValidMoviment) {

            currentElement.currentPosition = newPosition;
            htmlElement.style.top =  `${newPosition.top}px`;
            htmlElement.style.left = `${newPosition.left}px`;

            // Verifica se o item que se moveu é o Hero.
            if(currentElement.item === 'hero') {

                // Verifica se a tecla pressionada é válida.
                if (buttonPressed === 'ArrowUp' ||
                    buttonPressed === 'ArrowRight' ||
                    buttonPressed === 'ArrowDown' ||
                    buttonPressed === 'ArrowLeft') {

                    // Diminui um passo e atualiza no contador.
                    currentSteps--;
                    stepsCounter.innerHTML = `Passos: ${currentSteps}`;

                }
            }

            // Se o contador chegar em 0, encerra o jogo e recarrega com o contador no valor inicial.
            if (currentSteps === 0) {

                setTimeout(() => {
                    alert('Você Perdeu!');
                    location.reload();
                    currentSteps = initialSteps;
                }, 100);
            }

            validateConflicts(currentElement, conflictItem);
        }
    }

    return {
        move: move
    };

}

/* ===================================================================================================
>> Cria um novo item
=================================================================================================== */

    function createItem(options) {
        createElement(options);
    }

/* ===================================================================================================
>> Cria o 'Hero'
=================================================================================================== */

    function createHero(options) {

        const hero = createElement({
            item: 'hero',
            top: options.top,
            left: options.left
        });

        document.addEventListener('keydown', (event) => {
            hero.move(event.key)
        });
    }

/* ===================================================================================================
>> Cria os 'inimigos - Mini-Demon'
=================================================================================================== */

    function createEnemy(options) {

        const enemy = createElement({
            item: 'mini-demon',
            top: options.top,
            left: options.left
        });

        setInterval(() => {

            const direction = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
            const randomIndex = Math.floor(Math.random() * direction.length);
            const randomDirection = direction[randomIndex];

            enemy.move(randomDirection);

        }, 1500);

    }

    return {
        createItem: createItem,
        createHero: createHero,
        createEnemy: createEnemy
    };

}

/* ===================================================================================================
>> Board - Cria uma instancia do game
=================================================================================================== */

    const board = createBoard();

/* ===================================================================================================
>> Posicao inicial do Hero
=================================================================================================== */

    board.createHero({ top: TILE_SIZE * 16, left: TILE_SIZE * 2 });

/* ===================================================================================================
>> Pergunta ao jogador quantos 'inimigos', ele quer enfrentar e em seguida os cria e posiciona
=================================================================================================== */

    let enemiesCount = Number( prompt('Quantos inimigos quer enfrentar?') );

    for(let i = 0; i < enemiesCount; i++) {

        const randomTop = Math.floor(Math.random() * 16 + 2);
        const randomLeft = Math.floor(Math.random() * 16 + 2);

        board.createEnemy({ top: TILE_SIZE * randomTop, left: TILE_SIZE * randomLeft });

    }

/* ===================================================================================================
>> Itens - Cria e posiciona os elementos 'chest' e 'trap'
=================================================================================================== */

    board.createItem({ item: 'chest', top: TILE_SIZE * 2,  left: TILE_SIZE * 18 });
    board.createItem({ item: 'trap',  top: TILE_SIZE * 10, left: TILE_SIZE * 10 });
    board.createItem({ item: 'trap',  top: TILE_SIZE * 5,  left: TILE_SIZE * 5  });
    board.createItem({ item: 'trap',  top: TILE_SIZE * 12, left: TILE_SIZE * 7  });
    board.createItem({ item: 'trap',  top: TILE_SIZE * 14, left: TILE_SIZE * 15 });

/* ===================================================================================================
>> Forniture - Cria e posiciona elementos invisíveis 'forniture' em determinados objetos do board
=================================================================================================== */

    board.createItem({ item: 'forniture', top: TILE_SIZE * 17, left: TILE_SIZE * 2  });
    board.createItem({ item: 'forniture', top: TILE_SIZE * 2,  left: TILE_SIZE * 3  });
    board.createItem({ item: 'forniture', top: TILE_SIZE * 2,  left: TILE_SIZE * 8  });
    board.createItem({ item: 'forniture', top: TILE_SIZE * 2,  left: TILE_SIZE * 16 });