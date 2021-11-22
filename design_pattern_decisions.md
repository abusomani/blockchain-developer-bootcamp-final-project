# Design patterns used

## Access Control Design Patterns

- `Ownable` design pattern is used in three functions: `withdraw()`, `pause()` and `unpause()`. These functions do not need to be used by anyone else apart from the contract creator, i.e. the party that is responsible for uploading an image to Decentralized Pinterest.

## Inheritance and Interfaces

- `Depinterest` contract inherits the OpenZeppelin `Ownable` contract to enable ownership for one managing user/party.
- Using functions and modifiers from `Pausable` and `ReentrancyGuard` exposed by OpenZeppelin's abstract contracts