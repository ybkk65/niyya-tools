/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimisations de production
  compress: true, // Compression gzip
  poweredByHeader: false, // Retirer le header X-Powered-By
  reactStrictMode: true, // Mode strict React
  
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'], // Formats modernes
  },
  
  webpack: (config, { isServer, webpack, dev }) => {
    // Permettre au code client d'accéder aux variables d'environnement nécessaires
    if (!isServer) {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(dev ? 'development' : 'production'),
        })
      );
      
      // Configuration du output pour les fichiers WASM
      config.output = config.output || {};
      config.output.publicPath = '/_next/';
      config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm';
    }
    
    // Support WASM pour @imgly/background-removal
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
      syncWebAssembly: true,
    };

    // IMPORTANT: Exclure les packages côté serveur car ils fonctionnent uniquement dans le navigateur
    // Sans cette exclusion, le build Vercel échouera
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(
        '@imgly/background-removal',
        '@tensorflow/tfjs',
        '@tensorflow/tfjs-node',
        '@tensorflow/tfjs-backend-webgl',
        '@tensorflow/tfjs-backend-cpu',
        'onnxruntime-node',
        'onnxruntime-web'
      );
    }

    // Gérer les fichiers .node et .map
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    config.module.rules.push(
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.map$/,
        use: 'ignore-loader',
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      // Gérer les fichiers WASM
      {
        test: /\.wasm$/,
        type: 'asset/resource',
      }
    );

    // Configuration des alias pour onnxruntime
    config.resolve.alias = config.resolve.alias || {};
    if (!isServer) {
      // Côté client: rediriger onnxruntime-node vers onnxruntime-web
      config.resolve.alias['onnxruntime-node'] = 'onnxruntime-web';
    } else {
      // Côté serveur: désactiver complètement
      config.resolve.alias['onnxruntime-node'] = false;
      config.resolve.alias['onnxruntime-web'] = false;
    }

    // Ignorer les warnings
    config.ignoreWarnings = [
      /Critical dependency/,
      /Module not found/,
    ];

    // Fallbacks Node.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
  },
  transpilePackages: ['@imgly/background-removal'],
};

module.exports = nextConfig;
