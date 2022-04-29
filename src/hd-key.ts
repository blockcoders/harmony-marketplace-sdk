import { Wallet, HDNode, Account } from '@harmony-js/account'
import { Messenger } from '@harmony-js/network'
import { Transaction, recover } from '@harmony-js/transaction'
import { ChainID, ChainType } from '@harmony-js/utils'
import { RpcProviderType, HDOptions } from './interfaces'
import { Key } from './key'

/**
 * Implementation of the Wallet that uses a list derivate pks.
 */
export class HDKey extends Key {
  private readonly hdNode: HDNode

  constructor(url: RpcProviderType, options: HDOptions, chainId?: ChainID, chainType?: ChainType) {
    super(url, chainId, chainType)

    const {
      mnemonic = Wallet.generateMnemonic(),
      index = 0,
      numberOfAddresses = 1,
      shardId = 0,
      gasLimit = '1000000',
      gasPrice = '2000000000',
    } = options

    this.hdNode = new HDNode(
      this.messenger.provider.url,
      mnemonic,
      index,
      numberOfAddresses,
      shardId,
      ChainType.Harmony,
      chainId,
      gasLimit,
      gasPrice,
    )
  }

  public async signTransaction(transaction: Transaction): Promise<Transaction> {
    const rawTransaction = await this.hdNode.signTransaction(transaction.txParams)
    const params = recover(rawTransaction)
    const tx = new Transaction({}, this.messenger)

    tx.setParams(params)

    return tx
  }

  public setSigner(address: string): void {
    this.hdNode.setSigner(address)
  }

  public addByPrivateKey(privateKey: string): Account {
    this.hdNode.addByPrivateKey(privateKey)

    return Account.add(privateKey)
  }

  public getAccount(address: string): Account | undefined {
    const addresses = this.hdNode.getAccounts()

    if (addresses.includes(address)) {
      return Account.add(this.hdNode.getPrivateKey(address))
    }

    return
  }

  public setMessenger(messenger: Messenger): void {
    super.setMessenger(messenger)

    this.hdNode.setProvider(this.messenger.provider)
  }

  public getAddress(idx?: number): string {
    return this.hdNode.getAddress(idx)
  }

  public getAddresses(): string[] {
    return this.hdNode.getAddresses()
  }
}
