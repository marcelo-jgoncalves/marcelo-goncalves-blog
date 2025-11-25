// frontend/open-next.config.ts

const config = {
  default: {
    fulfillment: {
      handler: "index.handler",
    },
  },
  // Otimização para reduzir tamanho do pacote
  buildCommand: "npm run build",
};

export default config;
