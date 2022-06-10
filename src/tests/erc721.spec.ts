import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { TESTNET_BRIDGE_CONTRACTS } from '../constants'
//import { abi as ABI } from '../bridge-managers/abis/tokens/erc721'
import { BridgeToken } from '../bridge-managers/bridge-token'
import { BRIDGE, BridgeParams, BRIDGE_TOKENS, ManagerContractAddresses } from '../interfaces'
import { ERC721 } from '../tokens/erc721'
import {
  TEST_ADDRESS_1,
  WALLET_ETH_PROVIDER_TEST_1,
  WALLET_PROVIDER_TEST_1,
} from './constants'
import { Contract, ContractFactory } from '@ethersproject/contracts'
import { formatUnits, parseUnits } from '@ethersproject/units'
import { Wallet } from '@ethersproject/wallet'
import { readFileSync } from 'fs'
import { join } from 'path'
import { EtherscanProvider } from '@ethersproject/providers'
import { Contract as HmyContract } from '@harmony-js/contract'
import { ChainID, ChainType, Unit } from '@harmony-js/utils'
import { Harmony } from '@harmony-js/core'
import { BigNumber } from '@ethersproject/bignumber'

use(chaiAsPromised)
// Move this to env vars
const PK = '0db4bb38f00a5d68d53d97613762409c7d2b8e82935d61050feae26bd8d45e46'
const INFURA_API_KEY = 'WKQFEUEFCD9W31P9X1THXFX2WK63PJHQ8D'
const HMY_NODE_URL='https://api.s0.b.hmny.io'

const ethProvider = new EtherscanProvider(4, INFURA_API_KEY)
const ethSigner = new Wallet(PK, ethProvider)
const ethMasterAddr = ethSigner.address.toLowerCase()
const hmyOptions = { gasPrice: new Unit('60').asGwei().toWei(), gasLimit: '3500000' }
const hmy = new Harmony(HMY_NODE_URL, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
})
hmy.wallet.addByPrivateKey(PK)

let ethManagerAddr: string
let tokenManagerAddr: string
let hmyManagerAddr: string
let testManagerContracts: ManagerContractAddresses
const name = 'Blockcoders'
const symbol = 'BC'
const baseURI = 'https:fakeURI.com'
const tokenId = "5"

const erc721EthManagerMetadata = JSON.parse(
  readFileSync(`${join(__dirname, '../../build/contracts')}/ERC721EthManager.json`, 'utf8'),
)
const tokenManagerMetadata = JSON.parse(
  readFileSync(`${join(__dirname, '../../build/contracts')}/TokenManager.json`, 'utf8'),
)
const erc721HmyManagerMetadata = JSON.parse(
  readFileSync(`${join(__dirname, '../../build/contracts')}/ERC721HmyManager.json`, 'utf8'),
)
const erc721Metadata = JSON.parse(
  readFileSync(`${join(__dirname, '../../build/contracts')}/ERC721.json`, 'utf8'),
)

const deployERC721 = async (): Promise<Contract> => {
  console.log("Trying to deploy ERC721")
  const erc721Factory = new ContractFactory(erc721Metadata.abi, erc721Metadata.bytecode, ethSigner)
  const fees = await ethSigner.provider.getFeeData()
  const options = {
    maxFeePerGas: parseUnits(formatUnits(fees.maxFeePerGas ?? 0, 'gwei'), 'gwei'),
    maxPriorityFeePerGas: parseUnits(formatUnits(fees.maxPriorityFeePerGas ?? 0, 'gwei'), 'gwei'),
  }
  const contract = await erc721Factory.deploy(name, symbol, baseURI, options)

  return contract.deployed()
}

const deployEthManager = async (): Promise<Contract> => {
  console.log("Trying to deploy Eth Manager")
  const erc721EthManagerFactory = new ContractFactory(
    erc721EthManagerMetadata.abi,
    erc721EthManagerMetadata.bytecode,
    ethSigner,
  )
  const fees = await ethSigner.provider.getFeeData()
  const options = {
    maxFeePerGas: parseUnits(formatUnits(fees.maxFeePerGas ?? 0, 'gwei'), 'gwei'),
    maxPriorityFeePerGas: parseUnits(formatUnits(fees.maxPriorityFeePerGas ?? 0, 'gwei'), 'gwei'),
  }
  const contract = await erc721EthManagerFactory.deploy(ethMasterAddr, options)
  return contract.deployed()
}

const deployTokenManager = async (): Promise<HmyContract> => {
  console.log("Trying to deploy Token Manager")
  const tokenManagerFactory = hmy.contracts.createContract(tokenManagerMetadata.abi)
  tokenManagerFactory.wallet.setSigner(ethMasterAddr)
  const deployOptions = { data: tokenManagerMetadata.bytecode }
  return tokenManagerFactory.methods.contractConstructor(deployOptions).send(hmyOptions)
}

const deployHmyManager = async (): Promise<HmyContract> => {
  console.log("Trying to deploy Hmy Manager")
  const erc20HmyManagerFactory = hmy.contracts.createContract(erc721HmyManagerMetadata.abi)
  erc20HmyManagerFactory.wallet.setSigner(ethMasterAddr)
  const deployOptions = { data: erc721HmyManagerMetadata.bytecode, arguments: [ethMasterAddr] }
  return erc20HmyManagerFactory.methods.contractConstructor(deployOptions).send(hmyOptions)
}

const approveHmyMangerTokenManager = async (tokenManagerAddr: string, hmyManagerAddr: string): Promise<void> => {
  const tokenManager = hmy.contracts.createContract(tokenManagerMetadata.abi, tokenManagerAddr)
  tokenManager.wallet.setSigner(ethMasterAddr)
  await tokenManager.methods.rely(hmyManagerAddr).send(hmyOptions)
}

const deployContracts = async (): Promise<ManagerContractAddresses>  => {
  const ethManager = await deployEthManager()
  ethManagerAddr = ethManager.address.toLowerCase()
  console.log('Deployed EthManager contract to', ethManagerAddr)

  const tokenManager = await deployTokenManager()
  tokenManagerAddr = tokenManager.transaction?.receipt?.contractAddress?.toLowerCase() ?? ''
  console.log('TokenManager contract deployed at ', tokenManagerAddr)

  const hmyManager = await deployHmyManager()
  hmyManagerAddr = hmyManager.transaction?.receipt?.contractAddress?.toLowerCase() ?? ''
  console.log('HmyManager contract deployed at ', hmyManagerAddr)

  let addresses = { ...TESTNET_BRIDGE_CONTRACTS}
  addresses.erc721EthManagerContract = ethManagerAddr
  addresses.erc721HmyManagerContract = hmyManagerAddr
  addresses.tokenManagerContract = tokenManagerAddr
  return addresses
}

const getGasLimit = async (contract: Contract, methodName: string, args: any[]): Promise<BigNumber> => {
  let gasEstimate: BigNumber

  try {
    gasEstimate = await contract.estimateGas[methodName](...args)
  } catch (gasError) {
    try {
      const errorResult = await contract.callStatic[methodName](...args)

      console.debug('Unexpected successful call after failed estimate gas', gasError, errorResult)
    } catch (callStaticError) {
      console.error(callStaticError)
    }

    throw new Error('Unexpected issue with estimating the gas. Please try again.')
  }

  return gasEstimate.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}

const mintERC721 = async (erc721Addr: string, owner: string, tokenId: string): Promise<void> => {
  const erc721 = new Contract(erc721Addr, erc721Metadata.abi, ethSigner)
  const gasLimit = await getGasLimit(erc721, 'mint', [owner, tokenId])
  const fees = await ethSigner.provider.getFeeData()
  const options = {
    gasLimit,
    maxFeePerGas: parseUnits(formatUnits(fees.maxFeePerGas ?? 0, 'gwei'), 'gwei'),
    maxPriorityFeePerGas: parseUnits(formatUnits(fees.maxPriorityFeePerGas ?? 0, 'gwei'), 'gwei'),
  }

  const tx = await erc721.mint(owner, tokenId, options)
  const receipt = await tx.wait()

  console.info('Transaction mint receipt: ', receipt.transactionHash)
}


describe('ERC721 Contract Interface', () => {
  let contract: ERC721

  before(async () => {
    const erc721 = await deployERC721()
    const erc721Address = erc721.address.toLowerCase()
    console.log("ERC721 deployed at: ", erc721Address)
    testManagerContracts = await deployContracts()
    await approveHmyMangerTokenManager(tokenManagerAddr, hmyManagerAddr)
    console.log('HmyManager contract approved on TokenManager')
    await mintERC721(erc721Address, TEST_ADDRESS_1, tokenId)
    const initialBalance = await erc721.balanceOf(TEST_ADDRESS_1)
    console.log(`Initial balance for address ${TEST_ADDRESS_1}: ${initialBalance}`)
    contract = new ERC721(erc721Address, erc721Metadata.abi, WALLET_ETH_PROVIDER_TEST_1)
  })

  it('should be defined', () => {
    expect(contract).to.not.be.undefined
  })

  describe('bridgeToken E2E', () => {
    it.only('Sends an ERC721 token from eth to hmy', async () => {

      const params: BridgeParams = {
        ethAddress: TEST_ADDRESS_1, // Sender
        oneAddress: 'one1rnh8ruyzr7ma8n96e23zrtr7x49u0epe283wff', // Receiver
        type: BRIDGE.ETH_TO_HMY,
        token: BRIDGE_TOKENS.ERC721,
        tokenId: 5,
      }
      const bridge = new BridgeToken(contract, WALLET_ETH_PROVIDER_TEST_1, WALLET_PROVIDER_TEST_1)
      bridge.managerContracts = testManagerContracts
      await bridge.bridgeToken(params)
    })
  })
})
