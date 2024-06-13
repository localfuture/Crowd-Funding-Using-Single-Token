// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract SimplePaymentChannel {
    address owner;
    address recipient;
    mapping(address => uint) deposits;
    mapping(address => uint[]) payments;

    // @dev The constructor function should initialize the contract
    // by setting the wholesale seller’s address as the owner and the
    // recipient of the contract. The recipientAddress parameter sets
    // the address that will receive the payments.
    constructor(address recipientAddress) {
        owner = msg.sender;
        recipient = recipientAddress;
    }

    // @dev This payable function should allow the local shopkeeper to
    // deposit funds into the Simple Payment Channel. The function
    // should check if the amount sent is greater than 0.
    function deposit() public payable {
        require(msg.value > 0, "Insufficient Amount");

        deposits[msg.sender] += msg.value;
    }

    // @dev This function should allow the local shopkeeper to list a
    // new payment. The user should only be able to list a maximum of their
    // deposited amount. The corresponding amount in wei should be reserved
    // for the listed payment.
    function listPayment(uint256 amount) public {
        require(amount > 0, "Payment amount must be greater than 0");
        require(deposits[msg.sender] >= amount, "Insufficient deposit balance");

        deposits[msg.sender] -= amount;
        payments[msg.sender].push(amount);
    }

    // @dev This function should allow either the local shopkeeper
    // or the wholesale seller to close the Simple Payment Channel.
    // The function should check if the sender or the recipient is
    // calling this function. All remaining funds in the channel
    // should be transferred to the caller.
    function closeChannel() public {
        require(msg.sender == owner || msg.sender == recipient, "Only owner or recipient can close the channel");

        if (deposits[owner] > 0) {
            payable(owner).transfer(deposits[owner]);
        }

        if (address(this).balance > 0) {
            payable(recipient).transfer(address(this).balance);
        }
    }

    // @dev This function should return the current balance in the Simple Payment Channel.
    function checkBalance() public view returns (uint256) {
        return deposits[msg.sender];
    }

    // @dev This function should return an array of all the payments
    // listed in the Simple Payment Channel. Each element in the array
    // represents the amount of a listed payment.
    function getAllPayments() public view returns (uint256[] memory) {
        return payments[msg.sender];
    }
}
