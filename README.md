# Crowd Funding Using Single Token

The use of blockchains really stands out when it comes to clear-cut crowdfunding. People can easily gather funds for their causes, and donors have the freedom to contribute using ERC-20 token.

A smart contract that facilitates setting up crowdfunding campaigns and allows donations in form of an already deployed ERC-20 contract. 

## Specifications
- Anyone can create a new campaign by specifying the goal amount (in USD), and the duration.
- Any user, except for the creator of the campaign, can donate to any campaign using the token.
- Users can cancel their donations anytime for a particular campaign before the deadline has passed.
- If after the deadline has passed, the goal has not been reached, the campaign is said to be unsuccessful and donors can get their contributions back.