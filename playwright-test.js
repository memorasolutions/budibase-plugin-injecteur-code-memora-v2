const { chromium } = require('playwright');

(async () => {
  console.log('🎬 Lancement de Playwright...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('📡 Ouverture de http://localhost:8765/test-visual.html...');
  await page.goto('http://localhost:8765/test-visual.html');

  console.log('⏳ Attente de 3 secondes pour les tests automatiques...');
  await page.waitForTimeout(3000);

  console.log('📸 Capture d\'écran 1 - État initial...');
  await page.screenshot({ path: 'screenshot-initial.png', fullPage: true });

  console.log('🔍 Vérification du statut des tests...');
  const testResults = await page.evaluate(() => {
    const results = [];
    const containers = document.querySelectorAll('.test-container');

    containers.forEach((container, index) => {
      const testNum = index + 1;
      const titleElement = container.querySelector('.test-title');
      const statusElement = document.getElementById(`test${testNum}-status`);

      if (titleElement && statusElement) {
        const title = titleElement.textContent.split(/✓|✗/)[0].trim();
        const status = statusElement.textContent || 'PENDING';
        const className = statusElement.className;

        results.push({
          test: testNum,
          title: title,
          status: status,
          isPassed: className.includes('success'),
          isFailed: className.includes('error')
        });
      }
    });

    return results;
  });

  console.log('\n📊 RÉSULTATS DES TESTS:');
  testResults.forEach(result => {
    const icon = result.isPassed ? '✓' : (result.isFailed ? '✗' : '?');
    console.log(`  ${icon} Test ${result.test}: ${result.title} → ${result.status}`);
  });

  console.log('\n🖱️ Clic sur le bouton Exécuter du Test 5 (Hello World)...');
  const test5Button = await page.$('button:has-text("▶ Exécuter")');
  if (test5Button) {
    await test5Button.click();
    console.log('✓ Bouton cliqué');
  } else {
    console.log('✗ Bouton non trouvé');
  }

  console.log('⏳ Attente de 1 seconde...');
  await page.waitForTimeout(1000);

  console.log('📸 Capture d\'écran 2 - Après exécution...');
  await page.screenshot({ path: 'screenshot-after-execution.png', fullPage: true });

  console.log('📋 Récupération des messages de console...');
  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`${msg.type()}: ${msg.text()}`);
  });

  console.log('\n💬 CONSOLE LOGS:');
  console.log(consoleLogs);

  console.log('\n🔧 Récupération des erreurs éventuelles...');
  const errors = await page.evaluate(() => {
    const errorMessages = [];
    for (let i = 1; i <= 5; i++) {
      const statusElement = document.getElementById(`test${i}-status`);
      if (statusElement && statusElement.className.includes('error')) {
        const titleElement = document.querySelector(`.test-container:nth-child(${i + 1}) .test-title`);
        const title = titleElement ? titleElement.textContent.split(/status/)[0].trim() : `Test ${i}`;
        const message = statusElement.textContent;
        errorMessages.push({ title, message });
      }
    }
    return errorMessages;
  });

  if (errors.length > 0) {
    console.log('\n❌ ERREURS DÉTECTÉES:');
    errors.forEach(err => {
      console.log(`  - ${err.title}: ${err.message}`);
    });
  } else {
    console.log('\n✅ Aucune erreur détectée');
  }

  console.log('\n🏁 Tests visuels terminés.');
  await browser.close();
})();
