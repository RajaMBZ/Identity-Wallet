import React, { Component } from 'react';
import { Grid, Typography, Paper, Modal, Input, Button, InputAdornment } from '@material-ui/core';
import {
	SelfkeyLogo,
	ModalWrap,
	ModalHeader,
	ModalBody,
	DownloadIcon2,
	VisibilityOnIcon,
	VisibilityOffIcon
} from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { walletSelectors } from 'common/wallet';
import { Link } from 'react-router-dom';

const styles = theme => ({
	logo: {
		width: '50px',
		height: '65px'
	},
	container: {
		minHeight: '100vh'
	},
	parentGrid: {
		minHeight: '100vh'
	},
	downloadIcon: {
		width: '66px',
		height: '71px'
	},
	modalWrap: {
		border: 'none',
		backgroundColor: 'transparent'
	},
	logoSection: {
		paddingBottom: '50px'
	},
	button: {
		width: '100%'
	},
	input: {
		display: 'none'
	}
});

const main = props => <Link to="/main/dashboard" {...props} />;

class BackupPK extends Component {
	state = {
		inputType: 'password',
		visibilityComponent: <VisibilityOffIcon />
	};

	handleVisibility = event => {
		if (this.state.inputType === 'password') {
			this.setState({
				...this.state,
				inputType: 'text',
				visibilityComponent: <VisibilityOnIcon />
			});
		} else {
			this.setState({
				...this.state,
				inputType: 'password',
				visibilityComponent: <VisibilityOffIcon />
			});
		}
	};

	render() {
		const { classes } = this.props;
		return (
			<div>
				<Modal open={true}>
					<ModalWrap className={`${classes.modalWrap} modalWrap`}>
						<Grid
							container
							direction="column"
							justify="flex-start"
							alignItems="center"
							spacing={8}
							className={classes.logoSection}
						>
							<Grid item>
								<SelfkeyLogo className={classes.logo} />
							</Grid>
							<Grid item>
								<Typography variant="h1">SELFKEY</Typography>
							</Grid>
						</Grid>
						<Paper className="modalContent">
							<ModalHeader>
								<Typography variant="h6" id="modal-title">
									Step 4: Backup Your Private Keys
								</Typography>
							</ModalHeader>

							<ModalBody>
								<Grid
									container
									direction="row"
									justify="flex-start"
									alignItems="flex-start"
								>
									<Grid item xs={2}>
										<DownloadIcon2 className={classes.downloadIcon} />
									</Grid>
									<Grid item xs={10}>
										<Typography variant="body1" gutterBottom>
											Your private key is used to authorize transactions for
											sending Ether or tokens on your Ethereum address. Do not
											share this with anyone, as this will give them full
											access to move your assets somewhere else. You can print
											a copy to make an offline backup. This is also known as
											&#34;cold storage&#34;.
										</Typography>
										<br />
										<br />
										<Typography variant="subtitle1" gutterBottom>
											Your Private Key
										</Typography>
										<Input
											fullWidth
											disableUnderline={true}
											value={this.props.privateKey}
											endAdornment={
												<InputAdornment position="start">
													<div onClick={this.handleVisibility}>
														{this.state.visibilityComponent}
													</div>
												</InputAdornment>
											}
											type={this.state.inputType}
											disabled
										/>
										<br />
										<br />
										<br />
										<br />
										<Button
											variant="contained"
											size="large"
											className={classes.button}
											onClick={e => window.print()}
										>
											PRINT MY PRIVATE KEY
										</Button>
										{this.state.showFileDownloadedResult &&
											this.showFileDownloadedResult()}
										<br />
										<br />
										<Button
											variant="outlined"
											color="secondary"
											component={main}
											size="large"
											className={classes.button}
										>
											MY PRIVATE KEY IS BACKED UP, CONTINUE
										</Button>
									</Grid>
								</Grid>
							</ModalBody>
						</Paper>
						<span className="printPK" style={{ display: 'none' }}>
							{this.props.privateKey}
						</span>
					</ModalWrap>
				</Modal>
				<style>{`@media print {.modalContent {display: none;} .printPK {display: block !important; text-align: center; color: #000000}}`}</style>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		privateKey: walletSelectors.getWallet(state).privateKey
	};
};

export default connect(mapStateToProps)(withStyles(styles)(BackupPK));