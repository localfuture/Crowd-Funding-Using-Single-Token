# Simple Payment Channel Smart Contract

This Solidity smart contract implements a simple payment channel, designed to facilitate transactions between a wholesale seller and local shopkeepers. The contract allows shopkeepers to deposit funds into the channel, list payments for Holi-themed items, and close the channel to settle the remaining balance.

## Features

- **Efficient Transactions:** Transactions between the wholesale seller and the shopkeepers are managed within the payment channel, reducing the number of on-chain transactions and minimizing gas fees.
- **Flexible Payments:** Shopkeepers can list multiple payments within the channel, ensuring seamless transactions for purchasing Holi-themed items.
- **Secure Settlement:** The contract ensures that the remaining funds in the channel are securely transferred to the designated recipient (wholesale seller or shopkeeper) upon channel closure.

## Getting Started

### Deploy the Contract

Deploy the `SimplePaymentChannel.sol` contract to an Ethereum-compatible blockchain network using a compatible development environment (e.g., Remix, Truffle).

### Initialize the Contract

During deployment, specify the address of the recipient who will receive the payments (e.g., the wholesale seller's address).

### Interact with the Contract

Once deployed, interact with the contract using a web3-enabled application or framework (e.g., web3.js, ethers.js).
- Shopkeepers can deposit funds into the channel, list payments for Holi-themed items, and check their current balance.
- The wholesale seller or the recipient can close the channel to settle the remaining balance.

## Functions

The Simple Payment Channel smart contract provides the following functions:

- `deposit()`: Allows shopkeepers to deposit funds into the channel.
- `listPayment(uint256 amount)`: Enables shopkeepers to list payments for Holi-themed items within the channel.
- `closeChannel()`: Allows either the wholesale seller or the recipient to close the channel and settle the remaining balance.
- `checkBalance()`: Returns the current balance of the shopkeeper in the channel.
- `getAllPayments()`: Returns an array of all payments listed by the shopkeeper within the channel.

## Example

Here's an example of how to use the Simple Payment Channel smart contract:

1. **Deposit Funds:**
   - Shopkeepers deposit funds into the channel using the `deposit()` function.

2. **List Payments:**
   - Shopkeepers list payments for Holi-themed items using the `listPayment(uint256 amount)` function.

3. **Close Channel:**
   - Once transactions are completed or the channel expires, the wholesale seller or the recipient closes the channel using the `closeChannel()` function.

## License

This project is licensed under the [MIT License](LICENSE).
