class QuemDisseGame {
    constructor() {
        this.players = [];
        this.sentences = [];
        this.currentWriterIndex = 0;
        this.currentSentenceIndex = 0;
        this.selectedPlayer = null;
        this.round = 1;
    }

    init() {
        this.showScreen('setup-screen');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
}

const game = new QuemDisseGame();

function setupPlayers() {
    const count = parseInt(document.getElementById('player-count').value);
    if (count < 2 || count > 8) {
        alert('Número de jogadores deve ser entre 2 e 8!');
        return;
    }

    const nameInputsDiv = document.getElementById('name-inputs');
    nameInputsDiv.innerHTML = '';
    
    for (let i = 0; i < count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Nome do Jogador ${i + 1}`;
        input.id = `player-${i}`;
        nameInputsDiv.appendChild(input);
    }
    
    document.getElementById('player-names').classList.remove('hidden');
}

function startGame() {
    const playerInputs = document.querySelectorAll('#name-inputs input');
    game.players = [];
    
    playerInputs.forEach((input, index) => {
        const name = input.value.trim() || `Jogador ${index + 1}`;
        game.players.push({
            name: name,
            score: 5,
            sentences: []
        });
    });
    
    game.sentences = [];
    game.currentWriterIndex = 0;
    game.round = 1;
    
    startWritingPhase();
}

function startWritingPhase() {
    game.showScreen('writing-screen');
    showCurrentWriter();
}

function showCurrentWriter() {
    const writerName = game.players[game.currentWriterIndex].name;
    document.getElementById('writer-name').textContent = writerName;
    document.getElementById('sentence-input').value = '';
    document.getElementById('sentence-input').focus();
}

function submitSentence() {
    const sentence = document.getElementById('sentence-input').value.trim();
    if (!sentence) {
        alert('Por favor, escreva uma frase!');
        return;
    }
    
    game.sentences.push({
        text: sentence,
        author: game.currentWriterIndex
    });
    
    game.currentWriterIndex++;
    
    if (game.currentWriterIndex < game.players.length) {
        showCurrentWriter();
    } else {
        startGuessingPhase();
    }
}

function startGuessingPhase() {
    game.currentSentenceIndex = 0;
    shuffleArray(game.sentences);
    game.showScreen('guessing-screen');
    showCurrentSentence();
}

function showCurrentSentence() {
    const sentence = game.sentences[game.currentSentenceIndex];
    document.getElementById('current-sentence').textContent = `"${sentence.text}"`;
    
    const optionsDiv = document.getElementById('player-options');
    optionsDiv.innerHTML = '';
    
    game.players.forEach((player, index) => {
        const option = document.createElement('div');
        option.className = 'player-option';
        option.textContent = player.name;
        option.onclick = () => selectPlayer(index);
        optionsDiv.appendChild(option);
    });
    
    game.selectedPlayer = null;
}

function selectPlayer(playerIndex) {
    document.querySelectorAll('.player-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    document.querySelectorAll('.player-option')[playerIndex].classList.add('selected');
    game.selectedPlayer = playerIndex;
}

function submitGuess() {
    if (game.selectedPlayer === null) {
        alert('Por favor, selecionem um jogador!');
        return;
    }
    
    const sentence = game.sentences[game.currentSentenceIndex];
    const correct = game.selectedPlayer === sentence.author;
    
    showRoundResult(correct, sentence.author);
}

function showRoundResult(correct, authorIndex) {
    game.showScreen('result-screen');
    
    const resultDiv = document.getElementById('round-result');
    const sentence = game.sentences[game.currentSentenceIndex];
    const authorName = game.players[authorIndex].name;
    
    if (correct) {
        game.players[authorIndex].score--;
        resultDiv.innerHTML = `
            <h3>✅ Vocês acertaram!</h3>
            <p>A frase "${sentence.text}" foi escrita por <strong>${authorName}</strong></p>
            <p><strong>${authorName}</strong> perdeu 1 ponto!</p>
        `;
    } else {
        resultDiv.innerHTML = `
            <h3>❌ Vocês erraram!</h3>
            <p>A frase "${sentence.text}" foi escrita por <strong>${authorName}</strong></p>
            <p>Ninguém perde pontos nesta rodada.</p>
        `;
    }
    
    updateScoreboard();
    
    if (checkGameEnd()) {
        setTimeout(() => showVictory(), 2000);
    }
}

function updateScoreboard() {
    const scoreboardDiv = document.getElementById('scoreboard');
    scoreboardDiv.innerHTML = '<h3>Placar:</h3>';
    
    game.players.forEach(player => {
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'player-score';
        scoreDiv.innerHTML = `
            <span>${player.name}</span>
            <span class="${player.score < 5 ? 'score-lost' : ''}">${player.score} pontos</span>
        `;
        scoreboardDiv.appendChild(scoreDiv);
    });
}

function checkGameEnd() {
    const playersWithPoints = game.players.filter(p => p.score > 0);
    return playersWithPoints.length <= 1;
}

function showVictory() {
    const winner = game.players.find(p => p.score > 0);
    game.showScreen('victory-screen');
    
    document.getElementById('winner-announcement').innerHTML = 
        winner ? `🏆 ${winner.name} venceu com ${winner.score} pontos! 🏆` 
               : '🤝 Empate! Todos perderam seus pontos! 🤝';
}

function nextRound() {
    game.currentSentenceIndex++;
    
    if (game.currentSentenceIndex < game.sentences.length) {
        game.showScreen('guessing-screen');
        showCurrentSentence();
    } else {
        game.round++;
        game.sentences = [];
        game.currentWriterIndex = 0;
        startWritingPhase();
    }
}

function restartGame() {
    game.init();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Inicializar o jogo
game.init();