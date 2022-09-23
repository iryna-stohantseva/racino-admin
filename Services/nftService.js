import { OatImplementationAddress, OatProxyAddress } from "./config.js";
import Web3 from "web3";
import OATContractAbi from "./Abi/OATImplementationABI.json";

const getWeb3 = async () => {
  let instance;
  console.log("window.ethereum", window.ethereum);
  if (window.ethereum) {
    await ethereum.request({ method: "eth_requestAccounts" });
    instance = new Web3(window.ethereum);
  } else {
    instance = new Web3("https://rpc-mumbai.maticvigil.com");
  }
  return instance;
};

export const getOATContract = async (web3) => {
  const { abi } = OATContractAbi;
  console.log('OatProxyAddress',OatProxyAddress,abi);
  const OATContract = new web3.eth.Contract(abi, OatProxyAddress);
  return OATContract;
};

export const burnNFT = async (tokenID) => {
  try {
    const web3 = await getWeb3();
    const contract = await getOATContract(web3);
    const accounts = await web3.eth.getAccounts();
    if(accounts[0]!== ENVOIRMENT_VARIABLES.wallet){
      return {status:false,message:"Please use admin wallet"}
    }
    const nullAddress = "0x0000000000000000000000000000000000000001";
    const approvalResponse = await contract.methods
      .approve(nullAddress, tokenID)
      .send({
        from: accounts[0],
        to: nullAddress,
      });
    console.log(
      "🚀 ~ file: interfaceOATImplementation.js ~ line 111 ~ burnNFT ~ approval",
      approvalResponse
    );
    if (approvalResponse?.events?.Approval) {
      const burnResponse = await contract.methods
        .safeTransferFrom(accounts[0], nullAddress, tokenID)
        .send({
          from: accounts[0],
          to: nullAddress,
        });
      console.log(
        "🚀 ~ file: interfaceOATImplementation.js ~ line 134 ~ burnNFT ~ burnResponse",
        burnResponse
      );
      return burnResponse;
    }
    return false;
  } catch (e) {
    throw e?.message;
  }
};
export const transferNFT = async (tokenID,to) => {
  console.log(tokenID,to);
  try {
    const web3 = await getWeb3();
    const contract = await getOATContract(web3);
    const accounts = await web3.eth.getAccounts();
    console.log("accounts", accounts);
    if(accounts[0]!== ENVOIRMENT_VARIABLES.wallet){
      return {status:false,message:"Please use admin wallet"}
    }
    const approvalResponse = await contract.methods
      .approve(to, tokenID)
      .send({
        from: accounts[0],
        to: to,
      });
    console.log(
      "🚀 ~ file: interfaceOATImplementation.js ~ line 111 ~ Transfer ~ approval",
      approvalResponse
    );
    if (approvalResponse?.events?.Approval) {
      const transferResponse = await contract.methods
        .safeTransferFrom(accounts[0], to, tokenID)
        .send({
          from: accounts[0],
          to: to,
        });
      console.log(
        "🚀 ~ file: interfaceOATImplementation.js ~ line 134 ~ Tranfer ~ TransferResponse",
        transferResponse
      );
      return transferResponse;
    }
    return false;
  } catch (e) {
    throw e?.message;
  }
};

