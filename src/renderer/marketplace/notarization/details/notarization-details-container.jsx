import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { pricesSelectors } from 'common/prices';
import { identitySelectors } from 'common/identity';
// import { kycSelectors } from 'common/kyc';
import { withStyles } from '@material-ui/core/styles';
import { marketplaceSelectors } from 'common/marketplace';
import { MarketplaceNotariesComponent } from '../common/marketplace-notaries-component';
import NotarizationDetailsPage from './notarization-details-page';

const styles = theme => ({});

class NotarizationDetailsContainer extends MarketplaceNotariesComponent {
	state = {
		tab: 'types',
		loading: false
	};

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	onBackClick = () => this.props.dispatch(push(this.marketplaceRootPath()));

	onTabChange = tab => this.setState({ tab });

	onApplyClick = () => {
		const { identity } = this.props;
		const selfkeyIdRequiredRoute = '/main/marketplace/selfkey-id-required';
		const selfkeyDIDRequiredRoute = '/main/marketplace/selfkey-did-required';
		const requestNotarizationRoute = '/main/marketplace/notaries/process';

		// When clicking the start process,
		// we check if an authenticated kyc-chain session exists
		// If it doesn't we trigger a new authenticated rp session
		// and redirect to checkout route
		// The loading state is used to disable the button while data is being loaded
		console.log(`${identity}`);
		this.setState({ loading: true }, async () => {
			if (!identity.isSetupFinished) {
				return this.props.dispatch(push(selfkeyIdRequiredRoute));
			}
			if (!identity.did) {
				return this.props.dispatch(push(selfkeyDIDRequiredRoute));
			} else {
				await this.props.dispatch(push(requestNotarizationRoute));
			}
		});
	};

	render() {
		const { keyRate, kycRequirements, templateId } = this.props;
		return (
			<NotarizationDetailsPage
				onBackClick={this.onBackClick}
				keyRate={keyRate}
				loading={this.state.loading || this.props.isLoading}
				tab={this.state.tab}
				kycRequirements={kycRequirements}
				templateId={templateId}
				onTabChange={this.onTabChange}
				startNotarize={this.onApplyClick}
			/>
		);
	}
}

NotarizationDetailsContainer.propTypes = {
	isLoading: PropTypes.bool,
	keyRate: PropTypes.number
};

const mapStateToProps = (state, props) => {
	return {
		isLoading: marketplaceSelectors.isLoading(state),
		keyRate: pricesSelectors.getRate(state, 'KEY', 'USD'),
		identity: identitySelectors.selectCurrentIdentity(state)
	};
};

const styledComponent = withStyles(styles)(NotarizationDetailsContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export default connectedComponent;
export { connectedComponent as NotarizationDetailsContainer };