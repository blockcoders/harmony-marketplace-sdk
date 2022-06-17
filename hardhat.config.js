module.exports = {
  solidity: {
    version: '0.5.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './src/tests/contracts',
    cache: './src/tests/cache',
    artifacts: './src/tests/artifacts',
  },
}
