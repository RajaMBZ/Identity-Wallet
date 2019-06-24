import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import config from 'common/config';
import EthUnits from 'common/utils/eth-units';
import { getLocale } from 'common/locale/selectors';
import { getFiatCurrency } from 'common/fiatCurrency/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { getWallet } from 'common/wallet/selectors';
import { ethGasStationInfoSelectors, ethGasStationInfoOperations } from 'common/eth-gas-station';
import { pricesSelectors } from 'common/prices';
import { kycSelectors, kycOperations } from 'common/kyc';
import { bankAccountsOperations, bankAccountsSelectors } from 'common/bank-accounts';
import { PaymentCheckout } from '../../common/payment-checkout';

const styles = theme => ({});
const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';
const CRYPTOCURRENCY = config.constants.primaryToken;
const FIXED_GAS_LIMIT_PRICE = 21000;
// const VENDOR_NAME = 'Far Horizon Capital Inc';

class BankAccountsCheckoutContainer extends Component {
	async componentDidMount() {
		this.props.dispatch(ethGasStationInfoOperations.loadData());

		const authenticated = true;
		// If session is not authenticated, reauthenticate with KYC-Chain
		// Otherwise, just check if user has already applied to redirect
		// back to incorporations page

		if (this.props.rpShouldUpdate) {
			await this.props.dispatch(
				kycOperations.loadRelyingParty('incorporations', authenticated)
			);
		} else {
			await this.checkIfUserCanOpenBankAccount();
		}

		if (!this.props.accountType) {
			await this.props.dispatch(bankAccountsOperations.loadBankAccountsOperation());
		}
	}

	getLastApplication = () => {
		const { rp } = this.props;
		const { templateId } = this.props.match.params;

		if (!rp || !rp.authenticated) return false;

		const { applications } = this.props.rp;
		if (!applications || applications.length === 0) return false;

		let application;
		let index = applications.length - 1;
		for (; index >= 0; index--) {
			if (applications[index].template === templateId) {
				application = applications[index];
				break;
			}
		}
		return application;
	};

	userHasApplied = () => {
		const application = this.getLastApplication();
		return !!application;
	};

	applicationWasRejected = () => {
		const application = this.getLastApplication();
		if (!application) {
			return false;
		}
		// Process is cancelled or Process is rejected
		return application.currentStatus === 3 || application.currentStatus === 8;
	};

	canUserOpenBankAccount = () => {
		const { templateId } = this.props.match.params;
		const price = this.props.accountType.price;

		if (this.props.rp && this.props.rp.authenticated) {
			return !!(
				templateId &&
				price &&
				(!this.userHasApplied() || this.applicationWasRejected())
			);
		} else {
			return !!(templateId && price);
		}
	};

	checkIfUserCanOpenBankAccount = async () => {
		if (!this.canUserOpenBankAccount()) {
			this.props.dispatch(push(this.getCancelRoute()));
		}
	};

	getPaymentParameters() {
		const { keyRate, ethRate, ethGasStationInfo, cryptoCurrency, accountType } = this.props;
		const gasPrice = ethGasStationInfo.fast;
		const price = accountType.price;
		const keyAmount = price / keyRate;
		const gasLimit = FIXED_GAS_LIMIT_PRICE;
		const ethFee = EthUnits.toEther(gasPrice * gasLimit, 'gwei');
		const usdFee = ethFee * ethRate;

		return {
			cryptoCurrency,
			keyRate,
			gasPrice,
			gasLimit,
			price,
			keyAmount,
			ethFee,
			usdFee
		};
	}

	getCancelRoute = () => {
		const { accountCode, countryCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/details/${accountCode}/${countryCode}/${templateId}`;
	};

	getPayRoute = () => {
		const { accountCode, countryCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/pay/${accountCode}/${countryCode}/${templateId}`;
	};

	onBackClick = () => this.props.dispatch(push(this.getCancelRoute()));

	onStartClick = _ => {
		const { accountType } = this.props;
		const { templateId } = this.props.match.params;
		const region = accountType.region;

		this.props.dispatch(
			kycOperations.startCurrentApplicationOperation(
				'incorporations',
				templateId,
				this.getPayRoute(),
				this.getCancelRoute(),
				region,
				`You are about to begin the application process for a bank account in ${region}.
				Please double check your required documents are Certified True or Notarized where
				necessary. Failure to do so will result in delays in the process. You may also be
				asked to provide more information by the service provider`,
				'conducting KYC',
				'Far Horizon Capital Inc',
				'https://flagtheory.com/privacy-policy',
				'http://flagtheory.com/terms-and-conditions'
			)
		);
	};

	render() {
		const { accountType } = this.props;
		const countryCode = this.props.match.params.countryCode;

		return (
			<PaymentCheckout
				title={`Banking Application Fee: ${accountType.region}`}
				program={accountType}
				countryCode={countryCode}
				{...this.getPaymentParameters()}
				price={accountType.price}
				options={accountType.checkoutOptions}
				initialDocsText={
					'You will be required to provide a few basic informations about yourself like full name and email. This will be done through SelfKey ID Wallet.'
				}
				kycProcessText={
					'You will undergo a standard KYC process and our team will get in touch with you to make sure we have all the information needed.'
				}
				getFinalDocsText={
					'Once the account opening process is done you will receive all the relevant documents, access codes in persion/via courier or on your email.'
				}
				onBackClick={this.onBackClick}
				onStartClick={this.onStartClick}
				startButtonText={'Pay Fee'}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { accountCode, countryCode } = props.match.params;
	const authenticated = true;
	return {
		accountType: bankAccountsSelectors.getTypeByAccountCode(state, accountCode),
		banks: bankAccountsSelectors.getDetailsByAccountCode(state, accountCode),
		jurisdiction: bankAccountsSelectors.getJurisdictionsByCountryCode(state, countryCode),
		...getLocale(state),
		...getFiatCurrency(state),
		...ethGasStationInfoSelectors.getEthGasStationInfo(state),
		tokens: getTokens(state).splice(1), // remove ETH
		publicKey: getWallet(state).publicKey,
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		ethRate: pricesSelectors.getRate(state, 'ETH', 'USD'),
		cryptoCurrency: CRYPTOCURRENCY,
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(BankAccountsCheckoutContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsCheckoutContainer };
