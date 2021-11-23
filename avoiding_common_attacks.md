# Contract security measures

## SWC-103 (Floating pragma)

Specific compiler pragma `0.8.0` used in contracts to avoid accidental bug inclusion through outdated compiler versions.


## SWC-104 (Unchecked Call Return Value)

The return value from a call to the owner's address in `tipImageOwner` is checked with `require` to ensure transaction rollback, if the call fails.

## SWC-105 (Unprotected Ether Withdrawal)

`withdraw` is protected with OpenZeppelin `Ownable`'s `onlyOwner` modifier.

## SWC-107 (Re-entrancy)

Defending against re-entrancy by using `nonReentrant` modified on the functions that transfer and withdraw funds.

## SWC-115 (Authorized through tx.origin)

Used `msg.sender` field throughout the contract and using `msg.sender` to keep track of the sender of the transfer in the contract's state variable.

## Modifiers used only for validation

All modifiers in contract(s) only validate data with `require` statements.

## Pull over push

All functions that modify state are based on receiving calls rather than making contract calls.