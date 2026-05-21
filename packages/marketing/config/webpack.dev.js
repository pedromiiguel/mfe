// Configuração de desenvolvimento do micro-frontend de marketing.
// Roda em servidor isolado na porta 8081 e expõe o app via Module Federation.
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('../package.json');

const devConfig = {
  // Modo development: build mais rápido, sem minificação e com mensagens de erro detalhadas.
  mode: 'development',
  output: {
    // URL pública usada pelo container para carregar os assets deste remote em dev.
    publicPath: 'http://localhost:8081/',
  },
  devServer: {
    // Porta dedicada deste micro-frontend (cada remote tem a sua).
    port: 8081,
    // Faz o dev-server devolver index.html em qualquer rota — necessário para SPAs com react-router.
    historyApiFallback: {
      historyApiFallback: true,
    },
  },
  plugins: [
    // Module Federation: permite que este pacote seja consumido como remote pelo container.
    new ModuleFederationPlugin({
      // Nome do remote, referenciado pelo container ao importar.
      name: 'marketing',
      // Arquivo de manifesto gerado, ponto de entrada da federação.
      filename: 'remoteEntry.js',
      // Módulos que este remote disponibiliza para outros hosts.
      exposes: {
        './MarketingApp': './src/bootstrap',
      },
      // Dependências compartilhadas entre host e remote para evitar duplicação em runtime.
      shared: {
        ...packageJson.dependencies,
        // React precisa ser singleton — múltiplas instâncias quebram hooks e Context.
        react: {
          singleton: true,
          requiredVersion: packageJson.dependencies.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: packageJson.dependencies['react-dom'],
        },
        // Singleton também para que o histórico de navegação seja único entre os MFEs.
        'react-router-dom': {
          singleton: true,
          requiredVersion: packageJson.dependencies['react-router-dom'],
        },
      },
    }),
    // Gera o index.html do dev-server injetando automaticamente os bundles.
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};

// Mescla a configuração comum com a específica de dev.
module.exports = merge(commonConfig, devConfig);
