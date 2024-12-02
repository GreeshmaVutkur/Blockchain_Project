pragma solidity ^0.8.0;

contract SupplyChain {
    address owner;

    struct Product {
        uint256 productID;
        string description;
        string status; // Status with appended updates and timestamps
        address retailer; // Address of the retailer who purchased
        string deliveryLocation; // Location provided by the retailer
        uint256 deliveryDate; // Delivery date set by the transporter
    }

    mapping(uint256 => Product) private products; // Mapping to store products by their ID
    uint256[] private productIDs; // Array to store product IDs

    event ProductPurchased(uint256 productID, address retailer); // Event for product purchase
    event DeliveryDateSet(uint256 productID, uint256 deliveryDate); // Event for delivery date setting

    constructor() {
        owner = msg.sender;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function addProduct(uint256 productID, string memory description) public {
        require(products[productID].productID == 0, "Product already exists");

        products[productID] = Product({
            productID: productID,
            description: description,
            status: string(abi.encodePacked("inventory - ", uint2str(block.timestamp))),
            retailer: address(0),
            deliveryLocation: "",
            deliveryDate: 0
        });

        productIDs.push(productID);
    }

    function fetchProduct(uint256 productID) public view returns (uint256, string memory, string memory, address, string memory, uint256) {
        require(products[productID].productID != 0, "Product not found");
        Product memory product = products[productID];
        return (product.productID, product.description, product.status, product.retailer, product.deliveryLocation, product.deliveryDate);
    }

    function buyProduct(uint256 productID, string memory deliveryLocation) public {
        require(products[productID].productID != 0, "Product not found");
        require(products[productID].retailer == address(0), "Product already purchased");

        products[productID].retailer = msg.sender;
        products[productID].deliveryLocation = deliveryLocation;
        products[productID].status = string(
            abi.encodePacked(products[productID].status, " -> purchased by retailer - ", uint2str(block.timestamp))
        );

        emit ProductPurchased(productID, msg.sender); // Emit the purchase event
    }

    function setDeliveryDate(uint256 productID, uint256 deliveryDate) public {
        require(products[productID].productID != 0, "Product not found");
        require(products[productID].retailer != address(0), "Product not yet purchased");

        products[productID].deliveryDate = deliveryDate;
        products[productID].status = string(
            abi.encodePacked(products[productID].status, " -> delivery date set - ", uint2str(block.timestamp))
        );

        emit DeliveryDateSet(productID, deliveryDate); // Emit the delivery date event
    }

    function getAllBatches() public view returns (Product[] memory) {
        uint256 totalProducts = productIDs.length;

        Product[] memory allProducts = new Product[](totalProducts);

        for (uint256 i = 0; i < totalProducts; i++) {
            allProducts[i] = products[productIDs[i]];
        }

        return allProducts;
    }

    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 temp = _i;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (_i != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(_i % 10)));
            _i /= 10;
        }
        return string(buffer);
    }
}
