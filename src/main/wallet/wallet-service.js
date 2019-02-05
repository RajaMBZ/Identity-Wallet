import { Logger } from 'common/logger';
import { getGlobalContext } from 'common/context';
import { Wallet } from './wallet';
import fs from 'fs';
import path from 'path';
import EthUnits from 'common/utils/eth-units';

const log = new Logger('wallet-model');
export class WalletService {
	constructor() {
		this.web3Service = getGlobalContext().web3Service;
	}

	async createWallet(password) {
		const { address, privateKey } = this.web3Service.web3.eth.accounts.create(password);
		const keystore = this.web3Service.web3.eth.accounts.encrypt(privateKey, password);
		const keystoreFileFullPath = path.resolve(
			getGlobalContext().config.walletsDirectoryPath,
			address
		);
		try {
			await fs.promises.writeFile(keystoreFileFullPath, JSON.stringify(keystore), 'utf8');
		} catch (error) {
			log.error(error);
		}
		const wallet = await Wallet.create({
			publicKey: address,
			keystoreFilePath: keystoreFileFullPath
		});

		const newWallet = {
			id: wallet.id,
			isSetupFinished: wallet.isSetupFinished,
			publicKey: address,
			privateKey: privateKey,
			keystoreFilePath: keystoreFileFullPath
		};

		return newWallet;
	}

	async copyKeystoreFile(id, toPath) {
		const wallet = await Wallet.findById(id);
		try {
			await fs.promises.copyFile(
				wallet.keystoreFilePath,
				path.resolve(toPath, wallet.publicKey)
			);
			return true;
		} catch (error) {
			log.error(error);
			return false;
		}
	}

	async getBalance(id) {
		const wallet = await Wallet.findById(id);
		const balanceInWei = await this.web3Service.web3.eth.getBalance(wallet.publicKey);
		return EthUnits.toEther(balanceInWei, 'wei');
	}

	async getWallets() {
		return Wallet.findAllWithKeyStoreFile();
	}

	async unlockWalletWithPassword(id, password) {
		const wallet = await Wallet.findById(id);
		const keystore = JSON.parse(await fs.promises.readFile(wallet.keystoreFilePath));
		const account = this.web3Service.web3.eth.accounts.decrypt(keystore, password);
		if (!account) {
			throw new Error('Wrong Password!');
		}
		return {
			id: wallet.id,
			isSetupFinished: wallet.isSetupFinished,
			publicKey: account.address,
			privateKey: account.privateKey,
			keystoreFilePath: wallet.keystoreFilePath
		};
	}

	async unlockWalletWithNewFile(filePath, password) {
		const keystore = JSON.parse(await fs.promises.readFile(filePath));
		const account = this.web3Service.web3.eth.accounts.decrypt(keystore, password);
		if (!account) {
			throw new Error('Wrong Password!');
		}

		const keystoreFileFullPath = path.resolve(
			getGlobalContext().config.walletsDirectoryPath,
			account.address
		);

		await fs.promises.copyFile(filePath, keystoreFileFullPath);

		let wallet = await Wallet.findByPublicKey(account.address);

		wallet = !wallet
			? await Wallet.create({
					publicKey: account.address,
					keystoreFilePath: keystoreFileFullPath
			  })
			: wallet;

		const newWallet = {
			id: wallet.id,
			isSetupFinished: wallet.isSetupFinished,
			publicKey: account.address,
			privateKey: account.privateKey,
			keystoreFilePath: keystoreFileFullPath
		};

		return newWallet;
	}

	async unlockWalletWithPrivateKey(privateKey) {
		const account = this.web3Service.web3.eth.accounts.privateKeyToAccount(privateKey);

		let wallet = await Wallet.findByPublicKey(account.address);

		wallet = !wallet
			? await Wallet.create({
					publicKey: account.address
			  })
			: wallet;

		const newWallet = {
			id: wallet.id,
			isSetupFinished: wallet.isSetupFinished,
			publicKey: account.address,
			privateKey: account.privateKey
		};

		return newWallet;
	}

	async unlockWalletWithPublicKey(publicKey) {
		let wallet = await Wallet.findByPublicKey(publicKey);

		wallet = !wallet
			? await Wallet.create({
					publicKey
			  })
			: wallet;

		const newWallet = {
			id: wallet.id,
			isSetupFinished: wallet.isSetupFinished,
			publicKey: wallet.publicKey
		};

		return newWallet;
	}

	async _getWallets() {
		return new Promise((resolve, reject) => {
			this.web3Service.web3.eth.getAccounts((error, accounts) => {
				if (error) {
					log.info('error: %j', error);
					reject(error);
				} else {
					const promises = accounts.map(async address => {
						const balanceInWei = await this.web3Service.web3.eth.getBalance(address);
						return {
							address,
							balance: EthUnits.toEther(balanceInWei, 'wei')
						};
					});
					resolve(Promise.all(promises));
				}
			});
		});
	}

	async getLedgerWallets(page) {
		await this.web3Service.switchToLedgerWallet(page);
		return this._getWallets();
	}

	async getTrezorWallets(page, eventEmitter) {
		await this.web3Service.switchToTrezorWallet(page, 6, eventEmitter);

		return this._getWallets();
	}
}

export default WalletService;
