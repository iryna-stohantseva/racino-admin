let OatImplementationAddress, OatProxyAddress;

OatImplementationAddress = "0x95B21b314E90F47920d94Fe682B1b0e9d3aD19a0";
OatProxyAddress = "0xb126578F2c86F9504376490B807B8b8e4Cf275C7";

if (ENVOIRMENT_VARIABLES.ENV === "DEVELOPMENT") {
  OatImplementationAddress = "0x5Cc62e9E7b5Cf59FF7440b3E9963044A5c57F2DB";
  OatProxyAddress = "0x603AbfAaF6D0086Ac522B8DEC5Db07675b622761";
}

module.exports = {
  OatImplementationAddress,
  OatProxyAddress,
};
