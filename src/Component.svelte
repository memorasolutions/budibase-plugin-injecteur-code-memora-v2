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

  // Fonction pour injecter le CSS scopé
  function injectCSS() {
    if (!cssCode.trim()) return
    if (styleElement) styleElement.remove()

    const uniqueId = `injector-${component?.id || Math.random().toString(36).substr(2, 9)}`
    if (containerElement) {
      containerElement.setAttribute('data-injector-id', uniqueId)
    }

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

  // Style inline ultra-agressif
  const forceHorizontal = "display:block!important;width:100%!important;writing-mode:horizontal-tb!important;direction:ltr!important;text-orientation:mixed!important;box-sizing:border-box!important;"
</script>

<div
  use:styleable={$component.styles}
  class="injecteur-code-container"
  bind:this={containerElement}
  style={forceHorizontal}
>
  {#if executionMode === "onClick"}
    <button
      class="execute-button"
      on:click={executeManually}
      style="background:#4CAF50!important;color:white!important;border:none!important;padding:10px 20px!important;border-radius:5px!important;cursor:pointer!important;font-size:14px!important;font-weight:bold!important;margin-bottom:10px!important;{forceHorizontal}"
    >
      ▶ Exécuter le code
    </button>
  {/if}

  {#if htmlCode}
    <div style={forceHorizontal + "word-wrap:break-word!important;"}>
      {@html htmlCode}
    </div>
  {:else}
    <div style="display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;padding:20px!important;border:2px dashed #4CAF50!important;border-radius:8px!important;background:#f9fff9!important;text-align:center!important;width:100%!important;box-sizing:border-box!important;writing-mode:horizontal-tb!important;direction:ltr!important;">
      <div style="font-size:32px!important;margin-bottom:10px!important;writing-mode:horizontal-tb!important;direction:ltr!important;">📝</div>
      <div style="font-size:14px!important;font-weight:600!important;color:#333!important;margin-bottom:8px!important;writing-mode:horizontal-tb!important;direction:ltr!important;line-height:1.5!important;">Injecteur de code personnalisé</div>
      <div style="font-size:12px!important;color:#666!important;writing-mode:horizontal-tb!important;direction:ltr!important;line-height:1.5!important;white-space:normal!important;word-wrap:break-word!important;">Configurez le code HTML, CSS ou JavaScript dans les propriétés →</div>
    </div>
  {/if}
</div>

<style>
  .injecteur-code-container {
    display: block !important;
    width: 100% !important;
    writing-mode: horizontal-tb !important;
    direction: ltr !important;
    text-orientation: mixed !important;
    box-sizing: border-box !important;
  }

  .execute-button:hover {
    background: #45a049 !important;
  }

  .execute-button:active {
    background: #3d8b40 !important;
  }
</style>
