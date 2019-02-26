import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, List, ListItem } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { incorporationsSelectors, incorporationsOperations } from 'common/incorporations';
import 'flag-icon-css/css/flag-icon.css';

const styles = theme => ({
	countryName: {
		textAlign: 'center',
		marginBottom: '2em'
	},
	details: {
		width: '50%',
		marginLeft: '0',
		'& h5': {
			fontWeight: 'normal',
			display: 'inline-block',
			fontSize: '14px'
		},
		'& div': {
			display: 'inline-block'
		},
		'& h5.value': {
			color: '#93B0C1',
			marginLeft: '1em',
			fontWeight: 'bold'
		}
	},
	countryInfo: {
		marginTop: '50px'
	},
	flag: {
		width: '45%',
		'& span': {
			float: 'right'
		}
	}
});

/* ==========================================================================
   Received props:
   ---------------
   countryCode: country two letter code
   country: data from api, returned from redux store
   isLoading: still loading data
   ==========================================================================
*/

class IncorporationsCountryInfo extends Component {
	componentDidMount() {
		if (!this.props.country) {
			this.props.dispatch(
				incorporationsOperations.loadIncorporationsCountryOperation(this.props.countryCode)
			);
		}
	}

	_renderLoadingScreen = () => (
		<Grid container justify="center" alignItems="center">
			<CircularProgress size={50} className={this.props.classes.loading} />
		</Grid>
	);

	render() {
		const { country, classes, translation } = this.props;

		// Troubleshooting log
		// console.log(country);

		if (!country) {
			return this._renderLoadingScreen();
		}

		return (
			<div>
				<Typography variant="h1" gutterBottom className={classes.countryName}>
					{country[0].name}
				</Typography>
				<Grid container justify="flex-start" alignItems="flex-start">
					<div className={classes.details}>
						<List>
							<ListItem>
								<Typography variant="h5" gutterBottom>
									Country Code
								</Typography>
								<Typography variant="h5" gutterBottom className="value">
									{country[0].code}
								</Typography>
							</ListItem>
							<ListItem>
								<Typography variant="h5" gutterBottom>
									Area
								</Typography>
								<Typography variant="h5" gutterBottom className="value">
									{country[0].areaInSqKm} km&sup2;
								</Typography>
							</ListItem>
							<ListItem>
								<Typography variant="h5" gutterBottom>
									Capital
								</Typography>
								<Typography variant="h5" gutterBottom className="value">
									{country[0].capital}
								</Typography>
							</ListItem>
							<ListItem>
								<Typography variant="h5" gutterBottom>
									Continent
								</Typography>
								<Typography variant="h5" gutterBottom className="value">
									{country[0].continentName}
								</Typography>
							</ListItem>
							<ListItem>
								<Typography variant="h5" gutterBottom>
									Currency
								</Typography>
								<Typography variant="h5" gutterBottom className="value">
									{country[0].currencyCode}
								</Typography>
							</ListItem>
							<ListItem>
								<Typography variant="h5" gutterBottom>
									Population
								</Typography>
								<Typography variant="h5" gutterBottom className="value">
									{country[0].population}
								</Typography>
							</ListItem>
						</List>
					</div>
					<div className={classes.flag}>
						<span
							style={{ display: 'block', fontSize: '200px' }}
							className={`flag-icon flag-icon-${country[0].code.toLowerCase()}`}
						/>
					</div>
				</Grid>
				<div className={classes.countryInfo}>
					<div
						dangerouslySetInnerHTML={{
							__html: translation['country_details']
						}}
					/>
				</div>
			</div>
		);
	}
}

IncorporationsCountryInfo.propTypes = {
	countryCode: PropTypes.string,
	isLoading: PropTypes.bool,
	country: PropTypes.any
};

const mapStateToProps = (state, props) => {
	return {
		country: incorporationsSelectors.getCountry(state, props.countryCode),
		isLoading: incorporationsSelectors.getLoading(state)
	};
};

const styledComponent = withStyles(styles)(IncorporationsCountryInfo);
export default connect(mapStateToProps)(styledComponent);
