// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @notice Fixed-supply learning token. No public mint, owner, proxy or sale.
contract StudyToken is ERC20 {
    constructor(address recipient) ERC20("Study Token", "STUDY") {
        _mint(recipient, 1_000_000 * 10 ** uint256(decimals()));
    }
}
