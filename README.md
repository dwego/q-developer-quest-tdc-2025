# Quem Disse? - Jogo Multiplayer Local

Um jogo divertido e interativo onde os jogadores adivinham quem escreveu cada frase.

## Como Jogar

1. **Configuração**: Defina de 2 a 8 jogadores e seus nomes
2. **Fase de Escrita**: Cada jogador escreve uma frase criativa
3. **Fase de Adivinhação**: O grupo vota em quem escreveu cada frase
4. **Pontuação**: Se acertarem, o autor perde 1 ponto
5. **Vitória**: O último jogador com pontos vence!

## Como Executar

Abra o arquivo `index.html` em qualquer navegador web moderno.

## Estrutura do Projeto

- `index.html` - Interface principal do jogo
- `style.css` - Estilos e design
- `script.js` - Lógica do jogo
- `.amazonq/rules/game_rules.md` - Regras detalhadas

## Tecnologias

- HTML5
- CSS3
- JavaScript

## Prompts:

```md
Crie um projeto do jogo Quem Disse? - Jogo Multiplayer Local

Um jogo divertido e interativo onde os jogadores adivinham quem escreveu cada frase.
```

# game_rules.md: 

```md
# Regras do Jogo

## Configuração
- **Jogadores**: Mínimo 2, máximo 8 jogadores
- **Pontuação inicial**: Todos começam com 5 pontos
- **Objetivo**: Seja o último jogador com pontos!

## Fluxo do Jogo

### Fase 1 - Escrita de Frases
- Cada jogador escreve uma frase criativa e original
- **Dica**: Misture seu estilo com algo diferente para confundir!

### Fase 2 - Adivinhação
- Uma frase é sorteada e exibida (sem revelar o autor)
- O grupo discute e vota em conjunto em quem acham que escreveu
- **Se o GRUPO acertar**: O autor perde 1 ponto
- **Se o grupo errar**: Ninguém perde ponto

### Placar
- Veja a pontuação atualizada
- Destaque para quem perdeu pontos na rodada
- Continue com nova rodada ou reinicie o jogo

## Vitória
O último jogador com pontos restantes vence!
```

![Initial page](./public/init.png)
![Quiz page](./public/image.png)