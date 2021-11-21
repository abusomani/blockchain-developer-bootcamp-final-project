// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Contract for decentralized image sharing
/// @author Abhishek Somani
/// @notice Allows an user to tip an image
contract Depinterest is Ownable {
    /// @dev Tracks given image ids. Current value is the newest image id.
    uint256 private imageIdCounter = 0;

    struct Image {
        uint256 id;
        string description;
        uint256 totalTip;
        address payable author;
    }

    /// @notice List of all iamge ids.
    /// @dev Used as a helper when iterating available images in frontend client.
    uint256[] public idList;

    /// @notice idList length.
    /// @dev Used as a helper when iterating available images in frontend client.
    uint256 public idListLength;

    mapping(uint256 => Image) public images;

    /// @notice Emitted when an image is created
    /// @param id Image id
    /// @param description Description of the image
    /// @param author Author of the image with image id = id
    event ImageCreated(
        uint256 indexed id,
        string indexed description,
        address author
    );

    /// @notice Emitted when a new image is tipped
    /// @param id Image id
    /// @param description Description of the image
    /// @param tip Amount tipped to this image
    /// @param author Author of the image with image id = id
    event ImageTipped(
        uint256 indexed id,
        string indexed description,
        uint256 tip,
        address author
    );

    constructor() public {}

    /// @notice Uploads an image to IPFS
    /// @param _imgDescription Description of the image
    function uploadImage(string memory _imgDescription) public onlyOwner {
        // Make sure the image description exists
        require(bytes(_imgDescription).length > 0, "Image should have some description.");
        // Make sure uploader address exists
        require(msg.sender != address(0), "Sender address cannot be 0");

        // Increment image id
        uint256 newImageId = imageIdCounter + 1;

        // Creates a new image
        Image memory img = Image({
            id: newImageId,
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
        emit ImageCreated(img.id, _imgDescription, msg.sender);
    }

    /// @notice Tips the image owner
    /// @param _id Id of the image to be tipped
    function tipImageOwner(uint256 _id) public payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= imageIdCounter, "Image id to be tipped is invalid.");
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
        emit ImageTipped(_id, _image.description, _image.totalTip, _author);
    }
}
