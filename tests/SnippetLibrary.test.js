/**
 * Tests unitaires pour SnippetLibrary
 */

import { SnippetLibrary } from '../src/modules/snippets/SnippetLibrary.js'

// Test 1: Get all snippets
function testGetAll() {
  const snippets = SnippetLibrary.getAll()
  console.assert(snippets.length > 0, 'Should have snippets')
  console.assert(Array.isArray(snippets), 'Should return array')
  console.log(`✓ Test getAll passed (${snippets.length} snippets)`)
}

// Test 2: Get by category
function testGetByCategory() {
  const notifications = SnippetLibrary.getByCategory('notifications')
  console.assert(notifications.length > 0, 'Should have notification snippets')
  notifications.forEach(s => {
    console.assert(s.category === 'notifications', 'All should be notifications')
  })
  console.log(`✓ Test getByCategory passed (${notifications.length} notifications)`)
}

// Test 3: Get by ID
function testGetById() {
  const snippet = SnippetLibrary.getById('notify-success')
  console.assert(snippet !== null, 'Should find snippet')
  console.assert(snippet.id === 'notify-success', 'Should have correct ID')
  console.assert(snippet.label === 'Notification Success', 'Should have correct label')
  console.log('✓ Test getById passed')
}

// Test 4: Get by ID (not found)
function testGetByIdNotFound() {
  const snippet = SnippetLibrary.getById('non-existent')
  console.assert(snippet === null, 'Should return null for non-existent')
  console.log('✓ Test getById not found passed')
}

// Test 5: Search
function testSearch() {
  const results = SnippetLibrary.search('notification')
  console.assert(results.length > 0, 'Should find notification snippets')
  console.log(`✓ Test search passed (${results.length} results)`)
}

// Test 6: Search empty
function testSearchEmpty() {
  const results = SnippetLibrary.search('')
  const all = SnippetLibrary.getAll()
  console.assert(results.length === all.length, 'Empty search should return all')
  console.log('✓ Test search empty passed')
}

// Test 7: Get categories
function testGetCategories() {
  const categories = SnippetLibrary.getCategories()
  console.assert(categories.length > 0, 'Should have categories')
  console.assert(Array.isArray(categories), 'Should return array')
  console.log(`✓ Test getCategories passed (${categories.length} categories)`)
}

// Test 8: Get category by ID
function testGetCategoryById() {
  const category = SnippetLibrary.getCategoryById('notifications')
  console.assert(category !== null, 'Should find category')
  console.assert(category.id === 'notifications', 'Should have correct ID')
  console.log('✓ Test getCategoryById passed')
}

// Test 9: Get stats
function testGetStats() {
  const stats = SnippetLibrary.getStats()
  console.assert(typeof stats === 'object', 'Should return object')
  console.assert(stats.notifications > 0, 'Should have notification count')
  console.log('✓ Test getStats passed', stats)
}

// Test 10: Get popular
function testGetPopular() {
  const popular = SnippetLibrary.getPopular(3)
  console.assert(popular.length <= 3, 'Should respect limit')
  console.assert(Array.isArray(popular), 'Should return array')
  console.log(`✓ Test getPopular passed (${popular.length} popular snippets)`)
}

// Exécuter tous les tests
console.log('🧪 Running SnippetLibrary tests...\n')
try {
  testGetAll()
  testGetByCategory()
  testGetById()
  testGetByIdNotFound()
  testSearch()
  testSearchEmpty()
  testGetCategories()
  testGetCategoryById()
  testGetStats()
  testGetPopular()
  console.log('\n✅ All SnippetLibrary tests passed!')
} catch (error) {
  console.error('❌ Test failed:', error)
  process.exit(1)
}
