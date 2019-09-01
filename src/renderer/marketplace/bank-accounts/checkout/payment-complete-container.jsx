import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors, kycOperations } from 'common/kyc';
import { marketplaceSelectors } from 'common/marketplace';
import { transactionSelectors } from 'common/transaction';
import { MarketplaceBankAccountsComponent } from '../common/marketplace-bank-accounts-component';
import { BankAccountsPaymentComplete } from './payment-complete';

const styles = theme => ({});

class BankAccountsPaymentCompleteContainer extends MarketplaceBankAccountsComponent {
	async componentWillMount() {
		await this.loadRelyingParty({ rp: 'flagtheory_banking', authenticated: true });
	}

	async componentDidMount() {
		const { transaction, jurisdiction } = this.props;

		this.saveTransactionHash();
		this.clearRelyingParty();

		this.trackEcommerceTransaction({
			transactionHash: transaction.transactionHash,
			price: jurisdiction.price,
			code: jurisdiction.data.accountCode,
			jurisdiction: jurisdiction.data.region,
			rpName: 'Bank Accounts'
		});
	}

	saveTransactionHash = async () => {
		const { transaction, jurisdiction } = this.props;
		const application = this.getLastApplication();

		if (!this.userHasPaid() && transaction) {
			await this.props.dispatch(
				kycOperations.updateRelyingPartyKYCApplicationPayment(
					'flagtheory_banking',
					application.id,
					transaction.transactionHash
				)
			);

			await this.props.dispatch(
				kycOperations.updateApplicationsOperation({
					id: application.id,
					payments: {
						amount: jurisdiction.price,
						amountKey: transaction.amount,
						transactionHash: transaction.transactionHash,
						date: Date.now(),
						status: 'Sent KEY'
					}
				})
			);
		} else {
			// TODO: what to do if no transaction or currentApplication exists?
			console.error('No current application or transaction');
			this.props.dispatch(push(this.cancelRoute()));
		}
	};

	getNextRoute = () => {
		// INFO: should we check if bank is already selected ?
		return this.selectBankRoute();
	};

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	onContinueClick = () => this.props.dispatch(push(this.getNextRoute()));

	render() {
		return (
			<BankAccountsPaymentComplete
				email={'support@flagtheory.com'}
				onBackClick={this.onBackClick}
				onContinueClick={this.onContinueClick}
			/>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { accountCode } = props.match.params;
	const authenticated = true;
	return {
		jurisdiction: marketplaceSelectors.selectBankJurisdictionByAccountCode(state, accountCode),
		transaction: transactionSelectors.getTransaction(state),
		publicKey: getWallet(state).publicKey,
		currentApplication: kycSelectors.selectCurrentApplication(state),
		rp: kycSelectors.relyingPartySelector(state, 'flagtheory_banking'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'flagtheory_banking',
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(BankAccountsPaymentCompleteContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsPaymentCompleteContainer };
