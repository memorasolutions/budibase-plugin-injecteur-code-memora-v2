/**
 * Test Playwright pour identifier le problème de writing-mode
 */

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Analyse du problème CSS writing-mode...\n');

  // Attendre que l'utilisateur ouvre Budibase et navigue vers le composant
  console.log('📌 Instructions:');
  console.log('1. Ouvrez Budibase dans le navigateur qui vient de s\'ouvrir');
  console.log('2. Naviguez vers votre application avec le composant "Injecteur de code personnalisé"');
  console.log('3. Appuyez sur ENTRÉE dans ce terminal une fois que le composant est visible\n');

  await new Promise(resolve => {
    process.stdin.once('data', resolve);
  });

  console.log('\n🔎 Inspection du DOM et des styles...\n');

  // Chercher le composant
  const component = await page.locator('.injecteur-code-container').first();

  if (await component.count() === 0) {
    console.log('❌ Composant .injecteur-code-container non trouvé');
    await browser.close();
    return;
  }

  console.log('✅ Composant trouvé\n');

  // Analyser la chaîne de parents
  const parentChain = await page.evaluate(() => {
    const container = document.querySelector('.injecteur-code-container');
    if (!container) return null;

    const chain = [];
    let element = container;

    while (element && element.tagName !== 'BODY') {
      const computedStyle = window.getComputedStyle(element);

      chain.push({
        tagName: element.tagName,
        className: element.className,
        id: element.id,
        writingMode: computedStyle.writingMode,
        direction: computedStyle.direction,
        textOrientation: computedStyle.textOrientation,
        display: computedStyle.display,
        inlineStyle: element.style.cssText
      });

      element = element.parentElement;
    }

    return chain;
  });

  console.log('📊 Hiérarchie DOM et styles appliqués:\n');

  parentChain.forEach((el, index) => {
    console.log(`${' '.repeat(index * 2)}[${index}] <${el.tagName}> ${el.className ? `class="${el.className}"` : ''}`);
    console.log(`${' '.repeat(index * 2)}    writing-mode: ${el.writingMode}`);
    console.log(`${' '.repeat(index * 2)}    direction: ${el.direction}`);
    if (el.writingMode.includes('vertical')) {
      console.log(`${' '.repeat(index * 2)}    ⚠️  PROBLÈME ICI ⚠️`);
    }
    if (el.inlineStyle) {
      console.log(`${' '.repeat(index * 2)}    inline: ${el.inlineStyle}`);
    }
    console.log('');
  });

  // Identifier l'élément problématique
  const problematicElement = parentChain.find(el => el.writingMode.includes('vertical'));

  if (problematicElement) {
    console.log('🎯 ÉLÉMENT PROBLÉMATIQUE IDENTIFIÉ:');
    console.log(`   Tag: <${problematicElement.tagName}>`);
    console.log(`   Class: ${problematicElement.className}`);
    console.log(`   writing-mode: ${problematicElement.writingMode}`);
    console.log('\n💡 SOLUTION: Nous devons forcer ce parent spécifiquement');
  }

  console.log('\nAppuyez sur ENTRÉE pour fermer...');
  await new Promise(resolve => {
    process.stdin.once('data', resolve);
  });

  await browser.close();
})();
