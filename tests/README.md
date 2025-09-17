# Testes E2E - Quem Disse?

## Configuração

```bash
npm install
sudo npx playwright install-deps
npm run install:playwright
```

## Executar Testes

```bash
# Executar todos os testes
npm run test:e2e

# Executar com interface visual
npm run test:headed

# Executar com UI do Playwright
npm run test:ui
```

## Cenários Testados

### 1. Carregamento Inicial
- Verifica se a página carrega corretamente
- Valida elementos da tela de configuração

### 2. Validação de Jogadores
- Testa limite mínimo (2) e máximo (8) de jogadores
- Verifica mensagens de erro

### 3. Fluxo Completo do Jogo
- Configuração de 2 jogadores
- Fase de escrita de frases
- Fase de adivinhação
- Exibição de resultados

### 4. Condição de Vitória
- Simula cenário onde apenas 1 jogador tem pontos
- Verifica exibição da tela de vitória

### 5. Reinicialização
- Testa botão de reiniciar jogo
- Verifica reset do estado

### 6. Funções Auxiliares
- Teste da função de embaralhamento
- Atualização do placar
- Destaque de jogadores que perderam pontos

## Estrutura dos Testes

```
tests/
├── game.e2e.spec.js    # Testes principais do jogo
└── README.md           # Documentação dos testes
```

## Cobertura

Os testes cobrem:
- ✅ Interface do usuário
- ✅ Fluxo de navegação entre telas
- ✅ Validações de entrada
- ✅ Lógica de pontuação
- ✅ Condições de vitória
- ✅ Reinicialização do jogo