module.exports = {
  testEnvironment : 'node',
  moduleNameMapper: {
    "/^@privyid\/google-rpc": '<rootDir>/google-rpc',
    "/^@privyid\/(.*)$/"    : '<rootDir>/$1/src',
  },
  transform       : {
    '^.+\\.tsx?$': ['esbuild-jest', { sourcemap: true }]
  },
};
