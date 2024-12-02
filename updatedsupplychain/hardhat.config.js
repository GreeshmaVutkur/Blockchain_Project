/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.27",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0x5b600be697ab36d237c2c4c44c30aa939d53753495a8920256dd859db0b638df", // Private key 2
        "0xe41bc61bb515a240015404213a57e265e51136cf5ef8933b16e148bccf7410f5"  // Private key 1
      ],
    },
  },
};
