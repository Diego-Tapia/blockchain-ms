// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract InterconomyContract is ERC1155PresetMinterPauser, Ownable {
  constructor() ERC1155PresetMinterPauser('') {}

  function createToken(uint256 itemId, uint256 amount) public onlyOwner {
    _mint(msg.sender, itemId, amount, '');
  }
}
