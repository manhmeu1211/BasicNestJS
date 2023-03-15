module.exports = {
    apps: [
        {
            name: 'KSK_DEV_API',
            script: './dist/src/main.js',
            watch: false,
            kill_timeout: 5000,
            wait_ready: true,
            listen_timeout: 20000,
            autorestart: false,
            env: {
                PORT: 3000,
                NODE_ENV: 'prod',
                TZ: 'Z',
            },
        },
    ],
};
