import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { addressBookSelectors, addressBookOperations } from 'common/address-book';
import {
	CopyIcon,
	DeleteIcon,
	EditTransparentIcon,
	AddressBookIcon,
	SmallTableHeadRow
} from 'selfkey-ui';
import { withStyles } from '@material-ui/core/styles';
import {
	Grid,
	Typography,
	Button,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	IconButton
} from '@material-ui/core';

import { push } from 'connected-react-router';

const styles = theme => ({
	button: {
		height: '44px',
		width: '180px',
		border: '2px solid #1CA9BA',
		borderRadius: '3px',
		boxShadow: 'inset 3px 3px 10px 0 rgba(0,0,0,0.1)',
		color: '#1CA9BA',
		fontSize: '16px',
		fontWeight: 'bold',
		letterSpacing: '0.67px',
		lineHeight: '19px',
		textAlign: 'center'
	},

	descriptionText: {
		color: '#93B0C1',
		fontSize: '18px',
		lineHeight: '28px',
		textAlign: 'center'
	}
});

class AddressBookContainer extends Component {
	state = {
		addresses: []
	};

	componentDidMount() {
		this.props.dispatch(addressBookOperations.loadAddressBook());
	}

	componentDidUpdate(prevProps) {
		if (prevProps.addresses !== this.props.addresses) {
			this.setState({
				...this.state,
				addresses: this.props.addresses
			});
		}
	}

	handleAdd = () => {
		this.props.dispatch(push('addressBookAdd'));
	};

	handleEdit = id => {
		this.props.dispatch(push(`addressBookEdit/${id}`));
	};

	handleDelete = id => {
		this.props.dispatch(addressBookOperations.deleteAddressBookEntry(id));
	};

	render() {
		const { classes } = this.props;
		const { addresses } = this.state;
		return (
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="center"
				spacing={32}
			>
				<Grid item>
					<AddressBookIcon />
				</Grid>
				<Grid item>
					<Typography variant="h1">Address Book</Typography>
				</Grid>
				<Grid item xs={6}>
					<Typography variant="body1" className={classes.descriptionText}>
						Create and assign labels to save commonly used Ethereum addresses when
						sending assets from the SelfKey Identity Wallet.
					</Typography>
				</Grid>
				<Grid item>
					<Button
						id="addAddressButton"
						className={classes.button}
						onClick={this.handleAdd}
					>
						ADD ADDRESS
					</Button>
				</Grid>
				<Grid item xs={12}>
					<Table>
						<TableHead>
							<SmallTableHeadRow>
								<TableCell>
									<Typography variant="overline">Label</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="overline">Eth Address</Typography>
								</TableCell>
								<TableCell>
									<Typography variant="overline">Actions</Typography>
								</TableCell>
							</SmallTableHeadRow>
						</TableHead>
						<TableBody>
							{addresses &&
								addresses.map(address => {
									return (
										<TableRow key={address.id}>
											<TableCell id={address.id}>
												<Typography variant="h6">
													{address.label}
												</Typography>
											</TableCell>
											<TableCell>
												<Typography variant="h6">
													{address.address}
												</Typography>
											</TableCell>
											<TableCell>
												<Grid
													container
													direction="row"
													justify="flex-start"
													alignItems="center"
												>
													<Grid item>
														<IconButton>
															<CopyToClipboard text={address.address}>
																<CopyIcon />
															</CopyToClipboard>
														</IconButton>
													</Grid>
													<Grid item>
														<IconButton
															id="editButton"
															onClick={() =>
																this.handleEdit(address.id)
															}
														>
															<EditTransparentIcon />
														</IconButton>
													</Grid>
													<Grid item>
														<IconButton
															id="deleteButton"
															onClick={() =>
																this.handleDelete(address.id)
															}
														>
															<DeleteIcon />
														</IconButton>
													</Grid>
												</Grid>
											</TableCell>
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</Grid>
			</Grid>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		addresses: addressBookSelectors.getAddresses(state)
	};
};

const styledComponent = withStyles(styles)(AddressBookContainer);
export default connect(mapStateToProps)(styledComponent);
