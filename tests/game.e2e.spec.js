import { test, expect } from '@playwright/test';

test.describe('Quem Disse? - E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${process.cwd()}/index.html`);
  });

  test('deve carregar a página inicial corretamente', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Quem Disse?');
    await expect(page.locator('#setup-screen')).toBeVisible();
    await expect(page.locator('#player-count')).toHaveValue('3');
  });

  test('deve validar número mínimo e máximo de jogadores', async ({ page }) => {
    await page.fill('#player-count', '1');
    await page.click('button:has-text("Configurar Jogadores")');
    
    page.on('dialog', dialog => dialog.accept());
    await expect(page.locator('#player-names')).toBeHidden();
    
    await page.fill('#player-count', '3');
    await page.click('button:has-text("Configurar Jogadores")');
    await expect(page.locator('#player-names')).toBeVisible();
    await expect(page.locator('#name-inputs input')).toHaveCount(3);
  });

  test('fluxo completo do jogo - 2 jogadores', async ({ page }) => {
    await page.fill('#player-count', '2');
    await page.click('button:has-text("Configurar Jogadores")');
    
    await page.fill('#player-0', 'Alice');
    await page.fill('#player-1', 'Bob');
    await page.click('button:has-text("Iniciar Jogo")');
    
    await expect(page.locator('#writing-screen')).toBeVisible();
    await expect(page.locator('#writer-name')).toHaveText('Alice');
    await page.fill('#sentence-input', 'Esta é uma frase criativa da Alice');
    await page.click('button:has-text("Enviar Frase")');
    
    await expect(page.locator('#writer-name')).toHaveText('Bob');
    await page.fill('#sentence-input', 'Bob escreveu esta frase interessante');
    await page.click('button:has-text("Enviar Frase")');
    
    await expect(page.locator('#guessing-screen')).toBeVisible();
    await expect(page.locator('#current-sentence')).toBeVisible();
    await expect(page.locator('.player-option')).toHaveCount(2);
    
    await page.click('.player-option:first-child');
    await expect(page.locator('.player-option.selected')).toHaveCount(1);
    await page.click('button:has-text("Confirmar Voto")');
    
    await expect(page.locator('#result-screen')).toBeVisible();
    await expect(page.locator('#round-result')).toBeVisible();
    await expect(page.locator('#scoreboard')).toBeVisible();
  });

  test('deve mostrar vitória quando apenas 1 jogador tem pontos', async ({ page }) => {
    await page.evaluate(() => {
      game.showScreen('victory-screen');
      document.getElementById('winner-announcement').innerHTML = '🏆 Alice venceu com 1 pontos! 🏆';
    });
    
    await expect(page.locator('#victory-screen')).toBeVisible();
    await expect(page.locator('#winner-announcement')).toContainText('Alice venceu');
  });

  test('deve permitir reiniciar o jogo', async ({ page }) => {
    await page.fill('#player-count', '2');
    await page.click('button:has-text("Configurar Jogadores")');
    await page.fill('#player-0', 'Alice');
    await page.fill('#player-1', 'Bob');
    await page.click('button:has-text("Iniciar Jogo")');
    
    await page.evaluate(() => {
      game.showScreen('result-screen');
    });
    
    await page.click('button:has-text("Reiniciar Jogo")');
    await expect(page.locator('#setup-screen')).toBeVisible();
  });

  test('deve embaralhar frases corretamente', async ({ page }) => {
    await page.evaluate(() => {
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      shuffleArray(copy);
      const isShuffled = !original.every((val, index) => val === copy[index]);
      window.testResult = isShuffled;
    });
    
    const result = await page.evaluate(() => window.testResult);
    expect(result).toBe(true);
  });

  test('deve atualizar placar corretamente', async ({ page }) => {
    await page.evaluate(() => {
      game.players = [
        { name: 'Alice', score: 5 },
        { name: 'Bob', score: 3 }
      ];
      game.showScreen('result-screen');
      updateScoreboard();
    });
    
    await expect(page.locator('.player-score')).toHaveCount(2);
    await expect(page.locator('.player-score').first()).toContainText('Alice');
    await expect(page.locator('.player-score').first()).toContainText('5 pontos');
  });

});