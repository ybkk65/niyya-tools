/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  webpack: (config, { isServer }) => {
    // Support pour les fichiers WASM (nécessaire pour @imgly/background-removal)
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Exclure les packages problématiques du côté serveur
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@imgly/background-removal': 'commonjs @imgly/background-removal',
        '@tensorflow/tfjs': 'commonjs @tensorflow/tfjs',
        '@tensorflow/tfjs-node': 'commonjs @tensorflow/tfjs-node',
        '@tensorflow/tfjs-backend-webgl': 'commonjs @tensorflow/tfjs-backend-webgl',
        '@tensorflow/tfjs-backend-cpu': 'commonjs @tensorflow/tfjs-backend-cpu',
        'onnxruntime-node': 'commonjs onnxruntime-node',
      });
    }

    // Ajouter des règles pour ignorer certains fichiers
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    
    // Ignorer les fichiers .node
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    // Ignorer tous les source maps qui causent des problèmes
    config.module.rules.push({
      test: /\.map$/,
      use: 'ignore-loader',
    });

    // Traiter les fichiers .mjs comme des modules ES
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    // Exclure onnxruntime du build
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-node': false,
      'onnxruntime-web': false,
    };

    // Ignorer les warnings pour les modules optionnels
    config.ignoreWarnings = [
      { module: /node_modules\/@imgly\/background-removal/ },
      { module: /node_modules\/@tensorflow/ },
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve/,
    ];

    // Fallbacks pour les modules Node.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
  },
  // Transpiler les packages ESM
  transpilePackages: ['@imgly/background-removal'],
};

module.exports = nextConfig;
