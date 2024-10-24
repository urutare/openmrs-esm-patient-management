const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development', // Change to 'production' for production builds
  entry: './src/index.tsx', // Your entry point
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output bundle file
    clean: true, // Clean the output directory before emit
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // Resolve these extensions
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'), // Example alias
      '@styles': path.resolve(__dirname, 'src/styles/'), // Example alias
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Match .ts and .tsx files
        use: 'ts-loader', // Use ts-loader for TypeScript
        exclude: /node_modules/, // Exclude node_modules
      },
      {
        test: /\.js$/, // Match .js files
        use: 'babel-loader', // Use Babel for transpiling JavaScript
        exclude: /node_modules/,
      },
      {
        test: /\.css$/, // Match .css files
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS to a separate file
          'css-loader', // Process CSS files
        ],
      },
      {
        test: /\.scss$/, // Match .scss files
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS to a separate file
          'css-loader', // Process CSS files
          'sass-loader', // Compile Sass to CSS
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Match image files
        type: 'asset/resource', // Use asset module for images
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Template HTML file
      filename: 'index.html', // Output HTML file
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css', // Output CSS file naming
      chunkFilename: '[id].css',
    }),
  ],
  devtool: 'source-map', // Enable source maps for easier debugging
  devServer: {
    static: './dist', // Serve content from the output directory
    hot: true, // Enable hot module replacement
    open: true, // Open the browser automatically
    port: 3000, // Set the development server port
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // Split chunks for better caching
    },
  },
};
