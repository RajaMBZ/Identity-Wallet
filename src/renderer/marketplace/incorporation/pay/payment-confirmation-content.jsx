import React, { Component } from 'react';
import { Grid, withStyles, Typography, Button } from '@material-ui/core';

import { ExchangeLargeIcon } from 'selfkey-ui';

const styles = theme => ({
	footer: {
		marginTop: '30px',
		paddingTop: '30px',
		borderTop: '1px solid #475768'
	},
	actions: {
		'&>button': {
			marginRight: '20px',
			marginTop: '30px'
		}
	},
	bold: {
		fontWeight: 600
	},
	textRight: {
		textAlign: 'right'
	},
	bottomSpace: {
		marginBottom: '30px'
	}
});

class PaymentConfirmationContentComponent extends Component {
	render() {
		const {
			classes,
			txId,
			name,
			crypoCurrency,
			usdFee,
			ethFee,
			usdNetworkFee,
			ethNetworkFee,
			onConfirm,
			onCancel
		} = this.props;

		return (
			<Grid container direction="row" justify="flex-start" alignItems="flex-start">
				<Grid item xs={2}>
					<ExchangeLargeIcon />
				</Grid>
				<Grid item xs={10}>
					<Grid container direction="column" justify="flex-start" alignItems="stretch">
						<Grid item>
							<Typography variant="h1" gutterBottom>
								Payment Confirmation
							</Typography>
						</Grid>
						<Grid item className={classes.bottomSpace}>
							<Typography variant="subtitle2" color="secondary" gutterBottom>
								Transaction ID: {txId}
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="body1" gutterBottom>
								You are about to pay the following amount to {name}.<br />
								The payment will be done with {crypoCurrency} tokens, at the
								provided exchange rate.
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="subtitle2" color="secondary" gutterBottom>
								Do not have {crypoCurrency} Tokens yet? Learn how you can get them.
							</Typography>
						</Grid>
						<Grid item classes={{ item: classes.footer }}>
							<Grid container justify="space-between" className={classes.bottomSpace}>
								<Grid item>
									<Typography variant="h2">Cost</Typography>
								</Grid>
								<Grid item className={classes.textRight}>
									<Typography
										variant="body2"
										color="primary"
										className={classes.bold}
									>
										Total: ${usdFee.toLocaleString()}
									</Typography>
									<Typography variant="subtitle2" color="secondary" gutterBottom>
										{ethFee.toLocaleString()} {crypoCurrency} {'(icon)'}
									</Typography>
								</Grid>
							</Grid>
							<Grid container justify="space-between">
								<Grid item>
									<Typography variant="h3" color="secondary">
										Network Transaction Fee
									</Typography>
								</Grid>
								<Grid item className={classes.textRight}>
									<Typography
										variant="body2"
										color="primary"
										className={classes.bold}
									>
										${usdNetworkFee.toLocaleString()}
									</Typography>
									<Typography variant="subtitle2" color="secondary" gutterBottom>
										{ethNetworkFee.toLocaleString()} {crypoCurrency} {'(icon)'}
									</Typography>
								</Grid>
							</Grid>
							<div className={classes.actions}>
								<Button variant="contained" size="large" onClick={onConfirm}>
									Confirm
								</Button>
								<Button variant="outlined" size="large" onClick={onCancel}>
									Cancel
								</Button>
							</div>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

export const PaymentConfirmationContent = withStyles(styles)(PaymentConfirmationContentComponent);

export default PaymentConfirmationContent;
