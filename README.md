# Harmony Marketplace SDK

[![npm](https://img.shields.io/npm/v/harmony-marketplace-sdk)](https://www.npmjs.com/package/harmony-marketplace-sdk)
[![CircleCI](https://circleci.com/gh/blockcoders/harmony-marketplace-sdk/tree/main.svg?style=svg)](https://circleci.com/gh/blockcoders/harmony-marketplace-sdk/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/blockcoders/harmony-marketplace-sdk/badge.svg?branch=main)](https://coveralls.io/github/blockcoders/harmony-marketplace-sdk?branch=main)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/harmony-marketplace-sdk)](https://snyk.io/test/github/blockcoders/harmony-marketplace-sdk)

Harmony Marketplace SDK provides a collection of interfaces to interact with HRC721, HRC1155 and any Smart Contracts that extends those standards. This library was based on [@harmony-js](https://github.com/harmony-one/sdk)

Currently under developement 🤓

## Install

```sh
npm i harmony-marketplace-sdk
```

## Usage

### Node

```typescript
// JavaScript
const { HRC721 } = require('harmony-marketplace-sdk')

// TypeScript
import { HRC721 } from 'harmony-marketplace-sdk'
```

### Browser

Include the ESM module (harmony-marketplace-sdk.esm.js) and import using:

```html
<script type="module">
  import { HRC721 } from './harmony-marketplace-sdk.esm.js'
</script>
```

## Wallet

Harmony Marketplace SDK provides three implemntation of [Wallet](https://github.com/harmony-one/sdk/blob/master/packages/harmony-account/src/wallet.ts#L14) which help to create a Signer from a pivate key or mnemonic effortless.

### Private Key

Implementation of the Wallet that uses a private key.

```ts
import { HttpProvider, WSProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HARMONY_RPC_SHARD_0_URL, HARMONY_RPC_WS } from 'harmony-marketplace-sdk'

const privateKey = '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'

// Using a HttpProvider with a string url.
const pk = new PrivateKey(new HttpProvider('https://api.harmony.one'), privateKey)

// Using a HttpProvider with a const from Harmony Marketplace SDK.
const pk = new PrivateKey(new HttpProvider(HARMONY_RPC_SHARD_0_URL), privateKey)

// Using a WSProvider with a string url.
const pk = new PrivateKey(new WSProvider('wss://ws.s0.t.hmny.io'), privateKey)

// Using a HttpProvider with a const from Harmony Marketplace SDK.
const pk = new PrivateKey(new WSProvider(HARMONY_RPC_WS), privateKey)

// Using a HttpProvider with a pre-configuration from Harmony Marketplace SDK.
const pk = new PrivateKey(new HttpProvider(HarmonyShards.SHARD_0), privateKey)
```

### Mnemonic Key

Implementation of the Wallet that uses a list of words for the mnemonic key.

```ts
import { HttpProvider, WSProvider } from '@harmony-js/network'
import { MnemonicKey, HarmonyShards, HARMONY_RPC_SHARD_0_URL, HARMONY_RPC_WS } from 'harmony-marketplace-sdk'

const mnemonic = 'glory seat canal seven erosion asset guilt perfect fluid dice floor unfold'

// Using a HttpProvider with a string url.
const mnemonicKey = new MnemonicKey(new HttpProvider('https://api.harmony.one'), { mnemonic })

// Using a HttpProvider with a const from Harmony Marketplace SDK.
const mnemonicKey = new MnemonicKey(new HttpProvider(HARMONY_RPC_SHARD_0_URL), { mnemonic })

// Using a WSProvider with a string url.
const mnemonicKey = new MnemonicKey(new WSProvider('wss://ws.s0.t.hmny.io'), { mnemonic })

// Using a HttpProvider with a const from Harmony Marketplace SDK.
const mnemonicKey = new MnemonicKey(new WSProvider(HARMONY_RPC_WS), { mnemonic })

// Using a HttpProvider with a pre-configuration from Harmony Marketplace SDK.
const mnemonicKey = new MnemonicKey(new HttpProvider(HarmonyShards.SHARD_0), { mnemonic })
```

### Simple Key

Implementation of the Wallet that does not use any pk or mnemonic.

```ts
import { HttpProvider, WSProvider } from '@harmony-js/network'
import { Key, HarmonyShards, HARMONY_RPC_SHARD_0_URL, HARMONY_RPC_WS } from 'harmony-marketplace-sdk'

// Using a HttpProvider with a string url.
const key = new Key(new HttpProvider('https://api.harmony.one'))

// Using a HttpProvider with a const from Harmony Marketplace SDK.
const key = new Key(new HttpProvider(HARMONY_RPC_SHARD_0_URL))

// Using a WSProvider with a string url.
const key = new Key(new WSProvider('wss://ws.s0.t.hmny.io'))

// Using a HttpProvider with a const from Harmony Marketplace SDK.
const key = new Key(new WSProvider(HARMONY_RPC_WS))

// Using a HttpProvider with a pre-configuration from Harmony Marketplace SDK.
const key = new Key(new HttpProvider(HarmonyShards.SHARD_0))

// Add Private key manually
key.addByPrivateKey('45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e')
```

### HD Key

Implementation of a hierarchical deterministic (HD) wallet that uses a mnemonic to generate the derivative addresses.

```ts
import { HttpProvider, WSProvider } from '@harmony-js/network'
import { HDKey, HarmonyShards, HARMONY_RPC_SHARD_0_URL, HARMONY_RPC_WS } from 'harmony-marketplace-sdk'

const options = {
  mnemonic: 'glory seat canal seven erosion asset guilt perfect fluid dice floor unfold',
  index: 0,
  numberOfAddresses: 1,
  shardId: 0,
  gasLimit: '1000000',
  gasPrice: '2000000000',
}

// Using a HttpProvider with a string url.
const key = new HDKey(new HttpProvider('https://api.harmony.one'), options)

// Using a HttpProvider with a const from Harmony Marketplace SDK.
const key = new HDKey(new HttpProvider(HARMONY_RPC_SHARD_0_URL), options)

// Using a WSProvider with a string url.
const key = new HDKey(new WSProvider('wss://ws.s0.t.hmny.io'), options)

// Using a HttpProvider with a const from Harmony Marketplace SDK.
const key = new HDKey(new WSProvider(HARMONY_RPC_WS), options)

// Using a HttpProvider with a pre-configuration from Harmony Marketplace SDK.
const key = new HDKey(new HttpProvider(HarmonyShards.SHARD_0), options)
```

## Base Token

The `BaseToken` is an extension over a regular [Contract](https://github.com/harmony-one/sdk/tree/master/packages/harmony-contract) which is the Harmony recomendation for interact with smart contracts. This abstract class contains the core functionality for interact with Harmony Smart Contracts.

### Common Methods

This methods are common for [HRC721](#hrc721-api) and [HRC1155](#hrc1155-api).

#### setApprovalForAll

Approve or remove operator as an operator for the caller.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, BaseToken } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

class TestNFT extends BaseToken {}

// A contract instance
const contract = new TestNFT('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.setApprovalForAll('0x...01', true)
```

#### isApprovedForAll

Returns if the operator is allowed to manage all of the assets of owner.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, BaseToken } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

class TestNFT extends BaseToken {}

// A contract instance
const contract = new TestNFT('0x...00', ABI, wallet)

// returns a boolean.
const approved = await contract.isApprovedForAll('0x...01', '0x...02')
```

## HRC721 API

The `HRC721` implements the abstract class [Base Token](#base-token).

**NOTE**: The harmony [explorer](https://explorer.harmony.one/hrc721) will look for a specific list of functions and events to identify HRC721 tokens. You can validate if the bytecode of your HRC71 is valid [here](https://explorer.harmony.one/tools/checkHrc).

Expected Methods:
| Method | Description |
| ------------- | ------------- |
| transferFrom | Transfers tokenId token from an address to another. |
| safeTransferFrom | Safely transfers tokenId token from an address to another. |
| balanceOf | The number of tokens in owner's account. |
| approve | Gives permission to to to transfer tokenId token to another account. |
| totalSupply | Total amount of tokens stored by the contract. |
| ownerOf | The owner of the tokenId token. |
| tokenURI | The Uniform Resource Identifier (URI) for tokenId token. |
| symbol | The token collection symbol. |
| name | The token collection name. |

Expected Events
| Event | Description |
| ------------- | ------------- |
| Transfer | Emitted when a token id is transferred from an address to another. |
| Approval | Emitted when owner enables approved to manage the tokenId token. |

You can find an example of [HRC721](./src/tests/contracts/HRC721/BlockcodersHRC721.sol) in this address [0x...0a0a](https://explorer.pops.one/address/0xbba5d03304318b8fe765d977081eb392eb170a0a?activeTab=0).

### Initializing

```typescript
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// A contract instance with options
const contract = new HRC721('0x...00', ABI, wallet, {
  data: '0x',
  shardID: 0,
  address: '0x...00',
  defaultAccount: wallet.getAccount('0x...00'),
  defaultBlock: 'lastest',
  defaultGas: '21000',
  defaultGasPrice: '1',
  transactionBlockTimeout: 2000,
  transactionConfirmationBlocks: '10',
  transactionPollingTimeout: 200,
})
```

### Methods

#### balanceOf

Returns the number of tokens in owner's account.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a BN instance.
const balance = await contract.balanceOf('0x...01')
```

#### ownerOf

Returns the owner of the tokenId token.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns an address.
const owner = await contract.ownerOf('1')
```

#### safeTransferFrom

Safely transfers tokenId token from an address to another.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.safeTransferFrom('0x...01', '0x...02', '1', '0x')
```

#### transferFrom

Transfers tokenId token from an address to another. Usage of this method is discouraged, use [safeTransferFrom](#safetransferfrom) whenever possible.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.transferFrom('0x...01', '0x...02', '1')
```

#### approve

Gives permission to to to transfer tokenId token to another account.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.approve('0x...01', '1')
```

#### getApproved

Returns the account approved for tokenId token.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns an address.
const address = await contract.getApproved('1')
```

####  totalSupply

Returns the total amount of tokens stored by the contract.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a number value.
const supply = await contract.totalSupply()
```

#### tokenURI

Returns the Uniform Resource Identifier (URI) for tokenId token.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a string value.
const uri = await contract.tokenURI()
```

#### symbol

Returns the token collection symbol.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a string value.
const symbol = await contract.symbol() // Blockcoders
```

#### name

Returns the token collection name.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a string value.
const name = await contract.name() // Blockcoders NFT
```

## HRC1155 API

The `HRC1155` implements the abstract class [Base Token](#base-token).

**NOTE**: The harmony [explorer](https://explorer.harmony.one/hrc1155) will look for s specific list of functions and events to identify HRC1155 tokens. You can validate if the bytecode of your HRC1155 is valid [here](https://explorer.harmony.one/tools/checkHrc).

Expected Methods:
| Method | Description |
| ------------- | ------------- |
| owner | Address of the current owner. |
| tokenURIPrefix | Token URI prefix |
| balanceOfBatch | Batched version of balanceOf |
| contractURI | Contract URI prefix |

Expected Events
| Event | Description |
| ------------- | ------------- |
| TransferSingle | Emitted when a token id are transferred from an address to another by operator. |
| TransferBatch | Emitted when a token ids are transferred from an address to another by operator. |

You can find an example of [HRC1155](./src/tests/contracts/HRC1155/BlockcodersHRC1155.sol) in this address [0x...b264](https://explorer.pops.one/address/0x16703afb468e4ba88380c2a2fda1aa4c5ec7b264).

### Initializing

```typescript
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// A contract instance with options
const contract = new HRC1155('0x...00', ABI, wallet, {
  data: '0x',
  shardID: 0,
  address: '0x...00',
  defaultAccount: wallet.getAccount('0x...00'),
  defaultBlock: 'lastest',
  defaultGas: '21000',
  defaultGasPrice: '1',
  transactionBlockTimeout: 2000,
  transactionConfirmationBlocks: '10',
  transactionPollingTimeout: 200,
})
```

### Methods

#### balanceOf

Returns the amount of tokens of token type id owned by account.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns a BN instance.
const balance = await contract.balanceOf('0x...01', '1')
```

#### balanceOfBatch

Batched version of [balanceOf](#balanceof).

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns an array of BN instance.
const balances = await contract.balanceOfBatch(['0x...01', '0x...02'], ['1', '2'])
```

#### safeTransferFrom

Transfers amount tokens of token type id from an address to another.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.safeTransferFrom('0x...01', '0x...02', '1', 1, '0x')
```

#### safeBatchTransferFrom

Batched version of [safeTransferFrom](#safetransferfrom).

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.safeBatchTransferFrom('0x...01', '0x...02', ['1', '2'], [1, 1], '0x')
```

#### owner

Returns the address of the current owner.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns an address.
const owner = await contract.owner()
```

#### tokenURIPrefix

Returns the token URI prefix.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns an string value.
const uri = await contract.tokenURIPrefix()
```

#### contractURI

Returns the contract URI prefix.

```ts
import { HttpProvider } from '@harmony-js/network'
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  new HttpProvider(HarmonyShards.SHARD_0),
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns an string value.
const uri = await contract.contractURI()
```

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Collaborators

- [**Jose Ramirez**](https://github.com/0xslipk)
- [**Brian Zuker**](https://github.com/bzuker)
- [**Ana Riera**](https://github.com/AnnRiera)

## Acknowledgements

This project was kindly sponsored by [Harmony](https://www.harmony.one/).

## License

Licensed under the MIT - see the [LICENSE](LICENSE) file for details.
