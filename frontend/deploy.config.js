// Configuration de déploiement pour Community Laboratory Burundi
export const deployConfig = {
  // Environnements de déploiement
  environments: {
    development: {
      name: 'Development',
      url: 'http://localhost:5173',
      apiUrl: 'http://localhost:8000/api',
      branch: 'develop',
      autoDeployment: true,
    },
    staging: {
      name: 'Staging',
      url: 'https://staging.comlab.bi',
      apiUrl: 'https://api-staging.comlab.bi/api',
      branch: 'staging',
      autoDeployment: true,
      requiresApproval: false,
    },
    production: {
      name: 'Production',
      url: 'https://comlab.bi',
      apiUrl: 'https://api.comlab.bi/api',
      branch: 'main',
      autoDeployment: false,
      requiresApproval: true,
      backupBeforeDeploy: true,
    },
  },

  // Configuration Vercel
  vercel: {
    projectName: 'community-laboratory-burundi',
    framework: 'vite',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm ci',
    devCommand: 'npm run dev',
    environmentVariables: {
      development: {
        VITE_API_URL: 'http://localhost:8000/api',
        VITE_NODE_ENV: 'development',
        VITE_DEBUG_MODE: 'true',
      },
      staging: {
        VITE_API_URL: 'https://api-staging.comlab.bi/api',
        VITE_NODE_ENV: 'staging',
        VITE_DEBUG_MODE: 'false',
        VITE_ENABLE_ANALYTICS: 'true',
      },
      production: {
        VITE_API_URL: 'https://api.comlab.bi/api',
        VITE_NODE_ENV: 'production',
        VITE_DEBUG_MODE: 'false',
        VITE_ENABLE_ANALYTICS: 'true',
        VITE_CSP_ENABLED: 'true',
      },
    },
    headers: [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ],
    redirects: [
      {
        source: '/dashboard',
        destination: '/dashboard/student',
        permanent: false,
      },
    ],
    rewrites: [
      {
        source: '/api/:path*',
        destination: 'https://api.comlab.bi/api/:path*',
      },
    ],
  },

  // Configuration Netlify (alternative)
  netlify: {
    buildCommand: 'npm run build',
    publishDirectory: 'dist',
    functionsDirectory: 'netlify/functions',
    redirects: [
      {
        from: '/api/*',
        to: 'https://api.comlab.bi/api/:splat',
        status: 200,
      },
      {
        from: '/*',
        to: '/index.html',
        status: 200,
      },
    ],
    headers: [
      {
        for: '/*',
        values: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
        },
      },
      {
        for: '/sw.js',
        values: {
          'Cache-Control': 'public, max-age=0, must-revalidate',
        },
      },
    ],
  },

  // Configuration Docker
  docker: {
    baseImage: 'node:18-alpine',
    workdir: '/app',
    buildSteps: [
      'COPY package*.json ./',
      'RUN npm ci --only=production',
      'COPY . .',
      'RUN npm run build',
    ],
    serveCommand: 'npx serve -s dist -l 3000',
    healthCheck: {
      test: ['CMD', 'curl', '-f', 'http://localhost:3000'],
      interval: '30s',
      timeout: '10s',
      retries: 3,
    },
  },

  // Scripts de déploiement
  scripts: {
    preDeploy: [
      'npm run lint',
      'npm run type-check',
      'npm run test:unit',
      'npm run build',
      'npm run test:e2e',
    ],
    postDeploy: [
      'npm run test:smoke',
      'npm run lighthouse',
      'npm run notify-team',
    ],
  },

  // Configuration de monitoring
  monitoring: {
    healthChecks: [
      {
        name: 'Homepage',
        url: '/',
        expectedStatus: 200,
        timeout: 5000,
      },
      {
        name: 'Login Page',
        url: '/login',
        expectedStatus: 200,
        timeout: 5000,
      },
      {
        name: 'API Health',
        url: '/api/health/',
        expectedStatus: 200,
        timeout: 3000,
      },
    ],
    alerts: {
      email: ['admin@comlab.bi', 'tech@comlab.bi'],
      slack: {
        webhook: process.env.SLACK_WEBHOOK_URL,
        channel: '#alerts',
      },
    },
  },

  // Configuration de rollback
  rollback: {
    enabled: true,
    keepVersions: 5,
    autoRollbackOnFailure: true,
    rollbackTriggers: [
      'health_check_failure',
      'error_rate_threshold',
      'performance_degradation',
    ],
  },
}

export default deployConfig
