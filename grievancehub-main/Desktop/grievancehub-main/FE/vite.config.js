    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react-swc'
    import path from 'path'; // path module import karein

    // https://vite.dev/config/
    export default defineConfig({
      plugins: [react()],
      resolve: {
        alias: {
          // '@' alias ko src folder par point karein
          '@': path.resolve(__dirname, './src'),
        },
      },
    })
    