/* eslint-disable @typescript-eslint/no-var-requires */
import Web3 from 'web3';
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Wallet } from 'src/features/wallet/domain/entities/wallet.entity';
import configs from '../environments/configs';
import { IBlockchainService } from './blockchain-service.interface';
//const Web3 = require('web3');
//import { Types } from 'mongoose';

import { IPrivateKey } from 'src/features/wallet/domain/interfaces/private-key.interface';
const smartContractArtifact = require('../../../contracts/abi.json')

// interface ISmartContract {
//   methods: {
//     createToken: (itemId: number, amount: number) => { encodeABI: () => Promise<any> },
//     balanceOf: (address:string, val:number) => any
//   }
// }

@Injectable()
export class BlockchainService implements IBlockchainService {
  private web3: Web3;
  private readonly smartContractInstance;//ISmartContract;

  constructor(
    @Inject(configs.KEY)
    private readonly configService: ConfigType<typeof configs>
  ) {
    const provider = new Web3.providers.HttpProvider(`${this.configService.blockchain.host}`);
    this.web3 = new Web3(provider);
    this.smartContractInstance = new this.web3.eth.Contract(smartContractArtifact, '0x7b95ebc5a0c3ac221c3a8892af3d8f813f8617d1'/*this.configService.blockchain.contractAddress*/);
    //console.log('this.smartContractInstance', this.smartContractInstance)
    //console.log('web3.utils.hexToNumber();', this.web3.utils.hexToNumber('0x1f'))
    //console.log('this.web3.eth.accounts.wallet', this.web3.eth.accounts.wallet)
  }

  // async createWallet() {
  //   const wallet = await this.web3.eth.accounts.wallet.create(0, 'wallet entropy');
  //   const account = await this.web3.eth.accounts.create('account entropy');
  //   console.log('_createdAccount: ', account);
  //   await wallet.add(account);
  //   await this.createToken(1, 888, account)


  //   return null;
  // }










  public async createWallet(): Promise<Wallet> {
    // const privateKey: string = this.web3.utils.randomHex(32);//custom privatekey 
    // const address = await this.web3.eth.personal.newAccount('password');//cuenta sin passphrase
    // console.log('******address ', address)
    // console.log('******privateKey ', privateKey)

    const privateKey: string = this.web3.utils.randomHex(32);
    const address = this.web3.utils.randomHex(32);

    const encryptedKey: IPrivateKey = this.web3.eth.accounts.encrypt(
      privateKey,
      this.configService.blockchain.encryptPass,
    );
    //console.log('******decryptKey ', this.decryptKey(encryptedKey))

    return new Wallet({ id: null, address, privateKey: encryptedKey });
  }

  private decryptKey(encryptedKey: IPrivateKey) {
    const address = this.web3.eth.accounts.decrypt(
      encryptedKey,
      this.configService.blockchain.encryptPass,
    );
    return address;
  }

  public async createToken(
    bcItemId: number,
    amount: number,
    { address, privateKey }: Wallet): Promise<string> {
    //const method = await this.smartContractInstance.methods.setInstructor('Brutis', 44).encodeABI();
    //const method = await this.smartContractInstance.methods.createToken(bcItemId, amount).encodeABI();
    //const method = await this.smartContractInstance.methods.balanceOf('0x68F6c9A1D3e15f7412C61154Cc3b754ac82Eb55g', 0).encodeABI();



    // const signedTransaction = await this.signTransaction(address, privateKey, method);
    // try {
    //   const { transactionHash } = await this.web3.eth.sendSignedTransaction(signedTransaction.raw);
    //   console.log('transactionHash', transactionHash)
    // } catch (e) {
    //   console.log('error sendSignedTransaction', e)
    // }

    const transactionHash: string = this.web3.utils.randomHex(32);
    return transactionHash;
  }


  private async signTransaction(senderAddress: string, encrytedPrivateKey: any, method: any) {
    //await this.unlockAccount(senderAddress, encrytedPrivateKey);
    //console.log('despues unlockAccount')
    const gasPrice = await this.getGasPrice();
    //const txCount = await this.getTransactionCount('0x7b95ebc5a0c3ac221c3a8892af3d8f813f8617d1'/*'0xad7348d02448d7993bb85a788483ba90c9743e11'*/);
    console.log('senderAddress', senderAddress)
    console.log('encrytedPrivateKey', encrytedPrivateKey)

    const chainId = await this.web3.eth.net.getId();
    console.log('chainId', chainId)
    const rawTx = {
      from: senderAddress,//'0xad7348d02448d7993bb85a788483ba90c9743e11',//senderAddress,
      //nonce: 900000084,//txCount,
      to: '0x7b95ebc5a0c3ac221c3a8892af3d8f813f8617d1',//this.configService.blockchain.contractAddress,
      value: '0x00',
      gasPrice,
      gas: 100000,
      data: method,
      chainId,
      // chain: 'RSK Testnet',
      // hardfork: "berlin"
      // common: { customChain: { networkId:31, chainId: 31 } }
    };
    console.log('rawTx', rawTx)
    //return null
    let a;
    try {
      a = await this.web3.eth.personal.signTransaction(
        rawTx, 'password'
      );
      //a = await this.web3.eth.personal.signTransaction(rawTx, 'password');
    } catch (e) {
      console.log('signTransaction[rror]', e)
    }
    console.log('signTransaction[response]', a)
    return a
  }


  // private async unlockAccount(senderAddress: string, encrytedPrivateKey: IPrivateKey): Promise<void> {
  //   try {
  //     const privateKey = this.decryptKey(encrytedPrivateKey);
  //     console.log('senderAddress', senderAddress)
  //     console.log('privateKey', privateKey)
  //     console.log('ANTES', )
  //     const a = this.web3.utils.toHex(300)
  //     await this.web3.eth.personal.unlockAccount(senderAddress, 'password', Number(a) );
  //     console.log('DESPUES')
  //   } catch (e) {
  //     console.log('unlockAccount', e)
  //   }

  // }


  private async getGasPrice(): Promise<string> {
    return await this.web3.eth.getGasPrice();
  }


  private async getTransactionCount(senderAddress: string): Promise<number> {
    return await this.web3.eth.getTransactionCount(senderAddress);
  }
}
