import 'dotenv/config'
import { Transaction, TxStatus } from '@harmony-js/transaction'
import { hexToNumber } from '@harmony-js/utils'
import BN from 'bn.js'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { BridgedHRC721Token, HRC721EthManager, HRC721HmyManager, HRC721TokenManager } from '../../bridge'
import { HRC721 } from '../../contracts'
import { BNish } from '../../interfaces'
import {
  WALLET_HMY_MASTER,
  WALLET_ETH_MASTER,
  WALLET_ETH_OWNER,
  WALLET_HMY_OWNER,
  ETH_MASTER_ADDRESS,
  HMY_MASTER_ADDRESS,
  HMY_OWNER_ADDRESS,
  ETH_OWNER_ADDRESS,
  ContractName,
  E2E_TX_OPTIONS,
} from '../constants'
import { deployContract, deployEthContract, waitForNewBlock } from '../helpers'

use(chaiAsPromised)

class HRC721Mintable extends HRC721 {
  public mint(account: string, tokenId: BNish): Promise<Transaction> {
    return this.send('mint', [account, tokenId], E2E_TX_OPTIONS)
  }
}

describe('Bridge HRC721 Token', () => {
  const name = 'Blockcoders NFT'
  const symbol = 'Blockcoders'
  const tokenId = '1'
  const sender = HMY_OWNER_ADDRESS
  const receiver = HMY_OWNER_ADDRESS
  let lockTokenTxHash: string
  let hrc721: HRC721Mintable
  let ownerHrc721: HRC721
  let erc721Addr: string
  let bridgedToken: BridgedHRC721Token
  let ethManager: HRC721EthManager
  let hmyManager: HRC721HmyManager
  let tokenManager: HRC721TokenManager

  before(async () => {
    // Deploy contracts
    const [hrc721Options, ethManagerOptions] = await Promise.all([
      deployContract(ContractName.BlockcodersHRC721, WALLET_HMY_MASTER, []),
      deployEthContract(ContractName.HRC721EthManager, WALLET_ETH_MASTER, [ETH_MASTER_ADDRESS]),
    ])
    const [hmyManagerOptions, tokenManagerOptions] = await Promise.all([
      deployContract(ContractName.HRC721HmyManager, WALLET_HMY_MASTER, [HMY_MASTER_ADDRESS]),
      deployEthContract(ContractName.HRC721TokenManager, WALLET_ETH_MASTER),
    ])

    // Create contract instances
    hrc721 = new HRC721Mintable(hrc721Options.addr, hrc721Options.abi, WALLET_HMY_MASTER)
    ownerHrc721 = new HRC721(hrc721Options.addr, hrc721Options.abi, WALLET_HMY_OWNER)
    hmyManager = new HRC721HmyManager(hmyManagerOptions.addr, WALLET_HMY_MASTER)
    ethManager = new HRC721EthManager(ethManagerOptions.addr, WALLET_ETH_MASTER)
    tokenManager = new HRC721TokenManager(tokenManagerOptions.addr, WALLET_ETH_MASTER)

    // approve HRC721EthManager on HRC721TokenManager
    const relyTx = await tokenManager.rely(ethManager.address)
    console.info('HRC721TokenManager rely tx hash: ', relyTx.transactionHash)

    // Add token manager
    const addTokenTx = await ethManager.addToken(tokenManager.address, hrc721.address, name, symbol, tokenId)
    console.info('HRC721EthManager addToken tx hash: ', addTokenTx.transactionHash)

    erc721Addr = await ethManager.mappings(hrc721.address)
    bridgedToken = new BridgedHRC721Token(erc721Addr, WALLET_ETH_OWNER)
  })

  it('contracts should be defined', () => {
    expect(hrc721).to.not.be.undefined
    expect(ownerHrc721).to.not.be.undefined
    expect(bridgedToken).to.not.be.undefined
    expect(ethManager).to.not.be.undefined
    expect(hmyManager).to.not.be.undefined
    expect(tokenManager).to.not.be.undefined
  })

  it('hrc721 holder should have zero tokens before mint', async () => {
    const balance = await hrc721.balanceOf(sender, E2E_TX_OPTIONS)

    expect(balance.isZero()).to.be.true
  })

  it(`hrc721 holder should have one token with id ${tokenId} after mint`, async () => {
    const mintTx = await hrc721.mint(sender, tokenId)

    console.info('HRC721Mintable mint tx hash: ', mintTx.id)

    const balance = await hrc721.balanceOf(sender, E2E_TX_OPTIONS)

    expect(mintTx.txStatus).eq(TxStatus.CONFIRMED)
    expect(balance.isZero()).to.not.be.true
    expect(balance.eq(new BN(1))).to.be.true
  })

  it('hrc721 holder should approve Harmony Manager', async () => {
    const approveTx = await ownerHrc721.approve(hmyManager.address, tokenId, E2E_TX_OPTIONS)

    console.info('HRC721 approve tx hash: ', approveTx.id)

    expect(approveTx.txStatus).eq(TxStatus.CONFIRMED)
  })

  it('Harmony Manager should lock the holder tokens', async () => {
    const balanceBeforeLock = await hrc721.balanceOf(sender, E2E_TX_OPTIONS)

    expect(balanceBeforeLock.eq(new BN(1))).to.be.true

    /*
    function lockNFT721Token(
        address ethTokenAddr,
        uint256 tokenId,
        address recipient
    ) public {
        require(
            recipient != address(0),
            "NFTHmyManager/recipient is a zero address"
        );
        IERC721 ethToken = IERC721(ethTokenAddr);
        ethToken.safeTransferFrom(msg.sender, address(this), tokenId);
        emit Locked(address(ethToken), msg.sender, tokenId, recipient);
    }
    
    */
    const lockTokenTx = await hmyManager.lockNFT721Token(
      hrc721.address,
      HMY_OWNER_ADDRESS,// recipient that is only used on the Lock event.
      tokenId,
      E2E_TX_OPTIONS,
    )

    console.log(lockTokenTx)
    lockTokenTxHash = lockTokenTx.receipt?.transactionHash ?? ''

    expect(lockTokenTxHash).to.not.be.undefined
    expect(lockTokenTx.receipt?.blockNumber).to.not.be.undefined
    expect(lockTokenTx.txStatus).eq(TxStatus.CONFIRMED)

    console.info('HRC721HmyManager lockTokenFor tx hash: ', lockTokenTxHash)

    await waitForNewBlock(parseInt(hexToNumber(lockTokenTx.receipt?.blockNumber ?? ''), 10) + 6)

    const balanceAfterLock = await hrc721.balanceOf(sender, E2E_TX_OPTIONS)

    expect(balanceAfterLock.isZero()).to.be.true
  })

  it(`erc721 holder should have one token with id ${tokenId} after mint in eth side`, async () => {
    const balanceBeforeMint = await bridgedToken.balanceOf(receiver)

    expect(balanceBeforeMint.isZero()).to.be.true

    const mintTokenTx = await ethManager.mintToken(erc721Addr, tokenId, ETH_OWNER_ADDRESS, lockTokenTxHash)

    expect(mintTokenTx.transactionHash).to.not.be.undefined

    console.info('HRC721EthManager mintToken tx hash: ', mintTokenTx.transactionHash)

    const balanceAfterLock = await bridgedToken.balanceOf(receiver)

    expect(balanceAfterLock.eq(1)).to.be.true
  })
})
