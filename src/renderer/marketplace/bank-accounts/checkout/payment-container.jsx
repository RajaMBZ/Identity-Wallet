import BN from 'bignumber.js';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { featureIsEnabled } from 'common/feature-flags';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors } from 'common/kyc';
import { pricesSelectors } from 'common/prices';
import { marketplaceSelectors } from 'common/marketplace';
import { ordersOperations } from 'common/marketplace/orders';
import { MarketplaceBankAccountsComponent } from '../common/marketplace-bank-accounts-component';

const styles = theme => ({});
const VENDOR_NAME = 'Far Horizon Capital Inc';

class BankAccountsPaymentContainer extends MarketplaceBankAccountsComponent {
	async componentDidMount() {
		await this.loadRelyingParty({ rp: 'flagtheory_banking', authenticated: true });
		await this.createOrder();
	}

	priceInKEY = priceUSD => {
		return new BN(priceUSD).dividedBy(this.props.keyRate).toString();
	};

	async createOrder() {
		const { jurisdiction, accountCode } = this.props;
		const application = this.getLastApplication();
		const price = this.priceInKEY(jurisdiction.price);
		const walletAddress = jurisdiction.walletAddress;
		const vendorDID = jurisdiction.didAddress;

		this.props.dispatch(
			ordersOperations.startOrderOperation({
				applicationId: application.id,
				amount: price,
				vendorId: 'flagtheory_banking',
				itemId: accountCode,
				vendorDID,
				productInfo: `Bank account in ${jurisdiction.data.region}`,
				vendorName: VENDOR_NAME,
				backUrl: this.cancelRoute(),
				completeUrl: this.paymentCompleteRoute(),
				vendorWallet: featureIsEnabled('paymentContract') ? '' : walletAddress
			})
		);
	}

	onBackClick = () => this.props.dispatch(push(this.cancelRoute()));

	onPayClick = () => this.props.dispatch(push(this.selectBankRoute()));

	render = () => null;
}

const mapStateToProps = (state, props) => {
	const { accountCode } = props.match.params;
	const authenticated = true;

	return {
		accountCode,
		jurisdiction: marketplaceSelectors.selectBankJurisdictionByAccountCode(state, accountCode),
		publicKey: getWallet(state).publicKey,
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		currentApplication: kycSelectors.selectCurrentApplication(state),
		rp: kycSelectors.relyingPartySelector(state, 'flagtheory_banking'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'flagtheory_banking',
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(BankAccountsPaymentContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsPaymentContainer };
