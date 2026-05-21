// Configuração base do webpack, compartilhada entre os ambientes de dev e prod.
// É mesclada com webpack.dev.js ou webpack.prod.js através do webpack-merge.
module.exports = {
  module: {
    rules: [
      {
        // Aplica a regra a arquivos .js e .mjs.
        test: /\.m?js$/,
        // Ignora dependências de node_modules (já vêm transpiladas).
        exclude: /node_modules/,
        use: {
          // babel-loader transpila o código moderno para uma versão compatível com navegadores.
          loader: 'babel-loader',
          options: {
            // preset-react: suporte a JSX. preset-env: transpila ES6+ conforme os targets.
            presets: ['@babel/preset-react', '@babel/preset-env'],
            // Reaproveita helpers do Babel via @babel/runtime, evitando duplicação em cada arquivo.
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
    ],
  },
};
