const Depinterest = artifacts.require("./Depinterest.sol");

module.exports = function (deployer) {
  deployer.deploy(Depinterest);
};