import axios from 'axios';
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    /* Default, in accordance to default docker-compose.yml. */
    baseUrl: 'http://localhost:8080/',
    setupNodeEvents(on, config) {
      on('task', {
        async resetDb() {
          await axios.get('/api/e2e/redo-data', {
            baseURL: config.baseUrl ?? undefined,
          });
          return null;
        },
      });
    },
  },
});
