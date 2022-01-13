
/**
 * @see {@link https://docs.openzeppelin.com/contracts/3.x/api/token/erc721#IERC721}
 */
export abstract class  BaseHR721 {
    async balanceOf(address: string) {}
    async ownerOf(tokenId: string) {}
    async safeTransferFrom(fromAddress: string, toAddress: string, tokenId: string) {}
    async transferFrom(fromAddress: string, toAddress: string, tokenId: string) {}
    async approve(toAddress: string, tokenId: string){}
    async getApproved(tokenId: string){}
    async setApprovalForAll(addressOperator: string, approved: boolean) {}
    async isApprovedForAll(addressOwner: string, addressOperator: string) {}
    async safeTransferFromWithData(fromAddress: string, toAddress: string, tokenId: string, data: any) {}
}