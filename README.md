# Injecteur de code personnalisé - Plugin Budibase

**Auteur:** MEMORA Solutions - Stéphane Lapointe
**Contact:** stephane@memora.ca
**Website:** https://memora.solutions
**Version:** 2.2.0
**Licence:** MIT

---

## Description

Plugin Budibase permettant d'injecter du code **HTML**, **CSS** et **JavaScript** personnalisé directement dans vos applications.

Contrairement au composant Embed natif qui bloque les balises `<script>`, ce plugin permet l'exécution complète de JavaScript personnalisé avec plusieurs modes d'exécution.

---

## Fonctionnalités

✓ **Injection HTML** - Injectez du HTML personnalisé
✓ **Injection CSS** - Styles globaux ou spécifiques
✓ **Injection JavaScript** - Exécution de code JS personnalisé
✓ **3 modes d'exécution:**
  - Au chargement (onMount)
  - Au clic (onClick)
  - En intervalle (onInterval)
✓ **Mode Sandbox** - Exécution sécurisée isolée
✓ **Accès aux bindings Budibase** - Intégration complète
✓ **Notifications intégrées** - Feedback visuel

---

## Installation

### 1. Via l'interface Budibase

```
1. Se connecter à Budibase
2. Menu Settings (roue dentée)
3. Onglet Plugins
4. Cliquer "Add plugin"
5. Uploader le fichier .tar.gz du plugin
6. Confirmer l'installation
```

### 2. Vérification

Le plugin "Injecteur de code personnalisé" apparaîtra dans votre liste de composants lors de la création d'écrans.

---

## Utilisation

### Exemple 1: Injection HTML simple

```html
<div class="ma-section">
  <h1>Titre personnalisé</h1>
  <p>Contenu dynamique</p>
  <button onclick="alert('Clic!')">Cliquer ici</button>
</div>
```

### Exemple 2: Injection CSS

```css
.ma-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  border-radius: 10px;
  color: white;
  text-align: center;
}

.ma-section h1 {
  font-size: 32px;
  margin-bottom: 20px;
}
```

### Exemple 3: Injection JavaScript

```javascript
// Manipulation du DOM
document.querySelector('.ma-section').addEventListener('click', function() {
  console.log('Section cliquée!');
});

// Appel API
fetch('https://api.exemple.com/data')
  .then(response => response.json())
  .then(data => console.log(data));

// Animation
setInterval(() => {
  const element = document.querySelector('.ma-section h1');
  element.style.opacity = element.style.opacity === '0' ? '1' : '0';
}, 1000);
```

### Exemple 4: Intégration avec Budibase

```javascript
// Accès au contexte du composant
console.log('Contexte Budibase:', component);

// Afficher une notification
notificationStore.actions.success('Code exécuté avec succès!');

// Manipuler l'état de l'app
// (nécessite accès au contexte approprié)
```

---

## Configuration

### Propriétés disponibles

| Propriété | Type | Description |
|-----------|------|-------------|
| **Code HTML** | Text | Code HTML à injecter |
| **Code CSS** | Text | Code CSS à appliquer |
| **Code JavaScript** | Text | Code JS à exécuter |
| **Mode d'exécution** | Select | onMount / onClick / onInterval |
| **Intervalle (ms)** | Number | Temps entre exécutions (mode interval) |
| **Mode sandbox** | Boolean | Exécution sécurisée isolée |

### Modes d'exécution

#### 1. Au chargement (onMount)
Le code s'exécute automatiquement quand le composant est monté.

```javascript
console.log('Composant chargé!');
```

#### 2. Au clic (onClick)
Un bouton "▶ Exécuter le code" apparaît. Le code s'exécute au clic.

```javascript
alert('Code exécuté manuellement!');
```

#### 3. En intervalle (onInterval)
Le code s'exécute à intervalle régulier (configurable en millisecondes).

```javascript
console.log('Tick:', new Date().toLocaleTimeString());
```

### Mode Sandbox

Quand activé, le code JavaScript est exécuté dans un contexte isolé avec accès limité:

✓ Accès au composant Budibase
✓ Accès au contexte
✗ Pas d'accès direct au window global

**Recommandé pour:** Code provenant de sources externes

---

## Cas d'usage

### 1. Analytics personnalisé

```javascript
// Google Analytics
gtag('event', 'page_view', {
  page_title: 'Dashboard',
  page_location: window.location.href
});
```

### 2. Widgets tiers

```html
<!-- Widget Calendly -->
<div class="calendly-inline-widget"
     data-url="https://calendly.com/votre-lien"
     style="min-width:320px;height:630px;">
</div>
```

```javascript
// Charger le script Calendly
const script = document.createElement('script');
script.src = 'https://assets.calendly.com/assets/external/widget.js';
document.head.appendChild(script);
```

### 3. Animations avancées

```javascript
// Animation GSAP
gsap.to(".element", {
  rotation: 360,
  duration: 2,
  repeat: -1,
  ease: "linear"
});
```

### 4. Intégration chat

```javascript
// Intercom
window.Intercom('boot', {
  app_id: 'votre_app_id',
  name: 'Jean Dupont',
  email: 'jean@exemple.com'
});
```

### 5. Graphiques personnalisés

```javascript
// Chart.js
const ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Fév', 'Mar', 'Avr'],
    datasets: [{
      label: 'Ventes',
      data: [12, 19, 3, 5]
    }]
  }
});
```

---

## Sécurité

### ⚠️ Avertissements

1. **Exécution de code arbitraire**
   - N'utilisez que du code de confiance
   - Évitez d'exécuter du code provenant d'utilisateurs

2. **XSS (Cross-Site Scripting)**
   - Validez et sanitisez toutes les entrées
   - Utilisez le mode sandbox pour du code externe

3. **Accès au DOM**
   - Le code a accès complet au DOM de la page
   - Peut interférer avec Budibase

### ✓ Bonnes pratiques

1. **Tester en développement d'abord**
2. **Utiliser le mode sandbox pour code externe**
3. **Commenter votre code**
4. **Vérifier la console pour erreurs**
5. **Limiter les permissions**

---

## Débogage

### Console JavaScript

Tous les logs et erreurs apparaissent dans la console du navigateur (F12).

```javascript
console.log('Debug:', maVariable);
console.error('Erreur:', monErreur);
```

### Notifications Budibase

Le plugin affiche automatiquement:
- ✓ Message de succès quand le code s'exécute
- ✗ Message d'erreur en cas de problème

### Mode sandbox vs normal

| Mode | Avantages | Inconvénients |
|------|-----------|---------------|
| **Normal** | Accès complet, plus flexible | Moins sécurisé |
| **Sandbox** | Plus sécurisé, isolé | Accès limité au contexte |

---

## FAQ

### Q: Le JavaScript ne s'exécute pas?

**R:** Vérifiez:
1. La console pour erreurs (F12)
2. Que le mode d'exécution est correct
3. Que le code est syntaxiquement valide

### Q: Puis-je charger des librairies externes?

**R:** Oui! Injectez la balise `<script>`:

```javascript
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js';
document.head.appendChild(script);
```

### Q: Le CSS n'affecte que ce composant?

**R:** Non, le CSS est global et affectera toute la page. Utilisez des classes spécifiques:

```css
.mon-plugin-unique .element {
  /* styles */
}
```

### Q: Puis-je accéder aux données Budibase?

**R:** Oui, via le contexte du composant. Consultez la documentation Budibase pour les bindings disponibles.

### Q: Combien de fois puis-je utiliser ce plugin?

**R:** Autant de fois que vous voulez dans une même app! Chaque instance est indépendante.

---

## Exemples avancés

### Dashboard interactif complet

```html
<!-- HTML -->
<div id="dashboard">
  <h2>Tableau de bord</h2>
  <div id="stats"></div>
  <canvas id="chart"></canvas>
</div>
```

```css
/* CSS */
#dashboard {
  font-family: 'Segoe UI', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

#stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
```

```javascript
// JavaScript
// Récupérer les données
fetch('/api/dashboard/stats')
  .then(r => r.json())
  .then(data => {
    // Afficher les stats
    document.getElementById('stats').innerHTML = `
      <div class="stat-card">
        <h3>${data.users}</h3>
        <p>Utilisateurs</p>
      </div>
      <div class="stat-card">
        <h3>${data.revenue}€</h3>
        <p>Revenus</p>
      </div>
    `;

    // Créer le graphique
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: data.chartData
    });
  });
```

---

## Support

### Besoin d'aide?

📧 **Email:** stephane@memora.ca
🌐 **Website:** https://memora.solutions
💬 **Support:** Contact direct via email

### Rapporter un bug

Décrivez:
1. Le comportement attendu
2. Le comportement actuel
3. Les étapes pour reproduire
4. Le code utilisé
5. Les erreurs console (capture d'écran)

---

## Bibliothèque de Snippets

### 📚 Nouvelle fonctionnalité : 20 snippets prêts à l'emploi !

Ce plugin inclut maintenant une bibliothèque complète de **20 snippets JavaScript** pour Budibase :

- **4 snippets** Notifications (success, error, warning, info)
- **5 snippets** CRUD Données (search, save, fetch, delete, update)
- **4 snippets** Manipulation DOM (créer éléments, événements, styles)
- **4 snippets** Utilitaires (logs, timers, conditions, user info)
- **3 snippets** Exemples complets (formulaire, tableau, dashboard)

### Fichiers de la bibliothèque

1. **budibase-snippets-library.json** - Bibliothèque JSON complète
2. **SNIPPETS-GUIDE.md** - Guide détaillé avec exemples
3. **QUICK-REFERENCE.md** - Référence rapide one-page
4. **snippets-demo.html** - Démo visuelle interactive
5. **budibase-api.d.ts** - Définitions TypeScript pour IDE

### Accès rapide

Consultez :
- [Guide des snippets](./SNIPPETS-GUIDE.md) - Documentation complète
- [Référence rapide](./QUICK-REFERENCE.md) - Cheat sheet
- [Démo HTML](./snippets-demo.html) - Interface visuelle

### Exemple d'utilisation

```javascript
// 1. Activer "Accès au contexte Budibase" dans les propriétés
// 2. Utiliser les APIs Budibase directement

// Rechercher des utilisateurs actifs
budibase.API.searchTable({
  tableId: "ta_users",
  query: {
    equal: { status: "active" }
  },
  limit: 50
}).then(result => {
  console.log("Résultats:", result.data)
  budibase.notify.success(`${result.data.length} utilisateurs trouvés`)
})

// Créer un nouveau produit
budibase.API.saveRow({
  tableId: "ta_products",
  name: "Nouveau produit",
  price: 99.99
}).then(result => {
  budibase.notify.success("Produit créé !")
})
```

---

## Roadmap

### Version 1.1 - ✅ Complété
- [x] Bibliothèque de snippets pré-faits
- [x] Guide de référence complet
- [x] Démo visuelle interactive
- [x] Définitions TypeScript

### Version 1.2 (à venir)
- [ ] Éditeur de code avec coloration syntaxique
- [ ] Mode debug avancé
- [ ] Import/export de configurations

### Version 2.0 (planifié)
- [ ] Support TypeScript
- [ ] Intégration NPM packages
- [ ] Hot reload du code
- [ ] Variables d'environnement

---

## Changelog

### 1.0.0 - 3 octobre 2025
- ✨ Version initiale
- ✓ Injection HTML/CSS/JavaScript
- ✓ 3 modes d'exécution
- ✓ Mode sandbox
- ✓ Intégration Budibase complète

---

## Licence

MIT License

Copyright (c) 2025 MEMORA Solutions - Stéphane Lapointe

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**© 2025 MEMORA Solutions - Tous droits réservés**
