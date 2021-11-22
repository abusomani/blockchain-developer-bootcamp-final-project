## `Depinterest`

Allows an user to tip an image



### `isValidId(uint256 _id)`

Checks if the id is valid or not



### `isValidDescription(string _imgDescription)`

Checks if the image description is non-empty



### `isValidUrl(string _imgUrl)`

Checks if the image url is non-empty




### `uploadImage(string _imgUrl, string _imgDescription)` (public)

Uploads an image to IPFS




### `tipImageOwner(uint256 _id)` (public)

Tips the image owner




### `withdraw()` (public)

Withdraw contract's balance to the owner's address


The function will revert if the send wasn't successful

### `pause()` (public)

pause the contract -- the contract will start functioning in read-only mode.


Implementing the circuit breaker pattern

### `unpause()` (public)

resume the contract for both reads and writes


Implementing the circuit breaker pattern


### `ImageCreated(uint256 id, string url, string description, address author)`

Emitted when an image is created




### `ImageTipped(uint256 id, string url, string description, uint256 tip, address author)`

Emitted when a new image is tipped





### `Image`


uint256 id


string url


string description


uint256 totalTip


address payable author



