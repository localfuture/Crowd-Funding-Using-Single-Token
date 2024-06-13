// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    uint256 private immutable priceInUSD;

    constructor(string memory _name, string memory _symbol, uint256 _priceInUSD)
        ERC20(_name, _symbol)
        Ownable(msg.sender)
    {
        priceInUSD = _priceInUSD;
    }

    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }

    function getTokenPriceInUSD() external view returns (uint256) {
        return priceInUSD;
    }
}