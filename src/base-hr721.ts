import { JsonRpcProvider } from '@ethersproject/providers'

/**
 * @see {@link https://docs.openzeppelin.com/contracts/3.x/api/token/erc721#IERC721}
 */
export abstract class BaseHR721 {
  abstract balanceOf(address: string): Promise<string>
  abstract ownerOf(tokenId: string): Promise<string>
  abstract safeTransferFrom(fromAddress: string, toAddress: string, tokenId: string): Promise<any>
  abstract transferFrom(fromAddress: string, toAddress: string, tokenId: string): Promise<any>
  abstract approve(toAddress: string, tokenId: string): Promise<any>
  abstract getApproved(tokenId: string): Promise<string>
  abstract setApprovalForAll(addressOperator: string, approved: boolean): Promise<any>
  abstract isApprovedForAll(addressOwner: string, addressOperator: string): Promise<boolean>
  abstract safeTransferFromWithData(fromAddress: string, toAddress: string, tokenId: string, data: any): Promise<any>
}
