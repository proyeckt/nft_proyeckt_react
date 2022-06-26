// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyNFT is ERC721URIStorage,Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721('MyNFT','AFT'){
    }

    function createNFT(address recipient,string memory tokenURI) public onlyOwner returns(uint256){
        _tokenIds.increment(); //Starts from zero, then increments by 1 at init
        uint256 newId = _tokenIds.current();
        _mint(recipient,newId);
        _setTokenURI(newId,tokenURI);
        return newId;
    }

}
