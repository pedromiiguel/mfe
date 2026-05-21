// Configuração de produção do micro-frontend de marketing.
// Gera os assets otimizados que serão publicados em CDN/S3 sob /marketing/latest/.
const { merge } = require('webpack-merge');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const packageJson = require('../package.json');
const commonConfig = require('./webpack.common');

const prodConfig = {
  // Modo production: minificação, tree-shaking e demais otimizações habilitadas.
  mode: 'production',
  output: {
    // contenthash no nome permite cache de longo prazo: o arquivo muda só quando o conteúdo muda.
    filename: '[name].[contenthash].js',
    // Caminho público em produção — precisa bater com onde o bundle é hospedado.
    publicPath: '/marketing/latest/',
  },
  plugins: [
    // Mesma configuração de Module Federation do dev, mas sem HtmlWebpackPlugin:
    // em produção este pacote é apenas remote, não roda standalone.
    new ModuleFederationPlugin({
      name: 'marketing',
      filename: 'remoteEntry.js',
      exposes: {
        './MarketingApp': './src/bootstrap',
      },
      shared: {
        ...packageJson.dependencies,
        // React como singleton para garantir uma única instância em runtime entre os MFEs.
        react: {
          singleton: true,
          requiredVersion: packageJson.dependencies.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: packageJson.dependencies['react-dom'],
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: packageJson.dependencies['react-router-dom'],
        },
      },
    }),
  ],
};

// Mescla a configuração comum com a específica de produção.
module.exports = merge(commonConfig, prodConfig);
