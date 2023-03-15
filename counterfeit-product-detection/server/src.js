const Web3 = require('web3');
const ganache = require('ganache-core');

const web3 = new Web3(ganache.provider());

const CounterfeitAbi = require('../build/contracts/Counterfeit.json');


const CounterfeitAddress = process.env.CONTRACT_ADDRESS;

const privateKey = '2a48d8044fac64dc9c17de42e9ee9dc298cc30b1e4bdf036215314398c855e0d';

web3.eth
  .getAccounts()
  .then(async (accounts) => {
    try {
      
      const ct = await new web3.eth.Contract(
        CounterfeitAbi.abi,
        CounterfeitAddress,
      );

      y
      const myAccount = await web3.eth.accounts.privateKeyToAccount(privateKey);
      console.log(myAccount.address);

      console.log(
        'second',
        web3.utils.fromWei(await web3.eth.getBalance(accounts[1]), 'ether'),
      );
    } catch (error) {
      console.log('Other Error', error);
    }
  })
  .catch((error) => {
    console.log('Some Error');
  });
