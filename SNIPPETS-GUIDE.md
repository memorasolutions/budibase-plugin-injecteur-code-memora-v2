# Guide des snippets JavaScript pour Budibase

## Vue d'ensemble

Cette bibliothèque contient **20 snippets JavaScript** prêts à l'emploi pour les cas d'usage les plus courants dans Budibase. Chaque snippet est optimisé pour fonctionner avec le plugin **Injecteur de code personnalisé**.

## Configuration requise

1. **Activer le contexte Budibase** dans les propriétés du composant
2. Cocher la case `Accès au contexte Budibase`
3. L'objet `budibase` sera alors disponible dans votre code

## Structure de l'objet budibase

```javascript
budibase = {
  // Stores réactifs
  component: {},      // Informations du composant
  auth: {},          // Utilisateur connecté
  app: {},           // Informations de l'application
  route: {},         // Informations de routing
  screen: {},        // Informations de l'écran

  // APIs
  API: {
    searchTable: Function,
    saveRow: Function,
    fetchRow: Function,
    deleteRow: Function
  },

  // Notifications
  notify: {
    success: Function,
    error: Function,
    warning: Function,
    info: Function
  }
}
```

## Catégories de snippets

### 1. Notifications (4 snippets)

#### Notification Success
```javascript
budibase.notify.success("Opération réussie !")
```

#### Notification Error
```javascript
budibase.notify.error("Une erreur est survenue")
```

#### Notification Warning
```javascript
budibase.notify.warning("Attention : action irréversible")
```

#### Notification Info
```javascript
budibase.notify.info("Chargement en cours...")
```

---

### 2. CRUD Données (5 snippets)

#### Rechercher dans une table
```javascript
budibase.API.searchTable({
  tableId: "ta_users",
  query: {
    equal: {
      status: "active"
    }
  },
  limit: 50,
  sort: "created_at",
  sortOrder: "descending"
}).then(result => {
  console.log("Résultats:", result.data)
  budibase.notify.success(`${result.data.length} résultats trouvés`)
}).catch(error => {
  budibase.notify.error("Erreur lors de la recherche")
})
```

#### Sauvegarder une ligne
```javascript
budibase.API.saveRow({
  tableId: "ta_products",
  name: "Nouveau produit",
  price: 99.99,
  status: "active"
}).then(result => {
  budibase.notify.success("Produit créé avec succès")
}).catch(error => {
  budibase.notify.error("Erreur lors de la création")
})
```

#### Récupérer une ligne par ID
```javascript
budibase.API.fetchRow({
  tableId: "ta_users",
  rowId: "ro_123abc"
}).then(result => {
  console.log("Ligne récupérée:", result)
  budibase.notify.success("Données chargées")
}).catch(error => {
  budibase.notify.error("Ligne introuvable")
})
```

#### Supprimer une ligne
```javascript
budibase.API.deleteRow({
  tableId: "ta_users",
  rowId: "ro_123abc",
  revId: "1-xyz"
}).then(result => {
  budibase.notify.success("Ligne supprimée")
}).catch(error => {
  budibase.notify.error("Erreur lors de la suppression")
})
```

#### Mettre à jour partiellement
```javascript
// D'abord récupérer la ligne existante
budibase.API.fetchRow({
  tableId: "ta_products",
  rowId: "ro_456def"
}).then(existingRow => {
  // Puis sauvegarder avec les modifications
  return budibase.API.saveRow({
    ...existingRow,
    price: 149.99,
    updated_at: new Date().toISOString()
  })
}).then(result => {
  budibase.notify.success("Mise à jour réussie")
}).catch(error => {
  budibase.notify.error("Erreur lors de la mise à jour")
})
```

---

### 3. Manipulation DOM (4 snippets)

#### Créer un élément HTML
```javascript
const element = document.createElement('div')
element.textContent = 'Nouveau contenu'
element.className = 'custom-class'
element.id = 'custom-id'

const container = document.querySelector('.container')
if (container) {
  container.appendChild(element)
  budibase.notify.success("Élément créé")
} else {
  budibase.notify.error("Conteneur introuvable")
}
```

#### Ajouter un écouteur de clic
```javascript
const button = document.querySelector('.my-button')
if (button) {
  button.addEventListener('click', function(event) {
    event.preventDefault()
    console.log('Bouton cliqué!')
    budibase.notify.info("Bouton cliqué")
  })
} else {
  budibase.notify.error("Bouton introuvable")
}
```

#### Basculer la visibilité
```javascript
const element = document.querySelector('.my-element')
if (element) {
  if (element.style.display === 'none') {
    element.style.display = 'block'
    budibase.notify.info("Élément affiché")
  } else {
    element.style.display = 'none'
    budibase.notify.info("Élément masqué")
  }
}
```

#### Modifier le style d'un élément
```javascript
const element = document.querySelector('.my-element')
if (element) {
  element.style.backgroundColor = '#4CAF50'
  element.style.color = 'white'
  element.style.padding = '20px'
  budibase.notify.success("Style modifié")
}
```

---

### 4. Utilitaires (4 snippets)

#### Logger des données
```javascript
const userData = { name: "John", email: "john@example.com" }
console.log('User data:', userData)
console.table(userData)
```

#### Exécuter après délai
```javascript
setTimeout(() => {
  console.log("Exécution différée")
  budibase.notify.info("Action exécutée")
}, 3000) // 3 secondes
```

#### Exécuter périodiquement
```javascript
const intervalId = setInterval(() => {
  console.log("Exécution périodique")
  // Votre code ici
}, 5000) // Toutes les 5 secondes

// Pour arrêter l'intervalle:
// clearInterval(intervalId)
```

#### Exécution conditionnelle
```javascript
const user = budibase.auth

if (user.roleId === 'ADMIN') {
  console.log("Utilisateur admin détecté")
  budibase.notify.success("Bienvenue, administrateur")
} else {
  console.log("Utilisateur standard")
  budibase.notify.info("Bienvenue, utilisateur")
}
```

#### Récupérer infos utilisateur
```javascript
const user = budibase.auth
console.log('Utilisateur connecté:', user)
console.log('Email:', user.email)
console.log('Rôle:', user.roleId)
budibase.notify.info(`Connecté en tant que ${user.email}`)
```

---

### 5. Exemples complets (3 snippets)

#### Exemple : Soumission de formulaire
```javascript
// Récupérer les valeurs du formulaire
const formData = {
  name: document.querySelector('#name').value,
  email: document.querySelector('#email').value,
  message: document.querySelector('#message').value
}

// Validation basique
if (!formData.name || !formData.email) {
  budibase.notify.error("Veuillez remplir tous les champs obligatoires")
  return
}

// Validation email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(formData.email)) {
  budibase.notify.error("Email invalide")
  return
}

// Sauvegarder dans la base de données
budibase.API.saveRow({
  tableId: "ta_contacts",
  ...formData,
  submitted_at: new Date().toISOString()
}).then(result => {
  console.log("Formulaire soumis:", result)
  budibase.notify.success("Formulaire envoyé avec succès !")
  document.querySelector('form').reset()
}).catch(error => {
  console.error("Erreur:", error)
  budibase.notify.error("Erreur lors de l'envoi")
})
```

#### Exemple : Tableau de données dynamique
```javascript
// Rechercher les données
budibase.API.searchTable({
  tableId: "ta_products",
  limit: 100
}).then(result => {
  const data = result.data

  // Créer le tableau HTML
  let tableHTML = '<table class="data-table"><thead><tr>'

  // En-têtes
  if (data.length > 0) {
    Object.keys(data[0]).forEach(key => {
      if (!key.startsWith('_')) {
        tableHTML += `<th>${key}</th>`
      }
    })
    tableHTML += '</tr></thead><tbody>'

    // Lignes
    data.forEach(row => {
      tableHTML += '<tr>'
      Object.entries(row).forEach(([key, value]) => {
        if (!key.startsWith('_')) {
          tableHTML += `<td>${value || '-'}</td>`
        }
      })
      tableHTML += '</tr>'
    })
    tableHTML += '</tbody></table>'

    // Insérer dans le DOM
    const container = document.querySelector('#table-container')
    if (container) {
      container.innerHTML = tableHTML
      budibase.notify.success(`${data.length} lignes affichées`)
    }
  }
}).catch(error => {
  budibase.notify.error("Erreur de chargement")
})
```

#### Exemple : Statistiques de dashboard
```javascript
// Récupérer les données
budibase.API.searchTable({
  tableId: "ta_orders",
  limit: 1000
}).then(result => {
  const data = result.data

  // Calculer les statistiques
  const stats = {
    total: data.length,
    active: data.filter(item => item.status === 'active').length,
    completed: data.filter(item => item.status === 'completed').length,
    pending: data.filter(item => item.status === 'pending').length
  }

  // Afficher
  const statsHTML = `
    <div class="stats-container">
      <div class="stat-card">
        <h3>Total</h3>
        <p class="stat-value">${stats.total}</p>
      </div>
      <div class="stat-card">
        <h3>Actifs</h3>
        <p class="stat-value">${stats.active}</p>
      </div>
      <div class="stat-card">
        <h3>Terminés</h3>
        <p class="stat-value">${stats.completed}</p>
      </div>
      <div class="stat-card">
        <h3>En attente</h3>
        <p class="stat-value">${stats.pending}</p>
      </div>
    </div>
  `

  const container = document.querySelector('#dashboard-stats')
  if (container) {
    container.innerHTML = statsHTML
    budibase.notify.success("Statistiques chargées")
  }
}).catch(error => {
  budibase.notify.error("Erreur de calcul")
})
```

---

## Bonnes pratiques

### 1. Gestion des erreurs
Toujours utiliser `.catch()` pour gérer les erreurs des APIs :
```javascript
budibase.API.searchTable({...})
  .then(result => { /* succès */ })
  .catch(error => {
    console.error("Erreur:", error)
    budibase.notify.error("Une erreur est survenue")
  })
```

### 2. Validation des données
Valider les données avant de les sauvegarder :
```javascript
if (!email || !name) {
  budibase.notify.error("Champs obligatoires manquants")
  return
}
```

### 3. Feedback utilisateur
Toujours informer l'utilisateur du résultat d'une action :
```javascript
budibase.notify.success("Action réussie")
budibase.notify.error("Action échouée")
```

### 4. Débogage
Utiliser console.log pour suivre l'exécution :
```javascript
console.log("Avant API call")
budibase.API.searchTable({...}).then(result => {
  console.log("Résultat:", result)
})
```

### 5. Modes d'exécution
- **onMount** : Exécution automatique au chargement
- **onClick** : Exécution manuelle via bouton
- **onInterval** : Exécution périodique

---

## Référence API Budibase

### searchTable
```javascript
budibase.API.searchTable({
  tableId: string,        // ID de la table (obligatoire)
  query: {
    string: {},          // Recherche texte
    fuzzy: {},           // Recherche floue
    range: {},           // Recherche par plage
    equal: {},           // Recherche exacte
    notEqual: {},        // Différent de
    empty: {},           // Champs vides
    notEmpty: {}         // Champs non vides
  },
  limit: number,         // Nombre de résultats (défaut: 50)
  sort: string,          // Champ de tri
  sortOrder: string      // "ascending" ou "descending"
})
```

### saveRow
```javascript
budibase.API.saveRow({
  tableId: string,       // ID de la table (obligatoire)
  _id: string,          // ID de la ligne (pour mise à jour)
  _rev: string,         // Révision (pour mise à jour)
  ...fields             // Champs de la table
})
```

### fetchRow
```javascript
budibase.API.fetchRow({
  tableId: string,       // ID de la table (obligatoire)
  rowId: string         // ID de la ligne (obligatoire)
})
```

### deleteRow
```javascript
budibase.API.deleteRow({
  tableId: string,       // ID de la table (obligatoire)
  rowId: string,        // ID de la ligne (obligatoire)
  revId: string         // ID de révision (obligatoire)
})
```

---

## Exemples d'utilisation avec le plugin

### Configuration du composant
1. Glissez le composant "Injecteur de code personnalisé" sur votre écran
2. Dans les propriétés :
   - ✅ Activez "Accès au contexte Budibase"
   - Choisissez le mode d'exécution
   - Collez votre code JavaScript

### Exemple complet : Bouton de sauvegarde
```javascript
// Dans le code JavaScript du composant
const saveButton = document.querySelector('#save-btn')

if (saveButton) {
  saveButton.addEventListener('click', () => {
    const formData = {
      name: document.querySelector('#name').value,
      email: document.querySelector('#email').value
    }

    if (!formData.name || !formData.email) {
      budibase.notify.error("Tous les champs sont obligatoires")
      return
    }

    budibase.API.saveRow({
      tableId: "ta_users",
      ...formData
    }).then(result => {
      budibase.notify.success("Utilisateur créé !")
      console.log("Résultat:", result)
    }).catch(error => {
      budibase.notify.error("Erreur de sauvegarde")
      console.error(error)
    })
  })
}
```

---

## Support et contributions

- **Auteur** : MEMORA Solutions - Stéphane Lapointe
- **Email** : stephane@memora.ca
- **Site** : https://memora.solutions
- **GitHub** : https://github.com/memora-solutions/budibase-injecteur-code

---

## Licence

MIT License - Utilisation libre pour vos projets Budibase
