import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const geojsonPlugin = () => ({
  name: 'geojson-loader',
  transform(code: string, id: string) {
    if (id.endsWith('.geojson')) {
      return {
        code: `export default ${code};`,
        map: null,
      };
    }
  },
});

export default defineConfig({
  plugins: [react(), geojsonPlugin()],
});
