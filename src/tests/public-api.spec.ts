import { expect } from 'chai'
import { BridgeHRC20Token, BridgeHRC721Token, BridgeHRC1155Token } from '../index'

describe('Public API exports', () => {
  it('should expose all bridge token helper classes from the package root', async () => {
    expect(BridgeHRC20Token).to.be.a('function')
    expect(BridgeHRC721Token).to.be.a('function')
    expect(BridgeHRC1155Token).to.be.a('function')
  })
})
