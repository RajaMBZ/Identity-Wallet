import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { withStyles } from '@material-ui/core/styles';
import { getWallet } from 'common/wallet/selectors';
import { kycSelectors, kycOperations } from 'common/kyc';
import { bankAccountsSelectors } from 'common/bank-accounts';
import { transactionSelectors } from 'common/transaction';
import { Grid, Typography, Button } from '@material-ui/core';
import { CloseButtonIcon, HourGlassLargeIcon } from 'selfkey-ui';
import ReactPiwik from 'react-piwik';

const MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH = '/main/marketplace-bank-accounts';
// const VENDOR_NAME = 'Far Horizon Capital Inc';

const styles = theme => ({
	container: {
		position: 'relative',
		width: '100%',
		margin: '0 auto',
		maxWidth: '960px'
	},
	containerHeader: {
		padding: '22px 30px',
		background: '#2A3540',
		'& div': {
			display: 'inline-block',
			color: '#FFF'
		},
		'& .region': {
			marginLeft: '1em',
			marginTop: '0.25em',
			marginBottom: '0',
			fontSize: '24px'
		}
	},
	closeIcon: {
		position: 'absolute',
		right: '-19px',
		top: '-20px'
	},
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px',
		padding: '30px'
	},
	icon: {
		width: '120px'
	},
	content: {
		width: 'calc(100% - 120px)'
	},
	description: {
		fontFamily: 'Lato, arial',
		color: '#FFF',
		lineHeight: '1.5em',
		fontSize: '14px',
		'& p': {
			marginBottom: '1em'
		},
		'& p.email': {
			color: '#00C0D9',
			padding: '10px 0 10px 0'
		},
		'& strong': {
			fontWeight: '700'
		}
	},
	instructions: {
		padding: '30px 0',
		borderTop: '1px solid #475768'
	},
	footer: {
		width: '100%',
		'& button': {
			marginRight: '30px'
		}
	}
});

class BankAccountsPaymentCompleteContainer extends Component {
	async componentWillMount() {
		const authenticated = true;

		if (this.props.rpShouldUpdate) {
			await this.props.dispatch(
				kycOperations.loadRelyingParty('incorporations', authenticated)
			);
		}
	}

	async componentDidMount() {
		this.saveTransactionHash();
		this.clearRelyingParty();
	}

	// TODO: move to common marketplace component
	analyticsEvent = () => {
		const { transaction, accountType } = this.props;
		ReactPiwik.push([
			'addEcommerceItem',
			accountType.accountCode,
			accountType.region,
			'Bank Accounts',
			accountType.price,
			1
		]);

		ReactPiwik.push(['trackEcommerceOrder', transaction.transactionHash, accountType.price]);
	};

	// TODO: move to common marketplace component
	saveTransactionHash = async () => {
		const { currentApplication, transaction, accountType } = this.props;

		console.log(currentApplication, transaction, accountType);

		if (currentApplication && transaction) {
			const application = currentApplication;
			await this.props.dispatch(
				kycOperations.updateRelyingPartyKYCApplicationPayment(
					'incorporations',
					application.id,
					transaction.transactionHash
				)
			);

			await this.props.dispatch(
				kycOperations.updateApplicationsOperation({
					id: application.id,
					payments: {
						amount: accountType.price,
						amountKey: transaction.amount,
						transactionHash: transaction.transactionHash,
						date: Date.now(),
						status: 'Sent KEY'
					}
				})
			);
		} else {
			// TODO: what to do if no transaction or currentApplication exists?
		}
	};

	// TODO: move to common marketplace component
	clearRelyingParty = async () => {
		await this.props.dispatch(kycOperations.clearRelyingPartyOperation());
	};

	getCancelRoute = () => {
		const { accountCode, countryCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/details/${accountCode}/${countryCode}/${templateId}`;
	};

	getNextRoute = () => {
		const { accountCode, countryCode, templateId } = this.props.match.params;
		return `${MARKETPLACE_BANK_ACCOUNTS_ROOT_PATH}/select-bank/${accountCode}/${countryCode}/${templateId}`;
	};

	onBackClick = () => this.props.dispatch(push(this.getCancelRoute()));

	onContinueClick = () => this.props.dispatch(push(this.getNextRoute()));

	render() {
		const { classes } = this.props;

		return (
			<div className={classes.container}>
				<CloseButtonIcon onClick={this.onBackClick} className={classes.closeIcon} />
				<Grid
					container
					justify="flex-start"
					alignItems="flex-start"
					className={classes.containerHeader}
				>
					<Typography variant="body2" gutterBottom className="region">
						Payment Received
					</Typography>
				</Grid>
				<div className={classes.contentContainer}>
					<Grid
						container
						justify="flex-start"
						alignItems="flex-start"
						className={classes.content}
					>
						<div className={classes.icon}>
							<HourGlassLargeIcon />
						</div>
						<div className={classes.content}>
							<div className={classes.description}>
								<Typography variant="h1" gutterBottom>
									Bank Account KYC Process Started
								</Typography>
								<Typography variant="body1" gutterBottom>
									Thank you for payment!
								</Typography>
								<Typography variant="body2" gutterBottom>
									Please click the continue button and select your preferred Bank
									to continue the process. If you have any questions in the
									meantime, you can reach us at:
								</Typography>
								<Typography
									variant="body2"
									color="primary"
									gutterBottom
									className="email"
								>
									support@flagtheory.com
								</Typography>
							</div>
							<div className={classes.instructions} style={{ display: 'none' }}>
								<Typography variant="subtitle2" color="secondary" gutterBottom>
									The application is available to you at any point under the
									marketplace applications tab, in your SelfKey ID Profile.
								</Typography>
							</div>
							<div className={classes.footer}>
								<Button
									variant="contained"
									size="large"
									onClick={this.onContinueClick}
								>
									Continue
								</Button>
							</div>
						</div>
					</Grid>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	const { accountCode } = props.match.params;
	const authenticated = true;
	return {
		accountType: bankAccountsSelectors.getTypeByAccountCode(state, accountCode),
		banks: bankAccountsSelectors.getDetailsByAccountCode(state, accountCode),
		transaction: transactionSelectors.getTransaction(state),
		publicKey: getWallet(state).publicKey,
		currentApplication: kycSelectors.selectCurrentApplication(state),
		rp: kycSelectors.relyingPartySelector(state, 'incorporations'),
		rpShouldUpdate: kycSelectors.relyingPartyShouldUpdateSelector(
			state,
			'incorporations',
			authenticated
		)
	};
};

const styledComponent = withStyles(styles)(BankAccountsPaymentCompleteContainer);
const connectedComponent = connect(mapStateToProps)(styledComponent);
export { connectedComponent as BankAccountsPaymentCompleteContainer };
