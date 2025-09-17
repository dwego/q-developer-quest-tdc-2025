# Arquitetura do Jogo "Quem Disse?"

## Visão Geral da Arquitetura

### Camada de Apresentação (Frontend)
- **index.html**: Interface principal com 5 telas distintas
- **style.css**: Estilos responsivos e design visual
- **script.js**: Lógica completa do jogo

### Estrutura de Classes

```
QuemDisseGame
├── players[]          // Array de jogadores
├── sentences[]        // Array de frases
├── currentWriterIndex // Índice do escritor atual
├── currentSentenceIndex // Índice da frase atual
├── selectedPlayer     // Jogador selecionado na votação
└── round             // Rodada atual
```

### Fluxo de Estados (State Machine)

1. **Setup Screen** → Configuração de jogadores
2. **Writing Screen** → Fase de escrita de frases
3. **Guessing Screen** → Fase de adivinhação
4. **Result Screen** → Resultado da rodada
5. **Victory Screen** → Tela de vitória

### Estrutura de Dados

#### Player Object
```javascript
{
  name: string,
  score: number (inicial: 5),
  sentences: array
}
```

#### Sentence Object
```javascript
{
  text: string,
  author: number (índice do jogador)
}
```

## Fluxo E2E do Jogo

### 1. Inicialização
- Usuário abre `index.html`
- Sistema carrega interface de configuração
- Validação: 2-8 jogadores

### 2. Fase de Escrita
- Loop: cada jogador escreve uma frase
- Armazenamento das frases com autoria
- Embaralhamento das frases

### 3. Fase de Adivinhação
- Exibição de frase aleatória
- Votação do grupo
- Verificação da resposta
- Atualização de pontuação

### 4. Verificação de Fim de Jogo
- Condição: ≤1 jogador com pontos
- Se não: próxima frase ou nova rodada
- Se sim: declaração de vitória

### 5. Reinício
- Opção de jogar novamente
- Reset completo do estado

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Flexbox, Grid, Gradients
- **JavaScript ES6+**: Classes, Arrow Functions, Array Methods
- **Vanilla JS**: Sem dependências externas

## Padrões de Design

- **State Pattern**: Gerenciamento de telas
- **Observer Pattern**: Atualização de interface
- **Factory Pattern**: Criação de elementos DOM
- **Single Responsibility**: Funções específicas

## Características Técnicas

- **Responsivo**: Funciona em desktop e mobile
- **Local**: Sem necessidade de servidor
- **Multiplayer Local**: Todos jogam no mesmo dispositivo
- **Zero Dependencies**: Apenas tecnologias web nativas