# Guide d'intégration de la bibliothèque de snippets

## Vue d'ensemble

Ce guide explique comment intégrer la bibliothèque de snippets Budibase dans vos propres applications, éditeurs de code, ou outils de développement.

## Structure du fichier JSON

### Format général

```json
{
  "version": "1.0.0",
  "description": "Bibliothèque complète de snippets JavaScript pour Budibase",
  "author": "MEMORA Solutions - Stéphane Lapointe",
  "categories": ["notifications", "crud-data", "dom-manipulation", "utilities", "complete-examples"],
  "snippets": [...]
}
```

### Structure d'un snippet

```json
{
  "id": "unique-snippet-id",
  "category": "category-name",
  "label": "Human Readable Label",
  "description": "Description détaillée du snippet",
  "code": "const example = \"{{PLACEHOLDER}}\"\nconsole.log(example)",
  "placeholders": ["PLACEHOLDER"],
  "example": "Exemple d'utilisation concret"
}
```

## Chargement de la bibliothèque

### JavaScript (Browser)

```javascript
fetch('budibase-snippets-library.json')
  .then(response => response.json())
  .then(library => {
    console.log(`Chargé: ${library.snippets.length} snippets`)
    console.log(`Version: ${library.version}`)

    // Utiliser la bibliothèque
    library.snippets.forEach(snippet => {
      console.log(`${snippet.id}: ${snippet.label}`)
    })
  })
```

### Node.js

```javascript
const fs = require('fs')
const library = JSON.parse(fs.readFileSync('budibase-snippets-library.json', 'utf8'))

console.log(`Chargé: ${library.snippets.length} snippets`)

// Filtrer par catégorie
const notifications = library.snippets.filter(s => s.category === 'notifications')
console.log(`Notifications: ${notifications.length}`)
```

### Python

```python
import json

with open('budibase-snippets-library.json', 'r', encoding='utf-8') as f:
    library = json.load(f)

print(f"Chargé: {len(library['snippets'])} snippets")

# Filtrer par catégorie
notifications = [s for s in library['snippets'] if s['category'] == 'notifications']
print(f"Notifications: {len(notifications)}")
```

### PHP

```php
<?php
$json = file_get_contents('budibase-snippets-library.json');
$library = json_decode($json, true);

echo "Chargé: " . count($library['snippets']) . " snippets\n";

// Filtrer par catégorie
$notifications = array_filter($library['snippets'], function($s) {
    return $s['category'] === 'notifications';
});
echo "Notifications: " . count($notifications) . "\n";
```

## Utilisation des snippets

### 1. Remplacement des placeholders

```javascript
function fillPlaceholders(snippet, values) {
  let code = snippet.code

  snippet.placeholders.forEach((placeholder, index) => {
    const value = values[placeholder] || values[index] || `{{${placeholder}}}`
    code = code.replaceAll(`{{${placeholder}}}`, value)
  })

  return code
}

// Utilisation
const snippet = library.snippets.find(s => s.id === 'search-table-basic')
const filledCode = fillPlaceholders(snippet, {
  TABLE_ID: 'ta_users',
  FIELD_NAME: 'status',
  VALUE: 'active',
  SORT_FIELD: 'created_at'
})

console.log(filledCode)
```

### 2. Recherche de snippets

```javascript
// Par ID
function getSnippetById(library, id) {
  return library.snippets.find(s => s.id === id)
}

// Par catégorie
function getSnippetsByCategory(library, category) {
  return library.snippets.filter(s => s.category === category)
}

// Par mot-clé dans la description
function searchSnippets(library, keyword) {
  const lowerKeyword = keyword.toLowerCase()
  return library.snippets.filter(s =>
    s.label.toLowerCase().includes(lowerKeyword) ||
    s.description.toLowerCase().includes(lowerKeyword)
  )
}

// Utilisation
const formSnippets = searchSnippets(library, 'form')
console.log(`Trouvé ${formSnippets.length} snippets avec "form"`)
```

### 3. Génération d'interface utilisateur

```javascript
// Générer une liste HTML de snippets
function generateSnippetList(library) {
  const categories = [...new Set(library.snippets.map(s => s.category))]

  let html = '<div class="snippet-library">'

  categories.forEach(category => {
    const snippets = library.snippets.filter(s => s.category === category)

    html += `
      <div class="category">
        <h2>${category}</h2>
        <div class="snippets">
    `

    snippets.forEach(snippet => {
      html += `
        <div class="snippet" data-id="${snippet.id}">
          <h3>${snippet.label}</h3>
          <p>${snippet.description}</p>
          <button onclick="insertSnippet('${snippet.id}')">Insérer</button>
        </div>
      `
    })

    html += `
        </div>
      </div>
    `
  })

  html += '</div>'
  return html
}
```

## Intégration dans des éditeurs

### VS Code Extension

```typescript
import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

export function activate(context: vscode.ExtensionContext) {
  // Charger la bibliothèque
  const libraryPath = path.join(context.extensionPath, 'budibase-snippets-library.json')
  const library = JSON.parse(fs.readFileSync(libraryPath, 'utf8'))

  // Enregistrer les snippets
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    'javascript',
    {
      provideCompletionItems(document, position) {
        const completions: vscode.CompletionItem[] = []

        library.snippets.forEach(snippet => {
          const completion = new vscode.CompletionItem(
            snippet.label,
            vscode.CompletionItemKind.Snippet
          )

          completion.insertText = new vscode.SnippetString(
            snippet.code.replace(/{{(\w+)}}/g, '${1:$1}')
          )
          completion.documentation = new vscode.MarkdownString(snippet.description)

          completions.push(completion)
        })

        return completions
      }
    }
  )

  context.subscriptions.push(completionProvider)
}
```

### Monaco Editor (web)

```javascript
import * as monaco from 'monaco-editor'

// Charger la bibliothèque
fetch('budibase-snippets-library.json')
  .then(r => r.json())
  .then(library => {
    // Enregistrer les snippets
    const snippetSuggestions = library.snippets.map(snippet => {
      return {
        label: snippet.label,
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText: snippet.code,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: snippet.description
      }
    })

    // Fournir les completions
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: () => {
        return {
          suggestions: snippetSuggestions
        }
      }
    })
  })
```

### CodeMirror

```javascript
import CodeMirror from 'codemirror'
import 'codemirror/addon/hint/show-hint'

// Charger la bibliothèque
fetch('budibase-snippets-library.json')
  .then(r => r.json())
  .then(library => {
    // Créer le hint helper
    CodeMirror.registerHelper('hint', 'budibase', (cm) => {
      const cursor = cm.getCursor()
      const token = cm.getTokenAt(cursor)

      const list = library.snippets.map(snippet => ({
        text: snippet.code,
        displayText: snippet.label,
        hint: (cm, data, completion) => {
          cm.replaceRange(completion.text, data.from, data.to)
        }
      }))

      return {
        list: list,
        from: CodeMirror.Pos(cursor.line, token.start),
        to: CodeMirror.Pos(cursor.line, token.end)
      }
    })
  })
```

## Génération de documentation

### Générer un Markdown

```javascript
function generateMarkdownDoc(library) {
  let md = `# Bibliothèque de Snippets Budibase\n\n`
  md += `Version: ${library.version}\n\n`
  md += `## Catégories\n\n`

  const categories = [...new Set(library.snippets.map(s => s.category))]

  categories.forEach(category => {
    const snippets = library.snippets.filter(s => s.category === category)
    md += `### ${category} (${snippets.length} snippets)\n\n`

    snippets.forEach(snippet => {
      md += `#### ${snippet.label}\n\n`
      md += `${snippet.description}\n\n`
      md += '```javascript\n'
      md += snippet.code
      md += '\n```\n\n'

      if (snippet.example) {
        md += `**Exemple:** ${snippet.example}\n\n`
      }
    })
  })

  return md
}

// Utilisation
const markdown = generateMarkdownDoc(library)
fs.writeFileSync('SNIPPETS.md', markdown)
```

### Générer un HTML

```javascript
function generateHTMLDoc(library) {
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Snippets Budibase - ${library.version}</title>
  <style>
    body { font-family: sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .snippet { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .snippet h3 { margin-top: 0; color: #4CAF50; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 3px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>Bibliothèque de Snippets Budibase</h1>
  <p>Version: ${library.version}</p>
`

  const categories = [...new Set(library.snippets.map(s => s.category))]

  categories.forEach(category => {
    const snippets = library.snippets.filter(s => s.category === category)
    html += `<h2>${category}</h2>`

    snippets.forEach(snippet => {
      html += `
        <div class="snippet">
          <h3>${snippet.label}</h3>
          <p>${snippet.description}</p>
          <pre><code>${escapeHtml(snippet.code)}</code></pre>
        </div>
      `
    })
  })

  html += '</body></html>'
  return html
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}
```

## Export vers d'autres formats

### VS Code Snippets JSON

```javascript
function exportToVSCodeSnippets(library) {
  const vscodeSnippets = {}

  library.snippets.forEach(snippet => {
    vscodeSnippets[snippet.id] = {
      prefix: snippet.id,
      body: snippet.code.split('\n'),
      description: snippet.description
    }
  })

  return JSON.stringify(vscodeSnippets, null, 2)
}

// Utilisation
const vscodeFormat = exportToVSCodeSnippets(library)
fs.writeFileSync('budibase-snippets.code-snippets', vscodeFormat)
```

### Sublime Text Snippets

```javascript
function exportToSublimeSnippets(library) {
  library.snippets.forEach(snippet => {
    const sublimeSnippet = `
<snippet>
  <content><![CDATA[
${snippet.code}
]]></content>
  <tabTrigger>${snippet.id}</tabTrigger>
  <scope>source.js</scope>
  <description>${snippet.description}</description>
</snippet>
`
    fs.writeFileSync(`snippets/${snippet.id}.sublime-snippet`, sublimeSnippet)
  })
}
```

## API REST exemple

```javascript
const express = require('express')
const app = express()
const library = require('./budibase-snippets-library.json')

// Liste tous les snippets
app.get('/api/snippets', (req, res) => {
  res.json(library.snippets)
})

// Récupère un snippet par ID
app.get('/api/snippets/:id', (req, res) => {
  const snippet = library.snippets.find(s => s.id === req.params.id)
  if (snippet) {
    res.json(snippet)
  } else {
    res.status(404).json({ error: 'Snippet not found' })
  }
})

// Recherche de snippets
app.get('/api/snippets/search/:keyword', (req, res) => {
  const keyword = req.params.keyword.toLowerCase()
  const results = library.snippets.filter(s =>
    s.label.toLowerCase().includes(keyword) ||
    s.description.toLowerCase().includes(keyword)
  )
  res.json(results)
})

// Snippets par catégorie
app.get('/api/snippets/category/:category', (req, res) => {
  const snippets = library.snippets.filter(s => s.category === req.params.category)
  res.json(snippets)
})

app.listen(3000, () => {
  console.log('API Snippets disponible sur http://localhost:3000')
})
```

## Validation de snippets

```javascript
function validateSnippet(snippet) {
  const errors = []

  // Champs obligatoires
  const required = ['id', 'category', 'label', 'description', 'code', 'placeholders']
  required.forEach(field => {
    if (!snippet[field]) {
      errors.push(`Champ manquant: ${field}`)
    }
  })

  // Validation de l'ID
  if (snippet.id && !/^[a-z0-9-]+$/.test(snippet.id)) {
    errors.push('ID invalide (seulement a-z, 0-9, -)')
  }

  // Validation de la catégorie
  const validCategories = ['notifications', 'crud-data', 'dom-manipulation', 'utilities', 'complete-examples']
  if (snippet.category && !validCategories.includes(snippet.category)) {
    errors.push(`Catégorie invalide: ${snippet.category}`)
  }

  // Vérification des placeholders dans le code
  if (snippet.placeholders && snippet.code) {
    snippet.placeholders.forEach(placeholder => {
      if (!snippet.code.includes(`{{${placeholder}}}`)) {
        errors.push(`Placeholder ${placeholder} non trouvé dans le code`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors: errors
  }
}

// Valider toute la bibliothèque
function validateLibrary(library) {
  const results = []

  library.snippets.forEach((snippet, index) => {
    const validation = validateSnippet(snippet)
    if (!validation.valid) {
      results.push({
        index: index,
        id: snippet.id,
        errors: validation.errors
      })
    }
  })

  return {
    valid: results.length === 0,
    invalidSnippets: results
  }
}
```

## Contribution

Si vous créez de nouveaux snippets, assurez-vous de :

1. Suivre la structure JSON définie
2. Utiliser des IDs uniques en kebab-case
3. Fournir une description claire
4. Inclure un exemple d'utilisation
5. Tester le code avant soumission
6. Documenter les placeholders

## Support

Pour toute question sur l'intégration :

- **Email:** stephane@memora.ca
- **Web:** https://memora.solutions

---

**© 2025 MEMORA Solutions - Licence MIT**
