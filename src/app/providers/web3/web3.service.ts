import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import * as sha from 'sha.js';
import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { Buffer } from 'safe-buffer';
import * as EthereumTx from 'ethereumjs-tx';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { GlobalService } from '../global/global.service';
// import * as Secp from 'secp256k1';

declare var Buffer;
@Injectable({
    providedIn: 'root'
})
export class Web3Service {
    config = {
        provider: '',
        pledgeContractAddr: '0x0000000000000000000000000000000000000081',
        pledgeContractAbi: null
    };

    public web3;
    private pledgeContract;

    constructor(
        private http: HttpClient,
        private global: GlobalService
    ) {
        this.config.provider = `http://gateway.${global.projectName}.com/`;
        this.web3 = new Web3(this.config.provider);
        // console.log(EthereumTx)
        this.http.get('assets/json/pledge.abi.json').subscribe((abi: any) => {
            console.log("abi文件加载成功" + JSON.stringify(abi));
            // this.pledgeContract = this.web3.eth.contract(abi).at(this.config.pledgeContractAddr);
            this.pledgeContract = new this.web3.eth.Contract(abi, this.config.pledgeContractAddr);
            return this.pledgeContract;
        })

    }

    async isPocAddr(addr) {
        if (!addr) {
            return -1;
        }
        addr = addr.toLowerCase();
        if (!addr.startsWith('poc')) {
            return -2;
        }
        let result = await this.web3.utils.isAddress('0x' + addr.slice(3));
        return result ? 0 : -2;
    }

    async getBlockHeight() {
        let height = await this.web3.eth.getBlockNumber();
        return height;
    }

    initContract(name, abi, addr) {
        if (this[name]) {
            return this[name];
        } else {
            this[name] = new this.web3.eth.Contract(abi, addr);
            console.log("合约初始化成功:", name, addr);
            return this[name];
        }
    }

    async getPocBalance(userAddr, pending = true) {
        // let value = await this.web3.eth.getBlockNumber();
        let value = await this.web3.eth.getBalance(userAddr, pending ? 'pending' : 'latest');
        // console.log("调用参数:", userAddr, value);

        console.log(`钱包${userAddr}的余额是${value}`);
        value = this.web3.utils.fromWei(value, 'ether');
        return value;
    }

    getMortage(from) {
        // let value = await this.pledgeContract.methods.mortgageOf(from).call({ from: from });
        // value = this.web3.utils.fromWei(value + "", 'ether');
        // return value;
        return new Promise((resolve, reject) => {
            this.pledgeContract.methods.mortgageOf(from).call({ from: from }, (err, result) => {
                if (err) {
                    resolve(0);
                } else {
                    console.log("抵押", result);
                    let value = this.web3.utils.fromWei(result + "", 'ether');
                    resolve(value);
                }
            });
        })
    }

    async pledge(type, from, amount, privateKey, callback) {
        amount = this.web3.utils.toWei(amount + "", 'ether');
        let gasPrice = await this.web3.eth.getGasPrice();
        if (!gasPrice || gasPrice == '0') {
            gasPrice = this.web3.utils.toWei(20, 'gwei');
        }
        let params = type == 'mortgage' ? [from, amount] : [amount];
        let tx = await this.generatePocTx(from, this.config.pledgeContractAddr, '0x0', gasPrice, privateKey, 'pledgeContract', type, params);
        const serializedTx = tx.serialize();
        this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), callback); //调起合约
        // this.web3.eth.sendSignedTransaction(tx.rawTransaction, callback); //调起合约
    }

    async transferPoc(from, to, value, gasPrice, privateKey, callback) {
        console.log(`发起转账----from:${from},to:${to},value:${value}`);
        value = this.web3.utils.toWei(value, 'ether');
        gasPrice = this.web3.utils.toWei(gasPrice + "", 'gwei');
        let tx = await this.generatePocTx(from, to, value, gasPrice, privateKey);
        console.log("交易签名：", tx)
        const serializedTx = tx.serialize();
        this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), callback); //调起合约
        // this.web3.eth.sendSignedTransaction(tx.rawTransaction, callback); //调起合约
    }

    async generatePocTx(
        from,
        to,
        value,
        gasPrice,
        privateKey, //账户私钥，用于签名
        contractName = "",
        funcname = "",
        params = null
    ) {
        let data = "";
        if (params) {
            var thisobj = this[contractName].methods[funcname]; //从目标合约对象中提取函数
            data = thisobj.apply(thisobj, params).encodeABI(); //将参数封装成合约参数形式
        }

        var nonce = await this.web3.eth.getTransactionCount(from, 'pending'); //获取用户钱包地址的nonce
        console.log("Nonce为" + nonce);
        let gasLimit = await this.web3.eth.estimateGas({
            "from": from,
            "nonce": nonce,
            "to": to,
            "data": data
        })

        let chainId = await this.web3.eth.net.getId();
        console.log("chainId:", chainId);
        const txParams = {
            from: from,
            nonce: nonce,
            gas: this.convert10to16(gasLimit),
            gasPrice: this.convert10to16(gasPrice),
            to: to,
            data: data,
            value: this.convert10to16(value),
            chainId: chainId
        };

        console.log("转账参数：" + JSON.stringify(txParams));
        // return this.web3.eth.accounts.signTransaction(txParams, privateKey);

        const tx = new EthereumTx.Transaction(txParams, {
            chain: "pocnet"
        });
        let privateKeyBuffer = Buffer.from(privateKey, 'hex');
        tx.sign(privateKeyBuffer);
        return tx;
    }

    async getTxDetail(tx) {
        let result = await this.web3.eth.getTransaction(tx);
        result.value = this.web3.utils.fromWei(result.value, 'ether');
        result.gasPrice = this.web3.utils.fromWei(result.gasPrice, 'ether');
        return result
    }

    computeSha256Hash(str) {
        const sha256 = sha('sha256');
        const msgHash = sha256.update(str, 'utf8').digest('hex');
        return msgHash;
    }

    strToBase64(str) {
        let strBase64 = new Buffer(str, "hex").toString('base64');
        return strBase64;
    }

    base64ToStr(base64) {
        let str = new Buffer(base64, "base64").toString("hex");
        return str;
    }

    strToBuffer(str, type) {
        console.log(str + '即将转成buffer对象');
        if (type === 'hex') {
            return Buffer.from(str, 'hex');
        } else {
            return Buffer.from(str);
        }
    }

    floatMultiple(f1, f2) {
        let m1 = new this.web3.BigNumber(f1),
            m2 = new this.web3.BigNumber(f2);
        return m1.mul(m2);
    }

    bufferToStr(buf, type) {
        if (type) {
            return buf.toString(type);
        } else {
            return buf.toString();
        }
    }

    convert10to16(n) {
        if (typeof n != 'string') {
            n = n.toString();
        }
        if (n.startsWith('0x')) {
            return n;
        }
        return this.web3.utils.toHex(n);
    }

}




