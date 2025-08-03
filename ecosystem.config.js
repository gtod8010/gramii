const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

module.exports = {
  apps: [
    {
      name: 'gramii',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '4G',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_VARIANT: 'gramii',
        POSTGRES_URL: process.env.POSTGRES_URL_GRAMII,
      },
    },
    {
      name: 'orda',
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '4G',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_VARIANT: 'orda',
        POSTGRES_URL: process.env.POSTGRES_URL_ORDA,
      },
    },
  ],
}; 
