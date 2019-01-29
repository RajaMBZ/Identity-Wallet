export const incorporationsSelectors = {
	getIncorporations(state) {
		return state.incorporations;
	},
	getLoading(state) {
		return this.getIncorporations(state).loading;
	},
	getError(state) {
		return this.getIncorporations(state).error;
	},
	getMainIncorporations(state) {
		const tree = this.getIncorporations(state);
		return tree.incorporations.map(incId => tree.incorporationsById[incId]);
	},
	getTaxes(state) {
		const tree = this.getIncorporations(state);
		return tree.taxes.map(taxId => tree.taxesById[taxId]);
	},
	getTaxByCompanyCode(state, companyCode) {
		return this.getTaxes(state).find(tax => tax['Company code'] === companyCode);
	},
	getTranslation(state) {
		const tree = this.getIncorporations(state);
		return tree.translation.map(id => tree.translationById[id]);
	},
	getTranslationByCompanyCode(state, companyCode) {
		return this.getTranslation(state).find(t => t['Company code'] === companyCode);
	},
	getMainIncorporationByCompanyCode(state, companyCode) {
		return this.getMainIncorporations(state).find(inc => inc['Company code'] === companyCode);
	},
	getCorporations(state) {
		const tree = this.getIncorporations(state);
		return tree.corporations.map(id => tree.corporationsById[id]);
	},
	getCorporationsByCompanyCode(state, companyCode) {
		return this.getCorporations(state).find(c => c['Company code'] === companyCode);
	},
	getLLCs(state) {
		const tree = this.getIncorporations(state);
		return tree.llcs.map(id => tree.llcsById[id]);
	},
	getLLCsByCompanyCode(state, companyCode) {
		return this.getLLCs(state).find(c => c['Company code'] === companyCode);
	},
	getFoundations(state) {
		const tree = this.getIncorporations(state);
		return tree.foundations.map(id => tree.foundationsById[id]);
	},
	getFoundationsByCompanyCode(state, companyCode) {
		return this.getFoundations(state).find(c => c['Company code'] === companyCode);
	},
	getTrusts(state) {
		const tree = this.getIncorporations(state);
		return tree.trusts.map(id => tree.trustsById[id]);
	},
	getTrustsByCompanyCode(state, companyCode) {
		return this.getTrusts(state).find(c => c['Company code'] === companyCode);
	},
	getDetailsForCompanyCode(state, companyCode) {
		let data = this.getCorporationsByCompanyCode(state, companyCode);
		if (!data) {
			data = this.getLLCsByCompanyCode(state, companyCode);
		} else if (!data) {
			data = this.getFoundationsByCompanyCode(state, companyCode);
		} else {
			data = this.getTrustsByCompanyCode(state, companyCode);
		}
		return data;
	},
	getMainIncorporationsWithTaxes(state) {
		return this.getMainIncorporations(state).map(inc => ({
			...inc,
			tax: this.getTaxByCompanyCode(state, inc['Company code']) || {}
		}));
	},
	getIncorporationsDetails(state, companyCode) {
		const inc = this.getMainIncorporationByCompanyCode(state, companyCode);
		inc.tax = this.getTaxByCompanyCode(state, companyCode);
		inc.translation = this.getTranslationByCompanyCode(state, companyCode);
		inc.details = this.getDetailsForCompanyCode(state, companyCode);

		return inc;
	}
};

// export const getIncorporationsTree = state => {
// 	return state.incorporations;
// };

// const getTaxForCompanyCode = (taxArray, code) => {
// 	return taxArray.find(e => {
// 		return e.data.fields['Company code'] === code;
// 	});
// };

// const getProgramForCompanyCode = (corpArray, foundArray, trustArray, code) => {
// 	console.log(code, corpArray);
// 	let program = corpArray.find(e => {
// 		return e.data.fields['Company code'] === code;
// 	});

// 	if (!program) {
// 		program = foundArray.find(e => {
// 			return e.data.fields['Company code'] === code;
// 		});

// 		if (!program) {
// 			program = trustArray.find(e => {
// 				return e.data.fields['Company code'] === code;
// 			});
// 		}
// 	}
// 	console.log(program);

// 	return program;
// };

// const getTranslationForCompanyCode = (transArray, code) => {
// 	return transArray.find(e => {
// 		return e.data.fields['Company code'] === code;
// 	});
// };

// const getTaxFieldForCompanyCode = (taxArray, code, field) => {
// 	const tax = getTaxForCompanyCode(taxArray, code);
// 	return tax ? tax.data.fields[field] : false;
// };

export default incorporationsSelectors;
