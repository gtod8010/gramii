module.exports = {
  apps: [
    {
      name: 'gramii',
      script: 'node_modules/.bin/next',
      args: 'start -p 3000',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_VARIANT: 'gramii',
        POSTGRES_URL_GRAMII: 'YOUR_GRAMII_DATABASE_URL_HERE',
        POSTGRES_URL_ORDA: 'YOUR_ORDA_DATABASE_URL_HERE',
      },
    },
    {
      name: 'orda',
      script: 'node_modules/.bin/next',
      args: 'start -p 3001',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SITE_VARIANT: 'orda',
        POSTGRES_URL_GRAMII: 'YOUR_GRAMII_DATABASE_URL_HERE',
        POSTGRES_URL_ORDA: 'YOUR_ORDA_DATABASE_URL_HERE',
      },
    },
  ],
}; 
