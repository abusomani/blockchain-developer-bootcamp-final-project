// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title Contract for decentralized image sharing
/// @author Abhishek Somani
/// @notice Allows an user to tip an image
contract Depinterest is Ownable, Pausable, ReentrancyGuard {
    /// @dev Tracks given image ids. Current value is the newest image id.
    uint256 private imageIdCounter = 0;


    /// @notice Image structu that captures all the necessary information about an image.
    struct Image {
        uint256 id;
        string url;
        string description;
        uint256 totalTip;
        address payable author;
    }

    /// @notice Checks if the id is valid or not
    modifier isValidId(uint _id) {
        // Make sure the id is valid
        require(_id > 0 && _id <= imageIdCounter, "Image id is invalid.");
        _;
    }

    /// @notice Checks if the image description is non-empty
    modifier isValidDescription(string memory _imgDescription) {
        // Make sure the image description exists
        require(bytes(_imgDescription).length > 0, "Image should have some description.");
        _;
    }

    /// @notice Checks if the image url is non-empty
    modifier isValidUrl(string memory _imgUrl) {
        // Make sure the image url exists
        require(bytes(_imgUrl).length > 0, "Image Url should exist");
        _;
    }

    /// @notice List of all iamge ids.
    /// @dev Used as a helper when iterating available images in frontend client.
    uint256[] public idList;

    /// @notice idList length.
    /// @dev Used as a helper when iterating available images in frontend client.
    uint256 public idListLength;

    /// image id -> Image mapping
    mapping(uint256 => Image) public images;

    /// @notice Emitted when an image is created
    /// @param id Image id
    /// @param url IPFS Url of the image
    /// @param description Description of the image
    /// @param author Author of the image with image id = id
    event ImageCreated(
        uint256 indexed id,
        string indexed url,
        string indexed description,
        address author
    );

    /// @notice Emitted when a new image is tipped
    /// @param id Image id
    /// @param url IPFS Url of the image
    /// @param description Description of the image
    /// @param tip Amount tipped to this image
    /// @param author Author of the image with image id = id
    event ImageTipped(
        uint256 indexed id,
        string indexed url,
        string indexed description,
        uint256 tip,
        address author
    );

    constructor() {}

    /// @notice Uploads an image to IPFS
    /// @param _imgUrl Url of the image
    /// @param _imgDescription Description of the image
    function uploadImage(string memory _imgUrl, string memory _imgDescription) public
        isValidDescription(_imgDescription)
        isValidUrl(_imgUrl)
    {
        // Make sure uploader address exists
        require(msg.sender != address(0), "Sender address cannot be 0");

        // Increment image id
        uint256 newImageId = imageIdCounter + 1;

        // Creates a new image
        Image memory img = Image({
            id: newImageId,
            url: _imgUrl,
            description: _imgDescription,
            totalTip: 0,
            author: payable(msg.sender)
        });

        // Counter is set to the new image id
        imageIdCounter = newImageId;
        // Push the new image id in the Id list
        idList.push(newImageId);
        // Update the length of the list
        idListLength = idList.length;
        // Assign the image in the images list
        images[img.id] = img;
        // Trigger an Image Created event
        emit ImageCreated(img.id, _imgUrl, _imgDescription, msg.sender);
    }

    /// @notice Tips the image owner
    /// @param _id Id of the image to be tipped
    function tipImageOwner(uint256 _id) public payable isValidId(_id) {
        // Fetch the image
        Image memory _image = images[_id];
        // Fetch the author
        address payable _author = _image.author;
        // Pay the author by sending them Ether
        _author.transfer(msg.value);
        // Increment the tip amount
        _image.totalTip = _image.totalTip + msg.value;
        // Update the image
        images[_id] = _image;
        // Trigger an Image Tipped event
        emit ImageTipped(_id, _image.url, _image.description, _image.totalTip, _author);
    }

    /// @notice Withdraw contract's balance to the owner's address
    /// @dev The function will revert if the send wasn't successful
    function withdraw() public onlyOwner nonReentrant {
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    /// @notice pause the contract -- the contract will start functioning in read-only mode.
    /// @dev Implementing the circuit breaker pattern
    function pause() public onlyOwner {
        Pausable._pause();
    }

    /// @notice resume the contract for both reads and writes
    /// @dev Implementing the circuit breaker pattern
    function unpause() public onlyOwner {
        Pausable._unpause();
    }
}
