Harmony Marketplace SDK
=================

[![npm](https://img.shields.io/npm/v/harmony-marketplace-sdk)](https://www.npmjs.com/package/harmony-marketplace-sdk)
[![CircleCI](https://circleci.com/gh/blockcoders/harmony-marketplace-sdk/tree/main.svg?style=svg)](https://circleci.com/gh/blockcoders/harmony-marketplace-sdk/tree/main)
[![Coverage Status](https://coveralls.io/repos/github/blockcoders/harmony-marketplace-sdk/badge.svg?branch=main)](https://coveralls.io/github/blockcoders/harmony-marketplace-sdk?branch=main)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/943e9d8d050d4f129d2a2c63afdd419b)](https://www.codacy.com/gh/blockcoders/harmony-marketplace-sdk/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=blockcoders/harmony-marketplace-sdk&amp;utm_campaign=Badge_Grade)
[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/harmony-marketplace-sdk)](https://snyk.io/test/github/blockcoders/harmony-marketplace-sdk)
[![License](https://img.shields.io/badge/license-MIT%20License-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![BCH compliance](https://bettercodehub.com/edge/badge/blockcoders/harmony-marketplace-sdk?branch=main)](https://bettercodehub.com/)
[![CodeQL](https://github.com/blockcoders/harmony-marketplace-sdk/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/blockcoders/harmony-marketplace-sdk/actions/workflows/codeql-analysis.yml)

Harmony Marketplace SDK provides a collection of interfaces to interact with HRC721, HRC1155 and any Smart Contracts that extends those standards. This library was based on [@harmony-js](https://github.com/harmony-one/sdk)

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

// Using a WSProvider with a const from Harmony Marketplace SDK.
const pk = new PrivateKey(new WSProvider(HARMONY_RPC_WS), privateKey)

// Using a provider with a pre-configuration from Harmony Marketplace SDK.
const pk = new PrivateKey(HarmonyShards.SHARD_0, privateKey)
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

// Using a WSProvider with a const from Harmony Marketplace SDK.
const mnemonicKey = new MnemonicKey(new WSProvider(HARMONY_RPC_WS), { mnemonic })

// Using a provider with a pre-configuration from Harmony Marketplace SDK.
const mnemonicKey = new MnemonicKey(HarmonyShards.SHARD_0, { mnemonic })
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

// Using a WSProvider with a const from Harmony Marketplace SDK.
const key = new Key(new WSProvider(HARMONY_RPC_WS))

// Using a provider with a pre-configuration from Harmony Marketplace SDK.
const key = new Key(HarmonyShards.SHARD_0)

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

// Using a WSProvider with a const from Harmony Marketplace SDK.
const key = new HDKey(new WSProvider(HARMONY_RPC_WS), options)

// Using a provider with a pre-configuration from Harmony Marketplace SDK.
const key = new HDKey(HarmonyShards.SHARD_0, options)
```

## Base Token

The `BaseToken` is an extension over a regular [Contract](https://github.com/harmony-one/sdk/tree/master/packages/harmony-contract) which is the Harmony recomendation for interact with smart contracts. This abstract class contains the core functionality for interact with Harmony Smart Contracts.

## HRC20 API

The `HRC20` implements the abstract class [Base Token](#base-token).

**NOTE**: The harmony [explorer](https://explorer.harmony.one/hrc20) will look for a specific list of functions and events to identify HRC20 tokens. You can validate if the bytecode of your HRC20 is valid [here](https://explorer.harmony.one/tools/checkHrc).

Expected Methods:
| Method | Description |
| ------------- | ------------- |
| totalSupply | Total amount of tokens stored by the contract. |
| balanceOf | Returns the amount of tokens owned by account. |
| transfer | Moves amount tokens from the caller’s account to another account. |
| allowance | Returns the remaining number of tokens that spender will be allowed to spend on behalf of owner through transferFrom |
| approve | Sets amount as the allowance of spender over the caller’s tokens. |
| transferFrom | Moves amount tokens from an account to another account using the allowance mechanism. |
| symbol | Returns the symbol of the token. |
| name | Returns the name of the token. |
| decimals | Returns the decimals places of the token. |
| mint | Creates amount tokens and assigns them to account. |
| burn | Destroys amount tokens from account. |
| burnFrom | Destroys amount tokens from an account. |


Expected Events
| Event | Description |
| ------------- | ------------- |
| Transfer | Emitted when a token id is transferred from an address to another. |
| Approval | Emitted when owner enables approved to manage the tokenId token. |

You can find an example of [HRC20](./src/tests/contracts/BlockcodersHRC20.sol) in this address [0x...0a0a](https://explorer.ps.hmny.io/address/0x35305d505a884ccfaba7b7d5f533ef29ad57254b?activeTab=7).

### Initializing

```typescript
import { PrivateKey, HarmonyShards, HRC20 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC20('0x...00', ABI, wallet)

// A contract instance with options
const contract = new HRC20('0x...00', ABI, wallet, {
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

#### totalSupply(txOptions?: ITransactionOptions): Promise&lt;BN&gt;

<p>Returns the amount of tokens in existence.</p>

```ts
import { PrivateKey, HarmonyShards, HRC20 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC20('0x...00', ABI, wallet)

// returns the totalSupply as a BN instance
const totalSupply = await contract.totalSupply()
```

#### balanceOf(address: string, txOptions?: ITransactionOptions): Promise&lt;BN&gt;

<p>Returns the number of tokens owned by <code>address</code>.</p>

```ts

import { PrivateKey, HarmonyShards, HRC20 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC20('0x...00', ABI, wallet)

// returns a BN instance.
const balance = await contract.balanceOf('0x...01')
```

#### transfer(to: string, amount: BNish, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Moves <code>amount</code> tokens from the caller’s account to <code>to</code>.</p>

```ts

import { PrivateKey, HarmonyShards, HRC20 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC20('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.transfer('0x...01', '1')
```

#### allowance(owner: string, spender: string, txOptions?: ITransactionOptions): Promise&lt;BN&gt;

<p>Returns the remaining number of tokens that <code>spender</code> will be allowed to spend on behalf of <code>owner</code> through transferFrom. This is zero by default.</p>
<p>This value changes when <code>approve</code> or <code>transferFrom</code> are called.</p>

```ts

import { PrivateKey, HarmonyShards, HRC20 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC20('0x...00', ABI, wallet)

// returns a BN instance.
const tx = await contract.allowance('0x...01', '0x...02')
```

#### approve(spender: string, amount: BNish, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Sets <code>amount</code> as the allowance of <code>spender</code> over the caller’s tokens. </p>
<p>Emits an <code>Approval</code> event.</p>

```ts

import { PrivateKey, HarmonyShards, HRC20 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC20('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.approve('0x...01', 100)
```

#### transferFrom(from: string, to: string, amount: BNish, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Moves <code>amount</code> tokens from <code>from</code> account to <code>to</code>.</p>

```ts

import { PrivateKey, HarmonyShards, HRC20 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC20('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.transferFrom('0x...01', '0x...02', 100)
```

#### symbol(txOptions?: ITransactionOptions): Promise&lt;string&gt;

<p>Returns the token symbol.</p>

```ts

import { PrivateKey, HarmonyShards, HRC20 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC20('0x...00', ABI, wallet)

// returns a string value.
const symbol = await contract.symbol()
```

#### name(txOptions?: ITransactionOptions): Promise&lt;string&gt;

<p>Returns the token name.</p>

```ts

import { PrivateKey, HarmonyShards, HRC20 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC20('0x...00', ABI, wallet)

// returns a string value.
const name = await contract.name()
```

#### decimals(txOptions?: ITransactionOptions): Promise&lt;number&gt;

<p>Returns the decimals places of the token.</p>

```ts

import { PrivateKey, HarmonyShards, HRC20 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC20('0x...00', ABI, wallet)

// returns a number value.
const name = await contract.decimals() // 18
```
#### mint(account: string, amount: BNish, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Mints an <code>amount</code> of tokens and transfers them to the <code>account</code> increasing the total supply.</p>
<p>Emits a <code>Transfer</code> event with from set to the zero address.</p>
<p>Requirements
  <ul>
    <li><code>account</code> cannot be the zero address.</li>
  </ul>
</p>

```ts

import { PrivateKey, HarmonyShards, HRC20 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC20('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.mint('0x...01', 10)
```

#### burn(amount: number, txOptions?: ITransactionOptions)

<p>Destroys an <code>amount</code> of tokens from the caller wallet, reducing the total supply.</p>
<p>Emits a <code>Transfer</code> event with to set to the zero address.</p>
<p>Requirements
  <ul>
    <li>account cannot be the zero address.</li>
    <li>account must have at least <code>amount</code> tokens.</li>
  </ul>
</p>

```ts

import { PrivateKey, HarmonyShards, HRC20 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC20('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.burn(10)
```

#### burnFrom(account: string, amount: number, txOptions?: ITransactionOptions)

<p>Destroys <code>amount</code> tokens from <code>account</code>, deducting from the caller’s allowance.</p>
<p>Requirements
  <ul>
    <li>the caller must have allowance for <code>accounts</code>'s tokens of at least <code>amount</code>.</li>    
  </ul>
</p>

```ts

import { PrivateKey, HarmonyShards, HRC20 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC20('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.burnFrom('0x...01', 10)
```

## HRC721 API

The `HRC721` implements the abstract class [Base Token](#base-token).

**NOTE**: The harmony [explorer](https://explorer.harmony.one/hrc721) will look for a specific list of functions and events to identify HRC721 tokens. You can validate if the bytecode of your HRC71 is valid [here](https://explorer.harmony.one/tools/checkHrc).

Expected Methods:
| Method | Description |
| ------------- | ------------- |
| balanceOf | The number of tokens in owner's account. |
| ownerOf | The owner of a token. |
| safeTransferFrom | Safely transfers a token from an address to another. |
| transferFrom | Transfers a token from an address to another address. |
| approve | Gives permission to an account to transfer a token to another account. |
| getApproved | Returns the account approved for a token. |
| setApprovalForAll | Approve or remove operator as an operator for the caller. |
| isApprovedForAll | Returns if the operator is allowed to manage all of the assets of an account. |
| totalSupply | Total amount of tokens stored by the contract. |
| tokenURI | The Uniform Resource Identifier (URI) for a token. |
| symbol | The token collection symbol. |
| name | The token collection name. |
| mint | Mints a token with the given id and transfers it to an address. |
| safeMint | Safely mints a token and transfers it to an address. |
| burn | Destroys a token |

Expected Events
| Event | Description |
| ------------- | ------------- |
| Transfer | Emitted when a token id is transferred from an address to another. |
| Approval | Emitted when an account enables another account to manage a token. |

You can find an example of [HRC721](./src/tests/contracts/BlockcodersHRC721.sol) in this address [0x...0a0a](https://explorer.pops.one/address/0xbba5d03304318b8fe765d977081eb392eb170a0a?activeTab=0).

### Initializing

```typescript

import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
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

#### balanceOf(address: string, txOptions?: ITransactionOptions): Promise&lt;BN&gt;

<p>Returns the number of tokens in <code>address</code>'s account.</p>

```ts

import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a BN instance.
const balance = await contract.balanceOf('0x...01')
```

#### ownerOf(tokenId: BNish, txOptions?: ITransactionOptions): Promise&lt;string&gt;

<p>Returns the owner of the <code>tokenId</code> token.</p>
<p>Requirements
  <ul>
    <li><code>tokenId</code> must exist.</li>    
  </ul>
</p>

```ts

import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns an address.
const owner = await contract.ownerOf('1')
```

#### safeTransferFrom(from: string, to: string, tokenId: BNish, data?: any, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Safely transfers <code>tokenId</code> token from <code>from</code> to <code>to</code>.</p>
<p>Requirements
  <ul>
    <li><code>from</code> cannot be the zero address.</li>
    <li><code>to</code> cannot be the zero address.</li>
    <li><code>tokenId</code> token must exist and be owned by <code>from</code>.</li>
    <li>If the caller is not <code>from</code>, it must be approved to move this token by either <code>approve</code> or <code>setApprovalForAll</code>.</li>
    <li>If <code>to</code> refers to a smart contract, it must implement <code>IERC721Receiver.onERC721Received</code>, which is called upon a safe transfer.</li>
  </ul>
</p>
<p>Emits a <code>Transfer</code> event.</p>

```ts

import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.safeTransferFrom('0x...01', '0x...02', '1')
```

#### transferFrom(from: string, to: string, tokenId: BNish, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Transfers <code>tokenId</code> token from <code>from</code> to <code>to</code>. Usage of this method is discouraged, use <code>safeTransferFrom</code> whenever possible.</p>
<p>Requirements
  <ul>
    <li><code>from</code> cannot be the zero address.</li>
    <li><code>to</code> cannot be the zero address.</li>
    <li><code>tokenId</code> token must exist and be owned by <code>from</code>.</li>
    <li>If the caller is not <code>from</code>, it must be approved to move this token by either <code>approve</code> or <code>setApprovalForAll</code>.</li>
  </ul>
</p>
<p>Emits a <code>Transfer</code> event.</p>

```ts

import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.transferFrom('0x...01', '0x...02', '1')
```

#### approve(to: string, tokenId: BNish, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Gives permission to <code>to</code> to transfer <code>tokenId</code> token to another account. The approval is cleared when the token is transferred.</p>
<p>Only a single account can be approved at a time, so approving the zero address clears previous approvals.</p>

<p>Requirements
  <ul>
    <li>The caller must own the token or be an approved operator.</li>
    <li><code>tokenId</code> must exist.</li>
  </ul>
</p>
<p>Emits a <code>Approval</code> event.</p>
  
```ts

import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.approve('0x...01', '1')
```

#### getApproved(tokenId: BNish, txOptions?: ITransactionOptions): Promise&lt;string&gt;

<p>Returns the account approved for <code>tokenId</code> token.<p>
<p>Requirements
  <ul>
    <li><code>tokenId</code> must exist.</li>
  </ul>
</p>
  
```ts

import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns an address.
const address = await contract.getApproved('1')
```

#### setApprovalForAll(addressOperator: string, approved: boolean, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Approve or remove <code>addressOperator</code> as an operator for the caller. Operators can call <code>transferFrom</code> or <code>safeTransferFrom</code> for any token owned by the caller.<p>
<p>Requirements
  <ul>
    <li>The <code>addressOperator</code> cannot be the caller.</li>
  </ul>
</p>
<p>Emits an <code>ApprovalForAll</code> event.</p>
  
```ts
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.setApprovalForAll('0x...01', true)
```

#### isApprovedForAll(owner: string, operator: string, txOptions?: ITransactionOptions): Promise&lt;boolean&gt;

<p>Returns if the <code>operator</code> is allowed to manage all of the assets of <code>owner</code>.</p>
<p>See <code>setApprovalForAll</code></p>
  
```ts
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a boolean
const isApproved = await contract.isApprovedForAll('0x...01', '0x...02')
```
  
####  totalSupply(txOptions?: ITransactionOptions): Promise&lt;BN&gt;

<p>Returns the total amount of tokens stored by the contract.</p>

```ts

import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a number value.
const supply = await contract.totalSupply()
```

#### tokenURI(tokenId: BNish, txOptions?: ITransactionOptions): Promise&lt;string&gt;

<p>Returns the Uniform Resource Identifier (URI) for <code>tokenId</code> token.</p>

```ts

import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a string value.
const uri = await contract.tokenURI('10')


#### symbol(txOptions?: ITransactionOptions): Promise&lt;string&gt;

<p>Returns the token collection symbol.</p>

```ts

import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a string value.
const symbol = await contract.symbol() 
```

#### name(txOptions?: ITransactionOptions): Promise&lt;string&gt;

<p>Returns the token collection name.</p>

```ts

import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a string value.
const name = await contract.name()
```

#### mint(account: string, tokenId: BNish, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Mints a token with <code>tokenId</code> and transfers it to the <code>account</code>.</p>
<p>Usage of this method is discouraged, use <code>safeMint</code> whenever possible</p>
<p>Requirements
  <ul>
    <li><code>tokenId</code> must not exist.</li>
    <li><code>account</code> cannot be the zero address.</li>
  </ul>
</p>
<p>Emits an <code>Transfer</code> event.</p>
  
```ts
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.mint('0x...01', '1')
```

#### safeMint(to: string, tokenId: BNish, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Safely mints a token with <code>tokenId</code> and transfers it to <code>to</code>.</p>
<p>Requirements
  <ul>
    <li><code>tokenId</code> must not exist.</li>
    <li>If <code>to</code> refers to a smart contract, it must implement <code>IERC721Receiver.onERC721Received</code>, which is called upon a safe transfer.</li>
  </ul>
</p>
<p>Emits an <code>Transfer</code> event.</p>

```ts
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.mint('0x...01', '1')
```

#### burn(tokenId: BNish, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Destroys <code>tokenId</code>. The caller must own <code>tokenId</code> or be an approved operator.</p>
<p>Requirements
  <ul>
    <li><code>tokenId</code> must exist.</li>    
  </ul>
</p>
<p>Emits an <code>Transfer</code> event.</p>
  
```ts
import { PrivateKey, HarmonyShards, HRC721 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC721('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.burn('1')
```

## HRC1155 API

The `HRC1155` implements the abstract class [Base Token](#base-token).

**NOTE**: The harmony [explorer](https://explorer.harmony.one/hrc1155) will look for a specific list of functions and events to identify HRC1155 tokens. You can validate if the bytecode of your HRC1155 is valid [here](https://explorer.harmony.one/tools/checkHrc).

Expected Methods:
| Method | Description |
| ------------- | ------------- |
| balanceOf | Returns the amount of tokens of a token type (id) owned by an account. |
| balanceOfBatch | Batched version of balanceOf. |
| safeTransferFrom | Transfers the amount of tokens of a token type (id) from an address to another address. |
| safeBatchTransferFrom | Batched version of safeTransferFrom. |
| setApprovalForAll | Grants or revokes permission to an operator to transfer the caller’s tokens. |
| isApprovedForAll | Returns true if an operator is approved to transfer the tokens of an account. |
| owner | Returns the address of the current contract owner. |
| tokenURIPrefix | Returns the token URI prefix |
| contractURI | Returns a URL for the storefront-level metadata for your contract. |
| tokenURI | Returns the Uniform Resource Identifier (URI) for a token. |
| totalSupply | Total amount of tokens with a given token id |
| symbol | Returns the token collection symbol. |
| name | Returns the token collection name. |
| mint | Creates the amount of tokens of a token type (id), and assigns them to an account. |
| mintBatch | Batched version of mint |

Expected Events
| Event | Description |
| ------------- | ------------- |
| TransferSingle | Emitted when a token id are transferred from an address to another by operator. |
| TransferBatch | Emitted when a token ids are transferred from an address to another by operator. |

You can find an example of [HRC1155](./src/tests/contracts/BlockcodersHRC1155.sol) in this address [0x...b264](https://explorer.pops.one/address/0x16703afb468e4ba88380c2a2fda1aa4c5ec7b264).

### Initializing

```typescript
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
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

#### balanceOf(address: string, id: BNish, txOptions?: ITransactionOptions): Promise&lt;BN&gt;

<p>Returns the amount of tokens of token type (id) <code>id</code> owned by <code>address</code>.</p>

```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns a BN instance.
const balance = await contract.balanceOf('0x...01', '1')
```

#### balanceOfBatch(accounts: string[], ids: BNish[], txOptions?: ITransactionOptions): Promise&lt;BN[]&gt;

<p>Batched version of <code>balanceOf</code>.</p>

```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns an array of BN instance.
const balances = await contract.balanceOfBatch(['0x...01', '0x...02'], ['1', '2'])
```

#### safeTransferFrom(from: string, to: string, id: BNish, amount: BNish, data: any, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Transfers <code>amount</code> tokens of token type (id) <code>id</code> from <code>from</code> to <code>to</code>.</p>

```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.safeTransferFrom('0x...01', '0x...02', '1', '1', [])
```

#### safeBatchTransferFrom(from: string, to: string, ids: BNish[], amounts: BNish[], data: any, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Batched version of <code>safeTransferFrom</code>.</p>

```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.safeBatchTransferFrom('0x...01', '0x...02', ['1', '2'], ['1', '1'], [])
```

#### setApprovalForAll(addressOperator: string, approved: boolean, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Grants or revokes permission to <code>operator</code> to transfer the caller’s tokens, according to <code>approved</code>.</p>
<p>Emits an <code>ApprovalForAll</code> event.</p>
<p>Requirements
  <ul>
    <li><code>operator</code> cannot be the caller.</li>
  </ul>
</p>

```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.setApprovalForAll('0x...01', true)
```

#### isApprovedForAll(owner: string, operator: string, txOptions?: ITransactionOptions): Promise&lt;boolean&gt;

<p>Returns true if <code>operator</code> is approved to transfer <code>account</code>'s tokens.</p>

```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns an boolean value.
const isApproved = await contract.isApprovedForAll('0x...01', '0x...02')
```

#### owner(txOptions?: ITransactionOptions): Promise&lt;string&gt;

<p>Returns the address of the current owner.</p>

```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns an address.
const owner = await contract.owner()
```

#### tokenURIPrefix(txOptions?: ITransactionOptions): Promise&lt;string&gt;

<p>Returns the token URI prefix.</p>

```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns an string value.
const uri = await contract.tokenURIPrefix()
```

#### contractURI(txOptions?: ITransactionOptions): Promise&lt;string&gt;

<p>returns a URL for the storefront-level metadata for your contract.</p>

```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns an string value.
const uri = await contract.contractURI()
```


#### totalSupply(id: BNish, txOptions?: ITransactionOptions): Promise&lt;BN&gt;

<p>Total amount of tokens with a given token <code>id</code>.</p>

```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns a number value.
const total = await contract.totalSupply('1')
```

#### tokenURI(tokenId: BNish, txOptions?: ITransactionOptions): Promise&lt;string&gt;

<p>Returns the Uniform Resource Identifier (URI) for <code>tokenId</code> token.</p>

```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns a string value.
const uri = await contract.tokenURI('1')
```


#### symbol(txOptions?: ITransactionOptions): Promise&lt;string&gt;

<p>Returns the token collection symbol.</p>

```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns a string value.
const symbol = await contract.symbol()
```

#### name(txOptions?: ITransactionOptions): Promise&lt;string&gt;

<p>Returns the token collection name.</p>

```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns a string value.
const name = await contract.name()
```

#### mint(account: string, tokenId: BNish, amount: BNish, txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Creates <code>amount</code> tokens of token type (id) <code>tokenId</code>, and assigns them to <code>to</code>.</p>
<p>Emits a <code>TransferSingle</code> event.</p>
<p>Requirements
  <ul>
    <li><code>to</code> cannot be the zero address.</li>
    <li>If <code>to</code> refers to a smart contract, it must implement <code>IERC1155Receiver.onERC1155Received</code> and return the acceptance magic value.</li>
  </ul>
</p>
  
```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.mint('0x...01', '1', '10')
```

#### mintBatch(account: string, tokenIds: BNish[], amounts: BNish[], txOptions?: ITransactionOptions): Promise&lt;Transaction&gt;

<p>Batched version of <code>mint</code>.<p>
<p>Emits a <code>TransferBatch</code> event.</p>
<p>Requirements
  <ul>
    <li><code>tokenIds</code> and <code>amounts</code> must have the same length.</li>
    <li>If <code>to</code> refers to a smart contract, it must implement <code>IERC1155Receiver.onERC1155Received</code> and return the acceptance magic value.</li>
  </ul>
</p>
  
```ts
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const wallet = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)

// A contract instance
const contract = new HRC1155('0x...00', ABI, wallet)

// returns a Harmony Transaction instance.
const tx = await contract.mintBatch('0x...01', ['1', '2', '3'], ['10', '5', '20'])
```

## BridgeToken API

Harmony -> Ethereum way bridge 

### Initializing

```typescript
import { PrivateKey, HarmonyShards, HRC1155 } from 'harmony-marketplace-sdk'
import * as ABI from './abi.json'

const ethOwner = new Wallet(
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e',
  new EtherscanProvider(
    { chainId: 1 },
    API_KEY,
  )
) 
const hmyOwner = new PrivateKey(
  HarmonyShards.SHARD_0,
  '45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
)
const bridge = new BridgeHRC20Token(hmyOwner, ethOwner)
const token = new HRC20('0x...00', ABI, hmyOwner)
const sender =  hmyOwner.accounts[0].toLowerCase()
const recipient =  ethOwner.address.toLowerCase()
const tokenInfo = { amount: 1000000000 }

// Send tokens from Harmony to Ethereum
const { addr, receiptId } = await bridge.sendToken(
  BridgeType.HMY_TO_ETH,
  sender,
  recipient,
  token,
  tokenInfo,
)

// Send tokens from Ethereum to Harmony
const { addr, receiptId } = await bridge.sendToken(
  BridgeType.ETH_TO_HMY,
  sender,
  recipient,
  token,
  tokenInfo,
)
```

## Change Log

See [Changelog](CHANGELOG.md) for more information.

## Contributing

Contributions welcome! See [Contributing](CONTRIBUTING.md).

## Collaborators

- [**Jose Ramirez**](https://github.com/0xslipk)
- [**Brian Zuker**](https://github.com/bzuker)
- [**Ana Riera**](https://github.com/AnnRiera)
- [**Fernando Sirni**](https://github.com/fersirni)

## Acknowledgements

This project was kindly sponsored by [Harmony](https://www.harmony.one/).

## License

Licensed under the MIT - see the [LICENSE](LICENSE) file for details.
