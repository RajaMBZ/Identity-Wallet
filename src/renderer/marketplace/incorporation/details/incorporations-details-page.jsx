import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Button, Typography } from '@material-ui/core';
import { ApplicationStatusBar } from '../../../kyc/application/application-status';
import { CertificateIcon } from 'selfkey-ui';
import { FlagCountryName, ResumeBox, ProgramPrice, MarketplaceKycRequirements } from '../../common';
import { IncorporationsDetailsTabs } from './incorporations-details-tabs';

const styles = theme => ({
	container: {
		width: '100%',
		margin: '50px auto 0',
		maxWidth: '960px'
	},
	backButtonContainer: {
		left: '75px',
		position: 'absolute'
	},
	bold: {
		fontWeight: 600
	},
	title: {
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
	contentContainer: {
		border: '1px solid #303C49',
		borderRadius: '4px'
	},
	content: {
		background: '#262F39',
		padding: '22px 30px',
		width: '100%',
		justifyContent: 'space-between',
		boxSizing: 'border-box',
		margin: 0
	},
	applyButton: {
		maxWidth: '270px',
		textAlign: 'right',
		'& button': {
			width: '100%',
			marginBottom: '1em'
		},
		'& div.price': {
			fontFamily: 'Lato, arial, sans-serif',
			fontSize: '16px',
			fontWeight: 'bold',
			color: '#00C0D9'
		},
		'& span.price-key': {
			color: '#93B0C1',
			fontFamily: 'Lato, arial, sans-serif',
			fontSize: '12px',
			display: 'block',
			fontWeight: 'normal',
			marginTop: '5px'
		}
	},
	certificateIcon: {
		marginRight: '18px'
	}
});

export const IncorporationsApplicationButton = withStyles(styles)(
	({ classes, canIncorporate, startApplication, loading }) => (
		<React.Fragment>
			{canIncorporate && !loading && (
				<Button variant="contained" size="large" onClick={startApplication}>
					<CertificateIcon className={classes.certificateIcon} />
					Incorporate Now
				</Button>
			)}

			{canIncorporate && loading && (
				<Button variant="contained" size="large" disabled>
					Loading ...
				</Button>
			)}
		</React.Fragment>
	)
);

export const IncorporationsDetailsPage = withStyles(styles)(props => {
	const {
		classes,
		applicationStatus,
		countryCode,
		region,
		contact,
		resume,
		onStatusAction,
		onBack,
		loading,
		canIncorporate,
		startApplication,
		keyRate,
		price,
		tab,
		kycRequirements,
		templateId,
		onTabChange
	} = props;
	return (
		<Grid container>
			<Grid item>
				<div className={classes.backButtonContainer}>
					<Button variant="outlined" color="secondary" size="small" onClick={onBack}>
						<Typography variant="subtitle2" color="secondary" className={classes.bold}>
							‹ Back
						</Typography>
					</Button>
				</div>
			</Grid>
			<Grid item className={classes.container}>
				<Grid
					id="incorporationsDetails"
					container
					justify="flex-start"
					alignItems="flex-start"
					className={classes.title}
				>
					<div>
						<FlagCountryName code={countryCode} />
					</div>
					<Typography variant="body2" gutterBottom className="region">
						{region}
					</Typography>
				</Grid>
				<Grid container className={classes.contentContainer}>
					<ApplicationStatusBar
						status={applicationStatus}
						contact={contact}
						statusAction={onStatusAction}
						loading={loading}
					/>
					<Grid
						container
						direction="column"
						justify="flex-start"
						alignItems="stretch"
						spacing={40}
						className={classes.content}
					>
						<Grid item>
							<Grid
								container
								direction="row"
								justify="space-between"
								alignItems="flex-start"
							>
								<Grid item>
									<ResumeBox itemSets={resume} />
								</Grid>
								<Grid item className={classes.applyButton}>
									<IncorporationsApplicationButton
										canIncorporate={canIncorporate}
										price={price}
										loading={loading}
										startApplication={startApplication}
										keyRate={keyRate}
									/>
									<ProgramPrice
										id="fees"
										price={price}
										rate={keyRate}
										label="Pricing: $"
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid item>
							<IncorporationsDetailsTabs
								{...props}
								tab={tab}
								onTabChange={onTabChange}
							/>
						</Grid>
						<Grid item>
							<MarketplaceKycRequirements
								requirements={kycRequirements}
								loading={loading}
								templateId={templateId}
								title="KYC Requirements and Forms"
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Grid>
	);
});

export default IncorporationsDetailsPage;
