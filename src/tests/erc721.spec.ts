import { expect } from 'chai'
import { TESTNET_BRIDGE_CONTRACTS } from '../constants'
import { abi as ABI } from '../bridge-managers/abis/tokens/erc721'
import { BridgeToken } from '../bridge-managers/bridge-token'
import { BRIDGE, BridgeParams, BRIDGE_TOKENS, ManagerContractAddresses } from '../interfaces'
import { ERC721 } from '../tokens/erc721'
import {
  ERC721_CONTRACT_ADDRESS,
  TEST_ADDRESS_1,
  WALLET_ETH_PROVIDER_TEST_1,
  WALLET_PROVIDER_TEST_1,
} from './constants'
//import { formatUnits, parseUnits } from '@ethersproject/units'
import { /*Contract, ContractFactory,*/ Wallet } from 'ethers'
import { readFileSync } from 'fs'
import { join } from 'path'
import { EtherscanProvider } from '@ethersproject/providers'
import { Contract as HmyContract } from '@harmony-js/contract'
import { ChainID, ChainType, Unit } from '@harmony-js/utils'
import { Harmony } from '@harmony-js/core'

const PK = '0db4bb38f00a5d68d53d97613762409c7d2b8e82935d61050feae26bd8d45e46'
const INFURA_API_KEY = 'WKQFEUEFCD9W31P9X1THXFX2WK63PJHQ8D'
const HMY_NODE_URL='https://api.s0.b.hmny.io'
const ethProvider = new EtherscanProvider(4, INFURA_API_KEY)
const ethSigner = new Wallet(PK, ethProvider)
const ethMasterAddr = ethSigner.address.toLowerCase()
console.log('ethMasterAddr', ethMasterAddr)
const hmy = new Harmony(HMY_NODE_URL, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyTestnet,
})
const hmyOptions = { gasPrice: new Unit('60').asGwei().toWei(), gasLimit: '3500000' }


/*const erc721EthManagerMetadata = JSON.parse(
  readFileSync(`${join(__dirname, '../../build/contracts')}/ERC721EthManager.json`, 'utf8'),
)*/
const tokenManagerMetadata = JSON.parse(
  readFileSync(`${join(__dirname, '../../build/contracts')}/TokenManager.json`, 'utf8'),
)/*
const erc20HmyManagerMetadata = JSON.parse(
  readFileSync(`${join(__dirname, '../../build/contracts')}/ERC721HmyManager.json`, 'utf8'),
)*/

/*const deployEthManager = async (): Promise<Contract> => {
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
}*/

const deployTokenManager = async (): Promise<HmyContract> => {
  console.log("Trying to deploy Token Manager")
  const tokenManagerFactory = hmy.contracts.createContract(tokenManagerMetadata.abi)
  console.log("Token manager factory",tokenManagerFactory)
  tokenManagerFactory.wallet.setSigner(ethMasterAddr)
  const deployOptions = { data: tokenManagerMetadata.bytecode }

  return tokenManagerFactory.methods.contractConstructor(deployOptions).send(hmyOptions)
}
/*
const deployHmyManager = async (): Promise<HmyContract> => {
  console.log("Trying to deploy Hmy Manager")
  const erc20HmyManagerFactory = hmy.contracts.createContract(erc20HmyManagerMetadata.abi)
  erc20HmyManagerFactory.wallet.setSigner(ethMasterAddr)

  const deployOptions = { data: erc20HmyManagerMetadata.bytecode, arguments: [ethMasterAddr] }

  return erc20HmyManagerFactory.methods.contractConstructor(deployOptions).send(hmyOptions)
}*/


const deployContracts = async (): Promise<ManagerContractAddresses>  => {
  /*const ethManager = await deployEthManager()
  const ethManagerAddr = ethManager.address.toLowerCase()
  console.log('Deployed EthManager contract to', ethManagerAddr)
*/
  const tokenManager = await deployTokenManager()
  const tokenManagerAddr = tokenManager.transaction?.receipt?.contractAddress?.toLowerCase() ?? ''
  console.log('TokenManager contract deployed at ', tokenManagerAddr)
/*
  const hmyManager = await deployHmyManager()
  const hmyManagerAddr = hmyManager.transaction?.receipt?.contractAddress?.toLowerCase() ?? ''
  console.log('HmyManager contract deployed at ', hmyManagerAddr)
*/
  let addresses = { ...TESTNET_BRIDGE_CONTRACTS}
  //addresses.erc721EthManagerContract = ethManagerAddr
  //addresses.erc721HmyManagerContract = hmyManagerAddr
  addresses.tokenManagerContract = tokenManagerAddr
  return addresses
}

describe('ERC721 Contract Interface', () => {
  let contract: ERC721

  before(() => {
    contract = new ERC721(ERC721_CONTRACT_ADDRESS, ABI, WALLET_ETH_PROVIDER_TEST_1)
  })

  it('should be defined', () => {
    expect(contract).to.not.be.undefined
  })

  describe('bridgeToken E2E', () => {
    it.only('Sends an ERC721 token from eth to hmy', async () => {

      const paramsEthToHmy: BridgeParams = {
        ethAddress: TEST_ADDRESS_1,
        oneAddress: 'one1rnh8ruyzr7ma8n96e23zrtr7x49u0epe283wff',
        type: BRIDGE.ETH_TO_HMY,
        token: BRIDGE_TOKENS.ERC721,
        amount: 20,
        tokenId: 5,
      }
      console.log(paramsEthToHmy)
      const bridge = new BridgeToken(contract, WALLET_ETH_PROVIDER_TEST_1, WALLET_PROVIDER_TEST_1)
      bridge.managerContracts = await deployContracts()
      //await bridge.bridgeToken(paramsEthToHmy)
    })
  })
})
