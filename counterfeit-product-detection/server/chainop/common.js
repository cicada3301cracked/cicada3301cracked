const Web3 = require('web3');

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_NODE),
);
const Abi = require('../../build/contracts/Counterfeit.json');

const CounterfeitAddress = process.env.CONTRACT_ADDRESS;

const common = {
 
  async returnContract() {
    const contract = await new web3.eth.Contract(Abi.abi, CounterfeitAddress);
    return contract;
  },

  async returnAccount(privateKey) {
    const account = await web3.eth.accounts.privateKeyToAccount(privateKey);
    return account;
  },

  async generatePrivateKey() {
    try {
      const newAccount = await web3.eth.accounts.create();
      return newAccount.privateKey;
    } catch (error) {
      console.log(error.message);
      throw new Error('failed to create new private key');
    }
  },

  /
  callTransaction(method, privateKey = process.env.COMMON_PRIVATE_KEY) {
    return new Promise(async (resolve, reject) => {
      try {
        const contract = await this.returnContract();
        const account = await this.returnAccount(privateKey);
        
        const transaction = {
          from: account.address,
          to: CounterfeitAddress,
        };
       
        const result = await eval(
          `contract.methods.${method}.call(transaction)`
        );
        
        return resolve(result);
      } catch (error) {
        console.log(error.message);
        return reject('Failed to call');
      }
    });
  },

  
  signTransaction(method, privateKey = process.env.COMMON_PRIVATE_KEY) {
    return new Promise(async (resolve, reject) => {
      try {
        
        const contract = await this.returnContract();

        const myAccount = await this.returnAccount(privateKey);
        
        const transaction = {
          from: myAccount.address,
          to: CounterfeitAddress,
          gas: 500000,
     
          data: eval(`contract.methods.${method}.encodeABI()`),
        };

        const signedTransaction = await web3.eth.accounts.signTransaction(
          transaction,
          privateKey
        );
        return resolve(signedTransaction);
      } catch (error) {
        console.log(error.message);
        return reject('Failed to sign');
      }
    });
  },

  sendTransaction(signedTransaction) {
    return new Promise(async (resolve, reject) => {
      try {
        const receipt = await web3.eth.sendSignedTransaction(
          signedTransaction.rawTransaction,
        );
        return resolve(receipt);
      } catch (error) {
        console.log(error.message);
        return reject('Failed to send transaction');
      }
    });
  },

  getBalance(privateKey = process.env.COMMON_PRIVATE_KEY) {
    return new Promise(async (resolve, reject) => {
      try {
        const myAccount = await this.returnAccount(privateKey);
        const balance = await web3.eth.getBalance(myAccount.address);
        return resolve(balance);
      } catch (error) {
        console.log(error.message);
        return reject('Failed to get balance');
      }
    });
  },
};

module.exports = common;
