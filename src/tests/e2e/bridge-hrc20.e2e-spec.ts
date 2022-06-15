import 'dotenv/config'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { BridgedHRC20Token, HRC20EthManager, HRC20HmyManager, HRC20TokenManager } from '../../bridge'
import { HRC20 } from '../../contracts'
import { WALLET_HMY_MASTER } from '../constants'
import { deployContract } from '../helpers'

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
    hrc20 = await deployContract<HRC20>('BlockcodersHRC20', WALLET_HMY_MASTER, [name, symbol])
  })

  it('contracts should be defined', () => {
    expect(hrc20).to.not.be.undefined
    expect(bridgedToken).to.not.be.undefined
    expect(ethManager).to.not.be.undefined
    expect(hmyManager).to.not.be.undefined
    expect(tokenManager).to.not.be.undefined
  })
})
