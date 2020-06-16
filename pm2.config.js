module.exports = {
  apps: [
    {
      name: 'Backend',
      script: './dist/main.js',
      // eslint-disable-next-line @typescript-eslint/camelcase
      exec_mode: 'cluster_mode',
      instances: 'max',
    },
  ],
};
