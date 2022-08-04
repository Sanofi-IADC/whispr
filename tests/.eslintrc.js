module.exports = {
  root: false,
  overrides: [
    {
      files: ['*.ts'],

      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: [
              '**/*.*spec.ts',
              'tests/e2e/setup.ts',
              'tests/testUtils/auth.helper.ts',
              'tests/testUtils/mongo/MongooseTestModule.ts',
            ],
          },
        ],
      },
    },
  ],
};
