# Bibliothèque de Snippets Budibase - Vue d'ensemble

## Résumé

Bibliothèque complète de **21 snippets JavaScript** pour Budibase, couvrant tous les cas d'usage courants : notifications, CRUD, manipulation DOM, utilitaires et exemples complets.

**Version:** 1.0.0
**Auteur:** MEMORA Solutions - Stéphane Lapointe
**Email:** stephane@memora.ca
**Licence:** MIT

---

## Contenu de la bibliothèque

### 📊 Statistiques

- **Total:** 21 snippets
- **Catégories:** 5
- **Avec placeholders:** 19 snippets
- **Sans placeholders:** 2 snippets
- **Exemples complets:** 3

### 📁 Fichiers disponibles

| Fichier | Description | Taille |
|---------|-------------|--------|
| `budibase-snippets-library.json` | Bibliothèque JSON complète | 16 KB |
| `SNIPPETS-GUIDE.md` | Guide détaillé avec exemples | 13 KB |
| `QUICK-REFERENCE.md` | Référence rapide one-page | 2.5 KB |
| `snippets-demo.html` | Démo visuelle interactive | 23 KB |
| `budibase-api.d.ts` | Définitions TypeScript | 8.1 KB |
| `snippets-index.csv` | Index CSV pour import | 2.5 KB |
| `INTEGRATION-GUIDE.md` | Guide d'intégration dev | 9 KB |
| `LIBRARY-README.md` | Ce fichier | - |

---

## Catégories de snippets

### 🔔 Notifications (4 snippets)

```javascript
// Success
budibase.notify.success("Message")

// Error
budibase.notify.error("Erreur")

// Warning
budibase.notify.warning("Attention")

// Info
budibase.notify.info("Information")
```

### 💾 CRUD Données (5 snippets)

- `search-table-basic` - Rechercher dans une table
- `save-row-basic` - Sauvegarder une ligne
- `fetch-row-by-id` - Récupérer par ID
- `delete-row` - Supprimer une ligne
- `update-row-partial` - Mise à jour partielle

### 🎨 Manipulation DOM (4 snippets)

- `create-element-dom` - Créer un élément HTML
- `add-click-listener` - Ajouter événement click
- `toggle-element-visibility` - Basculer visibilité
- `modify-element-style` - Modifier le style

### 🔧 Utilitaires (5 snippets)

- `console-log-data` - Logger des données
- `set-timeout` - Exécuter après délai
- `set-interval` - Exécuter périodiquement
- `conditional-execution` - Exécution conditionnelle
- `get-user-info` - Récupérer infos utilisateur

### ⭐ Exemples Complets (3 snippets)

- `example-form-submission` - Formulaire avec validation
- `example-data-table` - Tableau de données dynamique
- `example-dashboard-stats` - Dashboard avec statistiques

---

## Utilisation rapide

### 1. Configuration du plugin

```
1. Activer "Accès au contexte Budibase"
2. Choisir le mode d'exécution
3. Copier-coller un snippet
4. Remplacer les placeholders {{VARIABLE}}
```

### 2. Exemple minimal

```javascript
// Rechercher des utilisateurs actifs
budibase.API.searchTable({
  tableId: "ta_users",
  query: {
    equal: { status: "active" }
  }
}).then(result => {
  budibase.notify.success(`${result.data.length} utilisateurs`)
})
```

### 3. Exemple avec formulaire

```javascript
// Validation et sauvegarde
const data = {
  name: document.querySelector('#name').value,
  email: document.querySelector('#email').value
}

if (!data.name || !data.email) {
  budibase.notify.error("Champs manquants")
  return
}

budibase.API.saveRow({
  tableId: "ta_contacts",
  ...data
}).then(() => {
  budibase.notify.success("Enregistré !")
})
```

---

## Fichiers détaillés

### 📄 budibase-snippets-library.json

**Format:** JSON
**Utilisation:** Bibliothèque source complète

```json
{
  "version": "1.0.0",
  "description": "Bibliothèque complète de snippets",
  "categories": [...],
  "snippets": [
    {
      "id": "notify-success",
      "category": "notifications",
      "label": "Notification Success",
      "description": "Affiche un message de succès",
      "code": "budibase.notify.success(\"{{MESSAGE}}\")",
      "placeholders": ["MESSAGE"],
      "example": "budibase.notify.success(\"OK!\")"
    }
  ]
}
```

### 📄 SNIPPETS-GUIDE.md

**Format:** Markdown
**Utilisation:** Documentation complète avec exemples détaillés

- Vue d'ensemble de l'API Budibase
- Tous les snippets avec code complet
- Exemples d'utilisation réels
- Bonnes pratiques
- Référence API complète

### 📄 QUICK-REFERENCE.md

**Format:** Markdown
**Utilisation:** Référence rapide (cheat sheet)

- Syntaxe condensée
- Exemples courts
- Quick copy-paste
- Filtres de recherche
- Objets Budibase disponibles

### 📄 snippets-demo.html

**Format:** HTML/CSS/JS
**Utilisation:** Démo visuelle interactive

- Interface utilisateur complète
- Boutons "Copier" pour chaque snippet
- Statistiques visuelles
- Design professionnel
- Prêt à ouvrir dans un navigateur

### 📄 budibase-api.d.ts

**Format:** TypeScript
**Utilisation:** Autocomplétion dans les IDE

```typescript
declare namespace Budibase {
  interface API {
    searchTable(params: SearchTableParams): Promise<SearchTableResult>
    saveRow(params: SaveRowParams): Promise<any>
    fetchRow(params: FetchRowParams): Promise<any>
    deleteRow(params: DeleteRowParams): Promise<any>
  }
}
```

### 📄 snippets-index.csv

**Format:** CSV
**Utilisation:** Import dans tableurs, bases de données

```csv
ID,Category,Label,Description,Complexity,Tags
notify-success,notifications,Notification Success,Affiche un message de succès,Beginner,"notification,ui"
```

### 📄 INTEGRATION-GUIDE.md

**Format:** Markdown
**Utilisation:** Guide pour développeurs

- Chargement dans différents langages
- Intégration éditeurs de code
- Export vers autres formats
- API REST exemple
- Validation de snippets

---

## Démarrage rapide

### Pour les utilisateurs Budibase

1. Consultez **QUICK-REFERENCE.md**
2. Ouvrez **snippets-demo.html** dans votre navigateur
3. Cherchez le snippet dont vous avez besoin
4. Cliquez sur "Copier"
5. Collez dans le plugin Budibase
6. Remplacez les placeholders

### Pour les développeurs

1. Consultez **INTEGRATION-GUIDE.md**
2. Chargez **budibase-snippets-library.json**
3. Utilisez **budibase-api.d.ts** pour l'autocomplétion
4. Intégrez dans votre éditeur/outil

---

## APIs Budibase disponibles

### Objet global

```javascript
budibase = {
  component: {},   // Infos composant
  auth: {},        // Utilisateur connecté
  app: {},         // Info application
  route: {},       // Routing
  screen: {},      // Écran actuel
  API: {},         // APIs CRUD
  notify: {}       // Notifications
}
```

### APIs principales

```javascript
// Recherche
budibase.API.searchTable({ tableId, query, limit, sort })

// Création/Mise à jour
budibase.API.saveRow({ tableId, ...fields })

// Lecture
budibase.API.fetchRow({ tableId, rowId })

// Suppression
budibase.API.deleteRow({ tableId, rowId, revId })

// Notifications
budibase.notify.success(message)
budibase.notify.error(message)
budibase.notify.warning(message)
budibase.notify.info(message)
```

---

## Prérequis

### Pour utiliser les snippets

- Plugin "Injecteur de code personnalisé" installé
- Option "Accès au contexte Budibase" activée
- Budibase 2.x ou supérieur

### Pour l'intégration

- Node.js 14+ (pour JavaScript/TypeScript)
- Python 3.6+ (pour Python)
- PHP 7.4+ (pour PHP)
- Ou n'importe quel langage supportant JSON

---

## Exemples d'utilisation avancée

### Dashboard complet

```javascript
budibase.API.searchTable({
  tableId: "ta_orders",
  limit: 1000
}).then(result => {
  // Calculer stats
  const stats = {
    total: result.data.length,
    active: result.data.filter(i => i.status === 'active').length,
    revenue: result.data.reduce((sum, i) => sum + i.total, 0)
  }

  // Afficher
  document.querySelector('#stats').innerHTML = `
    <div class="stat">Total: ${stats.total}</div>
    <div class="stat">Actifs: ${stats.active}</div>
    <div class="stat">Revenus: ${stats.revenue}€</div>
  `

  budibase.notify.success("Dashboard chargé")
})
```

### Formulaire avec validation complète

```javascript
const form = document.querySelector('form')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  // Récupération
  const data = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value
  }

  // Validation
  if (!data.name || !data.email) {
    budibase.notify.error("Champs obligatoires manquants")
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    budibase.notify.error("Email invalide")
    return
  }

  // Sauvegarde
  try {
    await budibase.API.saveRow({
      tableId: "ta_contacts",
      ...data,
      created_at: new Date().toISOString()
    })

    budibase.notify.success("Contact enregistré !")
    form.reset()
  } catch (error) {
    budibase.notify.error("Erreur d'enregistrement")
    console.error(error)
  }
})
```

---

## Ressources supplémentaires

### Documentation officielle Budibase

- https://docs.budibase.com
- https://github.com/Budibase/budibase

### Support MEMORA Solutions

- **Email:** stephane@memora.ca
- **Web:** https://memora.solutions
- **Plugin:** https://github.com/memora-solutions/budibase-injecteur-code

### Contribution

Pour contribuer de nouveaux snippets :

1. Suivez le format JSON
2. Testez le code
3. Documentez les placeholders
4. Soumettez une pull request

---

## Changelog

### Version 1.0.0 - Octobre 2025

- ✅ 21 snippets couvrant tous les cas d'usage
- ✅ 5 formats de documentation
- ✅ Guide d'intégration complet
- ✅ Démo HTML interactive
- ✅ Définitions TypeScript
- ✅ Index CSV pour import

---

## Licence

**MIT License**

Copyright (c) 2025 MEMORA Solutions - Stéphane Lapointe

Utilisation libre pour vos projets personnels et commerciaux.

---

## Remerciements

Merci à la communauté Budibase pour leur excellent travail sur cette plateforme low-code.

---

**© 2025 MEMORA Solutions - Tous droits réservés**
