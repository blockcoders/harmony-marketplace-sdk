import 'dotenv/config'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { BridgedHRC20Token, HRC20EthManager, HRC20HmyManager, HRC20TokenManager } from '../../bridge'
import { HRC20 } from '../../contracts'
import {
  WALLET_HMY_MASTER,
  WALLET_ETH_MASTER,
  WALLET_ETH_OWNER,
  ETH_MASTER_ADDRESS,
  HMY_MASTER_ADDRESS,
  HMY_OWNER_ADDRESS,
  ContractName,
  E2E_TX_OPTIONS,
} from '../constants'
import { deployContract, deployEthContract } from '../helpers'

use(chaiAsPromised)

describe('Bridge HRC21 Token', () => {
  const name = 'Blockcoders'
  const symbol = 'BC'
  const decimals = 18
  let hrc20: HRC20
  let erc20Addr: string
  let bridgedToken: BridgedHRC20Token
  let ethManager: HRC20EthManager
  let hmyManager: HRC20HmyManager
  let tokenManager: HRC20TokenManager

  before(async () => {
    // Deploy contracts
    const [hrc20Options, ethManagerOptions] = await Promise.all([
      deployContract(ContractName.BlockcodersHRC20, WALLET_HMY_MASTER, [name, symbol]),
      deployEthContract(ContractName.HRC20EthManager, WALLET_ETH_MASTER, [ETH_MASTER_ADDRESS]),
    ])
    const [hmyManagerOptions, tokenManagerOptions] = await Promise.all([
      deployContract(ContractName.HRC20HmyManager, WALLET_HMY_MASTER, [HMY_MASTER_ADDRESS]),
      deployEthContract(ContractName.HRC20TokenManager, WALLET_ETH_MASTER),
    ])

    // Create contract instances
    hrc20 = new HRC20(hrc20Options.addr, hrc20Options.abi, WALLET_HMY_MASTER)
    hmyManager = new HRC20HmyManager(hmyManagerOptions.addr, WALLET_HMY_MASTER)
    ethManager = new HRC20EthManager(ethManagerOptions.addr, WALLET_ETH_MASTER)
    tokenManager = new HRC20TokenManager(tokenManagerOptions.addr, WALLET_ETH_MASTER)

    // approve HRC20EthManager on HRC20TokenManager
    const relyTx = await tokenManager.rely(ethManager.address)
    console.info('HRC20TokenManager rely tx hash: ', relyTx.transactionHash)

    // Add token manager
    const addTokenTx = await ethManager.addToken(tokenManager.address, hrc20.address, name, symbol, decimals)
    console.info('HRC20EthManager addToken tx hash: ', addTokenTx.transactionHash)

    erc20Addr = await ethManager.mappings(hrc20.address)
    bridgedToken = new BridgedHRC20Token(erc20Addr, WALLET_ETH_OWNER)
  })

  it('contracts should be defined', () => {
    expect(hrc20).to.not.be.undefined
    expect(bridgedToken).to.not.be.undefined
    expect(ethManager).to.not.be.undefined
    expect(hmyManager).to.not.be.undefined
    expect(tokenManager).to.not.be.undefined
  })

  it('hrc20 holder should have zero before mint the token', async () => {
    const balance = await hrc20.balanceOf(HMY_OWNER_ADDRESS, E2E_TX_OPTIONS)

    expect(balance.isZero()).to.be.true
  })
})
