export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('currency', {
    mounted(el: HTMLElement, binding) {
      const text = el.innerText
      const value = parseFloat(binding.arg ?? text)

      if (isNaN(value)) {
        el.innerText = '-'
        return
      }

      const result = useCurrency(value, binding.value)
      el.innerHTML = result
    },
    updated(el: HTMLElement, binding) {
      const text = el.innerText
      const value = parseFloat(binding.arg ?? text)

      if (isNaN(value)) {
        el.innerText = '-'
        return
      }

      const result = useCurrency(value, binding.value)
      el.innerHTML = result
    },
  })
})