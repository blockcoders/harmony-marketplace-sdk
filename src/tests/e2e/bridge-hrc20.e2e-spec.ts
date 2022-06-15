import 'dotenv/config'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { BridgedHRC20Token, HRC20EthManager, HRC20HmyManager, HRC20TokenManager } from '../../bridge'
import { HRC20 } from '../../contracts'
import { WALLET_HMY_MASTER, WALLET_ETH_MASTER, ETH_MASTER_ADDRESS, E2E_TX_OPTIONS } from '../constants'
import { ContractName, deployContract, deployEthContract } from '../helpers'

use(chaiAsPromised)

describe('Bridge HRC21 Token', () => {
  const name = 'Blockcoders'
  const symbol = 'BC'
  let hrc20: HRC20
  let bridgedToken: BridgedHRC20Token
  let ethManager: HRC20EthManager
  let hmyManager: HRC20HmyManager
  let tokenManager: HRC20TokenManager

  before(async () => {
    const hrc20Options = await deployContract(ContractName.BlockcodersHRC20, WALLET_HMY_MASTER, [name, symbol])
    hrc20 = new HRC20(hrc20Options.addr, hrc20Options.abi, WALLET_HMY_MASTER)

    console.log(await hrc20.name(E2E_TX_OPTIONS))
    // hmyManager = await deployContract<HRC20HmyManager>(ContractName.HRC20HmyManager, WALLET_HMY_MASTER, [
    //   HMY_MASTER_ADDRESS,
    // ])
    ethManager = await deployEthContract<HRC20EthManager>(ContractName.HRC20EthManager, WALLET_ETH_MASTER, [
      ETH_MASTER_ADDRESS,
    ])
    tokenManager = await deployEthContract<HRC20TokenManager>(ContractName.HRC20TokenManager, WALLET_ETH_MASTER)
  })

  it('contracts should be defined', () => {
    expect(hrc20).to.not.be.undefined
    expect(bridgedToken).to.not.be.undefined
    expect(ethManager).to.not.be.undefined
    expect(hmyManager).to.not.be.undefined
    expect(tokenManager).to.not.be.undefined
  })
})
