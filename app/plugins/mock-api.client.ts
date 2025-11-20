import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin({
  name: 'mock-api',
  parallel: true,
  async setup() {
    const config = useRuntimeConfig()
    const useMocks = config.public.useMocks

    if (useMocks && import.meta.client) {
      const { worker } = await import('~/mocks/browser')

      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      })

      console.log('[MSW] Mock API is enabled. All API requests will be intercepted.')
    }
  },
})
