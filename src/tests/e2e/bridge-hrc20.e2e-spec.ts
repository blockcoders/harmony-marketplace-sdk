import 'dotenv/config'
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'

use(chaiAsPromised)

describe('Bridge HRC21 Token', () => {
  before(() => {
    console.log('deploy contracts')
  })

  it('should be defined', () => {
    expect(1).to.not.be.undefined
  })
})
