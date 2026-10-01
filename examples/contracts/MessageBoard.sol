// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

/// @notice Teaching contract: only its deployer may update a public message.
contract MessageBoard {
    address public immutable owner;
    string public message;

    error NotOwner();
    event MessageChanged(address indexed author, string newMessage);

    constructor(string memory initialMessage) {
        owner = msg.sender;
        message = initialMessage;
    }

    function setMessage(string calldata newMessage) external {
        if (msg.sender != owner) revert NotOwner();
        message = newMessage;
        emit MessageChanged(msg.sender, newMessage);
    }
}
