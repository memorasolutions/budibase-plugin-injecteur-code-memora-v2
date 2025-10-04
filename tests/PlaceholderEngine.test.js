/**
 * Tests unitaires pour PlaceholderEngine
 */

import { PlaceholderEngine } from '../src/modules/placeholders/PlaceholderEngine.js'

// Test 1: Remplacement simple
function testSimpleReplace() {
  const code = 'const x = "{{VALUE}}"'
  const result = PlaceholderEngine.replace(code, { VALUE: '42' })
  console.assert(result === 'const x = "42"', 'Simple replace failed')
  console.log('✓ Test simple replace passed')
}

// Test 2: Extraction de placeholders
function testExtract() {
  const code = '{{NAME}} and {{AGE}} and {{NAME}}'
  const placeholders = PlaceholderEngine.extract(code)
  console.assert(placeholders.length === 2, 'Extract count failed')
  console.assert(placeholders.includes('NAME'), 'NAME not found')
  console.assert(placeholders.includes('AGE'), 'AGE not found')
  console.log('✓ Test extract passed')
}

// Test 3: Validation
function testValidation() {
  const required = ['NAME', 'AGE']
  const provided = { NAME: 'John', AGE: '30' }
  const result = PlaceholderEngine.validate(required, provided)
  console.assert(result.valid === true, 'Validation should pass')
  console.assert(result.missing.length === 0, 'Should have no missing')
  console.log('✓ Test validation passed')
}

// Test 4: Validation avec valeurs manquantes
function testValidationMissing() {
  const required = ['NAME', 'AGE', 'EMAIL']
  const provided = { NAME: 'John' }
  const result = PlaceholderEngine.validate(required, provided)
  console.assert(result.valid === false, 'Validation should fail')
  console.assert(result.missing.length === 2, 'Should have 2 missing')
  console.assert(result.missing.includes('AGE'), 'AGE should be missing')
  console.assert(result.missing.includes('EMAIL'), 'EMAIL should be missing')
  console.log('✓ Test validation missing passed')
}

// Test 5: Count placeholders
function testCount() {
  const code = '{{A}} {{B}} {{A}}'
  const count = PlaceholderEngine.count(code)
  console.assert(count === 3, 'Count should be 3 (with duplicates)')
  console.log('✓ Test count passed')
}

// Test 6: Has placeholders
function testHasPlaceholders() {
  const code1 = '{{VALUE}}'
  const code2 = 'no placeholders'
  console.assert(PlaceholderEngine.hasPlaceholders(code1) === true, 'Should have placeholders')
  console.assert(PlaceholderEngine.hasPlaceholders(code2) === false, 'Should not have placeholders')
  console.log('✓ Test hasPlaceholders passed')
}

// Test 7: Create empty values
function testCreateEmptyValues() {
  const code = '{{NAME}} {{AGE}}'
  const values = PlaceholderEngine.createEmptyValues(code)
  console.assert(values.NAME === '', 'NAME should be empty string')
  console.assert(values.AGE === '', 'AGE should be empty string')
  console.log('✓ Test createEmptyValues passed')
}

// Test 8: Replace with defaults
function testReplaceWithDefaults() {
  const code = '{{NAME}} is {{AGE}} years old'
  const values = { NAME: 'John' }
  const defaults = { AGE: '25', NAME: 'Default' }
  const result = PlaceholderEngine.replaceWithDefaults(code, values, defaults)
  console.assert(result === 'John is 25 years old', 'Should use value over default for NAME')
  console.log('✓ Test replaceWithDefaults passed')
}

// Exécuter tous les tests
console.log('🧪 Running PlaceholderEngine tests...\n')
try {
  testSimpleReplace()
  testExtract()
  testValidation()
  testValidationMissing()
  testCount()
  testHasPlaceholders()
  testCreateEmptyValues()
  testReplaceWithDefaults()
  console.log('\n✅ All PlaceholderEngine tests passed!')
} catch (error) {
  console.error('❌ Test failed:', error)
  process.exit(1)
}
