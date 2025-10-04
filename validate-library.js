#!/usr/bin/env node

/**
 * Script de validation de la bibliothèque de snippets Budibase
 *
 * Vérifie :
 * - Structure JSON valide
 * - Champs obligatoires présents
 * - Format des IDs
 * - Catégories valides
 * - Placeholders dans le code
 * - Unicité des IDs
 * - Statistiques
 *
 * @author MEMORA Solutions - Stéphane Lapointe
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LIBRARY_FILE = 'budibase-snippets-library.json';
const VALID_CATEGORIES = ['notifications', 'crud-data', 'dom-manipulation', 'utilities', 'complete-examples'];

// Couleurs console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  console.log('');
  log('='.repeat(60), 'cyan');
  log(title.toUpperCase(), 'cyan');
  log('='.repeat(60), 'cyan');
  console.log('');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'blue');
}

// Charger la bibliothèque
function loadLibrary() {
  try {
    const libraryPath = path.join(__dirname, LIBRARY_FILE);
    const content = fs.readFileSync(libraryPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    logError(`Erreur de chargement: ${error.message}`);
    process.exit(1);
  }
}

// Valider un snippet
function validateSnippet(snippet, index) {
  const errors = [];
  const warnings = [];

  // Champs obligatoires
  const requiredFields = ['id', 'category', 'label', 'description', 'code', 'placeholders'];
  requiredFields.forEach(field => {
    if (!snippet[field] && snippet[field] !== '') {
      errors.push(`Champ manquant: ${field}`);
    }
  });

  // Validation de l'ID
  if (snippet.id) {
    if (!/^[a-z0-9-]+$/.test(snippet.id)) {
      errors.push(`ID invalide "${snippet.id}" (seulement a-z, 0-9, -)`);
    }
    if (snippet.id.length < 3) {
      warnings.push(`ID très court: "${snippet.id}"`);
    }
    if (snippet.id.length > 50) {
      warnings.push(`ID très long: "${snippet.id}"`);
    }
  }

  // Validation de la catégorie
  if (snippet.category && !VALID_CATEGORIES.includes(snippet.category)) {
    errors.push(`Catégorie invalide: "${snippet.category}"`);
  }

  // Validation du label
  if (snippet.label && snippet.label.length < 3) {
    warnings.push(`Label très court: "${snippet.label}"`);
  }

  // Validation de la description
  if (snippet.description && snippet.description.length < 10) {
    warnings.push(`Description trop courte: "${snippet.description}"`);
  }

  // Validation du code
  if (snippet.code) {
    if (snippet.code.length < 10) {
      warnings.push('Code très court');
    }

    // Vérifier les placeholders dans le code
    if (snippet.placeholders && Array.isArray(snippet.placeholders)) {
      snippet.placeholders.forEach(placeholder => {
        const pattern = `{{${placeholder}}}`;
        if (!snippet.code.includes(pattern)) {
          errors.push(`Placeholder "${placeholder}" non trouvé dans le code`);
        }
      });

      // Vérifier les placeholders non déclarés
      const codeMatches = snippet.code.match(/{{(\w+)}}/g);
      if (codeMatches) {
        codeMatches.forEach(match => {
          const placeholder = match.replace(/[{}]/g, '');
          if (!snippet.placeholders.includes(placeholder)) {
            warnings.push(`Placeholder "${placeholder}" utilisé mais non déclaré`);
          }
        });
      }
    }
  }

  // Validation de l'exemple
  if (!snippet.example || snippet.example.length < 10) {
    warnings.push('Exemple manquant ou trop court');
  }

  return { errors, warnings };
}

// Valider toute la bibliothèque
function validateLibrary(library) {
  logHeader('Validation de la bibliothèque');

  const results = {
    totalSnippets: 0,
    validSnippets: 0,
    snippetsWithErrors: 0,
    snippetsWithWarnings: 0,
    totalErrors: 0,
    totalWarnings: 0,
    details: []
  };

  // Validation de la structure principale
  logInfo('Validation de la structure principale...');

  if (!library.version) {
    logError('Version manquante');
    results.totalErrors++;
  } else {
    logSuccess(`Version: ${library.version}`);
  }

  if (!library.snippets || !Array.isArray(library.snippets)) {
    logError('Tableau de snippets manquant ou invalide');
    process.exit(1);
  }

  results.totalSnippets = library.snippets.length;
  logSuccess(`${results.totalSnippets} snippets trouvés`);

  // Vérifier l'unicité des IDs
  logInfo('Vérification de l\'unicité des IDs...');
  const ids = new Set();
  const duplicates = [];

  library.snippets.forEach(snippet => {
    if (snippet.id) {
      if (ids.has(snippet.id)) {
        duplicates.push(snippet.id);
      }
      ids.add(snippet.id);
    }
  });

  if (duplicates.length > 0) {
    logError(`IDs dupliqués: ${duplicates.join(', ')}`);
    results.totalErrors += duplicates.length;
  } else {
    logSuccess('Tous les IDs sont uniques');
  }

  // Valider chaque snippet
  console.log('');
  logInfo('Validation des snippets individuels...');
  console.log('');

  library.snippets.forEach((snippet, index) => {
    const validation = validateSnippet(snippet, index);
    const snippetId = snippet.id || `#${index}`;

    results.details.push({
      id: snippetId,
      errors: validation.errors,
      warnings: validation.warnings
    });

    if (validation.errors.length > 0) {
      results.snippetsWithErrors++;
      results.totalErrors += validation.errors.length;
      logError(`Snippet "${snippetId}":`);
      validation.errors.forEach(err => {
        console.log(`  - ${err}`);
      });
    }

    if (validation.warnings.length > 0) {
      results.snippetsWithWarnings++;
      results.totalWarnings += validation.warnings.length;
      if (validation.errors.length === 0) {
        logWarning(`Snippet "${snippetId}":`);
      }
      validation.warnings.forEach(warn => {
        console.log(`  - ${warn}`);
      });
    }

    if (validation.errors.length === 0 && validation.warnings.length === 0) {
      results.validSnippets++;
    }
  });

  return results;
}

// Générer des statistiques
function generateStats(library) {
  logHeader('Statistiques de la bibliothèque');

  const stats = {
    byCategory: {},
    withPlaceholders: 0,
    withoutPlaceholders: 0,
    avgCodeLength: 0,
    avgDescriptionLength: 0,
    totalCodeLength: 0
  };

  // Par catégorie
  library.snippets.forEach(snippet => {
    if (snippet.category) {
      stats.byCategory[snippet.category] = (stats.byCategory[snippet.category] || 0) + 1;
    }

    if (snippet.placeholders && snippet.placeholders.length > 0) {
      stats.withPlaceholders++;
    } else {
      stats.withoutPlaceholders++;
    }

    if (snippet.code) {
      stats.totalCodeLength += snippet.code.length;
    }
  });

  stats.avgCodeLength = Math.round(stats.totalCodeLength / library.snippets.length);

  // Afficher
  log(`Total snippets: ${library.snippets.length}`, 'cyan');
  console.log('');

  log('Par catégorie:', 'yellow');
  Object.entries(stats.byCategory).forEach(([category, count]) => {
    console.log(`  - ${category}: ${count} snippets`);
  });
  console.log('');

  log(`Avec placeholders: ${stats.withPlaceholders}`, 'green');
  log(`Sans placeholders: ${stats.withoutPlaceholders}`, 'green');
  console.log('');

  log(`Longueur moyenne du code: ${stats.avgCodeLength} caractères`, 'blue');
  console.log('');

  return stats;
}

// Afficher le résumé
function displaySummary(results) {
  logHeader('Résumé de la validation');

  log(`Total snippets: ${results.totalSnippets}`, 'cyan');
  log(`Snippets valides: ${results.validSnippets}`, 'green');
  log(`Snippets avec erreurs: ${results.snippetsWithErrors}`, 'red');
  log(`Snippets avec avertissements: ${results.snippetsWithWarnings}`, 'yellow');
  console.log('');
  log(`Total erreurs: ${results.totalErrors}`, 'red');
  log(`Total avertissements: ${results.totalWarnings}`, 'yellow');
  console.log('');

  if (results.totalErrors === 0) {
    logSuccess('✓ VALIDATION RÉUSSIE - Aucune erreur détectée');
    return 0;
  } else {
    logError('✗ VALIDATION ÉCHOUÉE - Erreurs détectées');
    return 1;
  }
}

// Exporter le rapport
function exportReport(results, stats, library) {
  const report = {
    timestamp: new Date().toISOString(),
    library_version: library.version,
    validation: results,
    statistics: stats
  };

  const reportPath = path.join(__dirname, 'validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  logSuccess(`Rapport exporté: ${reportPath}`);
}

// Main
function main() {
  console.clear();

  logHeader('Validation de la bibliothèque de snippets Budibase');
  log('MEMORA Solutions - Stéphane Lapointe', 'magenta');
  log('stephane@memora.ca', 'magenta');

  try {
    // Charger
    const library = loadLibrary();
    logSuccess('Bibliothèque chargée avec succès');

    // Valider
    const results = validateLibrary(library);

    // Statistiques
    const stats = generateStats(library);

    // Résumé
    const exitCode = displaySummary(results);

    // Export
    exportReport(results, stats, library);

    // Quitter
    process.exit(exitCode);

  } catch (error) {
    logError(`Erreur fatale: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Exécuter
if (require.main === module) {
  main();
}

module.exports = {
  validateSnippet,
  validateLibrary,
  generateStats
};
