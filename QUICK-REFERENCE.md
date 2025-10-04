# Référence rapide - Snippets Budibase

## Table des matières
1. [Notifications](#notifications)
2. [CRUD Data](#crud-data)
3. [DOM Manipulation](#dom-manipulation)
4. [Utilitaires](#utilitaires)
5. [Exemples complets](#exemples-complets)

---

## Notifications

### Success
```javascript
budibase.notify.success("Message de succès")
```

### Error
```javascript
budibase.notify.error("Message d'erreur")
```

### Warning
```javascript
budibase.notify.warning("Message d'avertissement")
```

### Info
```javascript
budibase.notify.info("Message d'information")
```

---

## CRUD Data

### Search (Recherche)
```javascript
budibase.API.searchTable({
  tableId: "ta_TABLE_NAME",
  query: {
    equal: { field: "value" }
  },
  limit: 50,
  sort: "created_at",
  sortOrder: "descending"
}).then(r => console.log(r.data))
```

### Create (Création)
```javascript
budibase.API.saveRow({
  tableId: "ta_TABLE_NAME",
  field1: "value1",
  field2: "value2"
}).then(r => console.log(r))
```

### Read (Lecture)
```javascript
budibase.API.fetchRow({
  tableId: "ta_TABLE_NAME",
  rowId: "ro_XXXXX"
}).then(r => console.log(r))
```

### Update (Mise à jour)
```javascript
budibase.API.fetchRow({
  tableId: "ta_TABLE_NAME",
  rowId: "ro_XXXXX"
}).then(row => {
  return budibase.API.saveRow({
    ...row,
    fieldToUpdate: "newValue"
  })
})
```

### Delete (Suppression)
```javascript
budibase.API.deleteRow({
  tableId: "ta_TABLE_NAME",
  rowId: "ro_XXXXX",
  revId: "1-XXXXX"
})
```

---

## DOM Manipulation

### Créer élément
```javascript
const el = document.createElement('div')
el.textContent = 'Content'
el.className = 'my-class'
document.querySelector('.container').appendChild(el)
```

### Ajouter événement
```javascript
document.querySelector('.btn').addEventListener('click', (e) => {
  e.preventDefault()
  console.log('Clicked!')
})
```

### Toggle visibilité
```javascript
const el = document.querySelector('.element')
el.style.display = el.style.display === 'none' ? 'block' : 'none'
```

### Modifier style
```javascript
const el = document.querySelector('.element')
el.style.backgroundColor = '#4CAF50'
el.style.color = 'white'
```

---

## Utilitaires

### Console log
```javascript
console.log('Label:', variable)
console.table(arrayOrObject)
```

### Délai (setTimeout)
```javascript
setTimeout(() => {
  // Code à exécuter
}, 3000) // 3 secondes
```

### Intervalle (setInterval)
```javascript
const id = setInterval(() => {
  // Code répété
}, 5000) // 5 secondes
// Arrêter: clearInterval(id)
```

### Condition
```javascript
if (condition) {
  // Si vrai
} else {
  // Si faux
}
```

### User info
```javascript
const user = budibase.auth
console.log(user.email)
console.log(user.roleId)
```

---

## Exemples complets

### Formulaire avec validation
```javascript
// Récupération
const data = {
  name: document.querySelector('#name').value,
  email: document.querySelector('#email').value
}

// Validation
if (!data.name || !data.email) {
  budibase.notify.error("Champs manquants")
  return
}

// Email valide
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
  budibase.notify.error("Email invalide")
  return
}

// Sauvegarde
budibase.API.saveRow({
  tableId: "ta_contacts",
  ...data,
  submitted_at: new Date().toISOString()
}).then(() => {
  budibase.notify.success("Envoyé !")
  document.querySelector('form').reset()
})
```

### Tableau dynamique
```javascript
budibase.API.searchTable({
  tableId: "ta_products",
  limit: 100
}).then(result => {
  let html = '<table><thead><tr>'

  // En-têtes
  Object.keys(result.data[0]).forEach(key => {
    if (!key.startsWith('_')) {
      html += `<th>${key}</th>`
    }
  })
  html += '</tr></thead><tbody>'

  // Lignes
  result.data.forEach(row => {
    html += '<tr>'
    Object.entries(row).forEach(([k, v]) => {
      if (!k.startsWith('_')) {
        html += `<td>${v || '-'}</td>`
      }
    })
    html += '</tr>'
  })
  html += '</tbody></table>'

  document.querySelector('#container').innerHTML = html
})
```

### Dashboard stats
```javascript
budibase.API.searchTable({
  tableId: "ta_orders",
  limit: 1000
}).then(result => {
  const stats = {
    total: result.data.length,
    active: result.data.filter(i => i.status === 'active').length,
    completed: result.data.filter(i => i.status === 'completed').length
  }

  const html = `
    <div class="stats">
      <div><h3>Total</h3><p>${stats.total}</p></div>
      <div><h3>Actifs</h3><p>${stats.active}</p></div>
      <div><h3>Terminés</h3><p>${stats.completed}</p></div>
    </div>
  `

  document.querySelector('#stats').innerHTML = html
})
```

---

## Query filters (searchTable)

### Exact match
```javascript
query: {
  equal: {
    status: "active",
    type: "premium"
  }
}
```

### Not equal
```javascript
query: {
  notEqual: {
    status: "deleted"
  }
}
```

### Range
```javascript
query: {
  range: {
    price: {
      low: 10,
      high: 100
    }
  }
}
```

### String search
```javascript
query: {
  string: {
    name: "search term"
  }
}
```

### Empty / Not empty
```javascript
query: {
  empty: {
    description: true
  },
  notEmpty: {
    email: true
  }
}
```

---

## Objets disponibles

### budibase.auth
```javascript
{
  email: "user@example.com",
  roleId: "ADMIN",
  _id: "us_xxxxx",
  firstName: "John",
  lastName: "Doe"
}
```

### budibase.component
```javascript
{
  id: "component_id",
  type: "custom",
  styles: {...}
}
```

### budibase.app
```javascript
{
  appId: "app_xxxxx",
  name: "My App",
  url: "/app/my-app"
}
```

### budibase.route
```javascript
{
  path: "/current/path",
  params: { id: "123" },
  query: { search: "term" }
}
```

---

## Bonnes pratiques

✅ **Toujours gérer les erreurs**
```javascript
.then(result => { /* succès */ })
.catch(error => {
  console.error(error)
  budibase.notify.error("Erreur")
})
```

✅ **Valider les données**
```javascript
if (!data.field) {
  budibase.notify.error("Champ requis")
  return
}
```

✅ **Donner du feedback**
```javascript
budibase.notify.success("Action réussie")
```

✅ **Logger pour déboguer**
```javascript
console.log('Debug:', variable)
```

✅ **Tester avec onClick d'abord**
```
Mode: onClick → Test → Passer à onMount
```

---

## Configuration du plugin

1. Activez **"Accès au contexte Budibase"**
2. Choisissez le mode :
   - `onMount` - Auto au chargement
   - `onClick` - Manuel via bouton
   - `onInterval` - Périodique
3. Collez votre code JavaScript
4. Testez !

---

## Support

**MEMORA Solutions**
- Stéphane Lapointe
- stephane@memora.ca
- https://memora.solutions

Version 1.0.0 - MIT License
