import App from './app';
import { createApp } from 'vue';
import router from './router';
import store from './store';

const app = createApp(App);

import { Integrations } from '@sentry/tracing';
import * as Sentry from '@sentry/vue';
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    app,
    dsn: 'https://343692c487dd4c37bc0a15957448f6a2@o242649.ingest.sentry.io/5957729',
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ['localhost', 'agileseason.com', /^\//],
      }),
    ],
    tracesSampleRate: 1.0,
  });
}

app.use(store).use(router).mount('#app');
