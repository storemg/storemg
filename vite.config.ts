import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' faz com que TODOS os caminhos de assets sejam relativos.
// Isso é o que permite o mesmo build funcionar em:
//   https://usuario.github.io/mg-store/
//   https://mgstore.com.br/
// sem precisar mudar nada quando o domínio mudar.
export default defineConfig({
  plugins: [react()],
  base: './',
})
