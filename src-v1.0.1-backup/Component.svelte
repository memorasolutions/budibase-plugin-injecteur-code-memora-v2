<script>
  import { getContext, onMount, onDestroy } from "svelte"

  // Propriétés du composant
  export let htmlCode = ""
  export let cssCode = ""
  export let jsCode = ""
  export let executionMode = "onMount" // onMount, onClick, onInterval
  export let intervalTime = 1000
  export let sandboxMode = false

  // Contexte Budibase
  const component = getContext("component")
  const { styleable, notificationStore, builderStore } = getContext("sdk")

  // Détecter si on est en mode builder
  $: inBuilder = $builderStore?.inBuilder || false

  let containerElement
  let styleElement
  let intervalId
  let hasExecuted = false

  // Fonction pour exécuter le JavaScript
  function executeJavaScript() {
    if (!jsCode.trim()) return

    try {
      if (sandboxMode) {
        const sandboxFunction = new Function('component', 'context', jsCode)
        sandboxFunction(component, getContext)
      } else {
        eval(jsCode)
      }
      notificationStore?.actions?.success("Code JavaScript exécuté avec succès")
    } catch (error) {
      console.error("Erreur d'exécution JavaScript:", error)
      notificationStore?.actions?.error(`Erreur JavaScript: ${error.message}`)
    }
  }

  // Fonction pour injecter le CSS scopé au conteneur
  function injectCSS() {
    if (!cssCode.trim()) return
    if (styleElement) styleElement.remove()

    // Générer un ID unique pour ce composant
    const uniqueId = `injector-${component?.id || Math.random().toString(36).substr(2, 9)}`
    if (containerElement) {
      containerElement.setAttribute('data-injector-id', uniqueId)
    }

    // Scoper le CSS au conteneur uniquement
    const scopedCSS = cssCode
      .split('}')
      .map(rule => {
        if (!rule.trim()) return ''
        const [selector, ...rest] = rule.split('{')
        if (!selector.trim()) return ''
        return `[data-injector-id="${uniqueId}"] ${selector.trim()} { ${rest.join('{')}`
      })
      .join('}\n')

    styleElement = document.createElement('style')
    styleElement.innerHTML = scopedCSS
    document.head.appendChild(styleElement)
  }

  // Fonction d'exécution manuelle
  function executeManually() {
    injectCSS()
    executeJavaScript()
  }

  // Lifecycle
  onMount(() => {
    injectCSS()
    if (executionMode === "onMount") {
      executeJavaScript()
      hasExecuted = true
    } else if (executionMode === "onInterval") {
      intervalId = setInterval(() => {
        executeJavaScript()
      }, intervalTime)
    }
  })

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId)
    if (styleElement) styleElement.remove()
  })

  $: if (cssCode) injectCSS()
  $: if (jsCode && executionMode === "onMount" && !hasExecuted) {
    executeJavaScript()
    hasExecuted = true
  }
</script>

<div
  use:styleable={$component.styles}
  class="injecteur-code-container"
  bind:this={containerElement}
>
  {#if executionMode === "onClick"}
    <button class="execute-button" on:click={executeManually}>
      ▶ Exécuter le code
    </button>
  {/if}

  <!-- Affichage du contenu HTML ou placeholder -->
  {#if htmlCode}
    <div class="html-content">
      {@html htmlCode}
    </div>
  {:else}
    <div class="placeholder">
      <div class="placeholder-icon">📝</div>
      <div class="placeholder-title">Injecteur de code personnalisé</div>
      <div class="placeholder-hint">Configurez le code HTML, CSS ou JavaScript dans les propriétés →</div>
    </div>
  {/if}
</div>

<style>
  .injecteur-code-container {
    display: block;
    width: 100%;
    position: relative;
    box-sizing: border-box;
    min-height: 20px;
    overflow: visible;
  }

  .html-content {
    width: 100%;
    position: relative;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    border: 2px dashed #4CAF50;
    border-radius: 8px;
    background: #f9fff9;
    text-align: center;
    width: 100%;
  }

  .placeholder-icon {
    font-size: 32px;
    margin-bottom: 10px;
  }

  .placeholder-title {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  .placeholder-hint {
    font-size: 12px;
    color: #666;
    max-width: 300px;
  }

  .execute-button {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
    transition: background 0.3s;
  }

  .execute-button:hover {
    background: #45a049;
  }

  .execute-button:active {
    background: #3d8b40;
  }
</style>
