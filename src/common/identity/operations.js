import { walletSelectors, walletOperations } from '../wallet';
import { getGlobalContext } from '../context';
import { createAliasedAction } from 'electron-redux';
import { push } from 'connected-react-router';
import identitySelectors from './selectors';
import identityActions from './actions';
import identityTypes from './types';

const loadCountriesOperation = () => async (dispatch, getState) => {
	const countryService = getGlobalContext().countryService;
	const countries = await countryService.getCountries();
	await dispatch(identityActions.setCountriesAction(countries));
};

const loadRepositoriesOperation = () => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let repos = await identityService.loadRepositories();
	await dispatch(identityActions.setRepositoriesAction(repos));
};

const updateExpiredRepositoriesOperation = () => async (dispatch, getState) => {
	let expired = identitySelectors.selectExpiredRepositories(getState());
	const identityService = getGlobalContext().identityService;
	await identityService.updateRepositories(expired);
	await dispatch(operations.loadRepositoriesOperation());
};

const loadIdAttributeTypesOperation = () => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let attributeTypes = await identityService.loadIdAttributeTypes();
	await dispatch(identityActions.setIdAttributeTypesAction(attributeTypes));
};

const updateExpiredIdAttributeTypesOperation = () => async (dispatch, getState) => {
	let expired = identitySelectors.selectExpiredIdAttributeTypes(getState());
	const identityService = getGlobalContext().identityService;
	await identityService.updateIdAttributeTypes(expired);
	await dispatch(operations.loadIdAttributeTypesOperation());
};

const loadUiSchemasOperation = () => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let uiSchemas = await identityService.loadUiSchemas();
	await dispatch(identityActions.setUiSchemasAction(uiSchemas));
};

const updateExpiredUiSchemasOperation = () => async (dispatch, getState) => {
	let expired = identitySelectors.selectExpiredUiSchemas(getState());
	const identityService = getGlobalContext().identityService;
	await identityService.updateUiSchemas(expired);
	await dispatch(operations.loadUiSchemasOperation());
};

const loadDocumentsOperation = identityId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let documents = await identityService.loadDocuments(identityId);
	documents = documents.map(doc => ({ ...doc, identityId }));
	await dispatch(identityActions.setDocumentsAction(identityId, documents));
};

const loadIdAttributesOperation = identityId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let attributes = await identityService.loadIdAttributes(identityId);
	await dispatch(identityActions.setIdAttributesAction(identityId, attributes));
};

const loadDocumentsForAttributeOperation = attrId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let documents = await identityService.loadDocumentsForAttribute(attrId);
	await dispatch(identityActions.setDocumentsForAttributeAction(attrId, documents));
};

const removeDocumentOperation = documentId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	await identityService.removeDocument(documentId);
	await dispatch(identityActions.deleteDocumentAction(documentId));
};

const createIdAttributeOperation = attribute => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	// TODO: XXX fix wallet selector
	const wallet = walletSelectors.getWallet(getState());
	const walletId = attribute.walletId || wallet.id;
	attribute = { ...attribute, walletId };
	attribute = await identityService.createIdAttribute(attribute);
	await dispatch(operations.loadDocumentsForAttributeOperation(attribute.id));
	await dispatch(identityActions.addIdAttributeAction(attribute));
};

const removeIdAttributeOperation = attributeId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	await identityService.removeIdAttribute(attributeId);
	await dispatch(identityActions.deleteDocumentsForAttributeAction(attributeId));
	await dispatch(identityActions.deleteIdAttributeAction(attributeId));
};

const editIdAttributeOperation = attribute => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	await identityService.editIdAttribute(attribute);
	await dispatch(operations.loadDocumentsForAttributeOperation(attribute.id));
	await dispatch(identityActions.updateIdAttributeAction(attribute));
};

const updateProfilePictureOperation = (picture, identityId) => (dispatch, getState) => {
	return dispatch(walletOperations.updateWalletAvatar(picture, identityId));
};

const lockIdentityOperation = identityId => async (dispatch, getState) => {
	await dispatch(identityOperations.setCurrentIdentityAction(null));
	await dispatch(identityActions.deleteIdAttributesAction(identityId));
	await dispatch(identityActions.deleteDocumentsAction(identityId));
};
const unlockIdentityOperation = identityId => async (dispatch, getState) => {
	await dispatch(identityOperations.loadDocumentsOperation(identityId));
	await dispatch(identityOperations.loadIdAttributesOperation(identityId));
	await dispatch(identityOperations.setCurrentIdentityAction(identityId));
};

const createSelfkeyIdOperation = (walletId, data) => async (dispatch, getState) => {
	const idAttributeTypes = identitySelectors.selectIdAttributeTypes(getState());
	const getTypeId = url => {
		return idAttributeTypes.find(idAttributeType => idAttributeType.url === url).id;
	};
	// TODO: XXX update to entity operations
	await dispatch(walletOperations.updateWalletName(data.nickName, walletId));

	await dispatch(
		identityOperations.createIdAttributeOperation({
			typeId: getTypeId('http://platform.selfkey.org/schema/attribute/first-name.json'),
			name: 'First Name',
			data: { value: data.firstName }
		})
	);

	await dispatch(
		identityOperations.createIdAttributeOperation({
			typeId: getTypeId('http://platform.selfkey.org/schema/attribute/last-name.json'),
			name: 'Last Name',
			data: { value: data.lastName }
		})
	);

	await dispatch(
		identityOperations.createIdAttributeOperation({
			typeId: getTypeId('http://platform.selfkey.org/schema/attribute/email.json'),
			name: 'Email',
			data: { value: data.email }
		})
	);

	await dispatch(walletOperations.updateWalletSetup(true, walletId));

	await dispatch(push('/selfkeyIdCreateAbout'));
};

const loadIdentitiesOperation = walletId => async (dispatch, getState) => {
	let identityService = getGlobalContext().identityService;
	let identities = await identityService.loadIdentities(walletId);
	return dispatch(identityActions.setIdentitiesAction(identities));
};

export const operations = {
	loadCountriesOperation,
	loadRepositoriesOperation,
	updateExpiredRepositoriesOperation,
	loadIdAttributeTypesOperation,
	updateExpiredIdAttributeTypesOperation,
	loadUiSchemasOperation,
	updateExpiredUiSchemasOperation,
	loadDocumentsOperation,
	loadIdAttributesOperation,
	loadDocumentsForAttributeOperation,
	removeDocumentOperation,
	createIdAttributeOperation,
	removeIdAttributeOperation,
	editIdAttributeOperation,
	unlockIdentityOperation,
	lockIdentityOperation,
	updateProfilePictureOperation,
	createSelfkeyIdOperation,
	loadIdentitiesOperation
};

export const identityOperations = {
	...identityActions,
	loadRepositoriesOperation: createAliasedAction(
		identityTypes.IDENTITY_REPOSITORIES_LOAD,
		operations.loadRepositoriesOperation
	),
	updateExpiredRepositoriesOperation: createAliasedAction(
		identityTypes.IDENTITY_REPOSITORIES_UPDATE_REMOTE,
		operations.updateExpiredRepositoriesOperation
	),
	loadIdAttributeTypesOperation: createAliasedAction(
		identityTypes.IDENTITY_ID_ATTRIBUTE_TYPES_LOAD,
		operations.loadIdAttributeTypesOperation
	),
	updateExpiredIdAttributeTypesOperation: createAliasedAction(
		identityTypes.IDENTITY_ID_ATTRIBUTE_TYPES_UPDATE_REMOTE,
		operations.updateExpiredIdAttributeTypesOperation
	),
	loadUiSchemasOperation: createAliasedAction(
		identityTypes.IDENTITY_UI_SCHEMAS_LOAD,
		operations.loadUiSchemasOperation
	),
	updateExpiredUiSchemasOperation: createAliasedAction(
		identityTypes.IDENTITY_UI_SCHEMAS_UPDATE_REMOTE,
		operations.updateExpiredUiSchemasOperation
	),
	loadDocumentsOperation: createAliasedAction(
		identityTypes.IDENTITY_DOCUMENTS_LOAD,
		operations.loadDocumentsOperation
	),
	loadIdAttributesOperation: createAliasedAction(
		identityTypes.IDENTITY_ATTRIBUTES_LOAD,
		operations.loadIdAttributesOperation
	),
	loadDocumentsForAttributeOperation: createAliasedAction(
		identityTypes.IDENTITY_ATTRIBUTE_DOCUMENTS_LOAD,
		operations.loadDocumentsForAttributeOperation
	),
	removeDocumentOperation: createAliasedAction(
		identityTypes.IDENTITY_DOCUMENT_REMOVE,
		operations.removeDocumentOperation
	),
	createIdAttributeOperation: createAliasedAction(
		identityTypes.IDENTITY_ATTRIBUTE_CREATE,
		operations.createIdAttributeOperation
	),
	editIdAttributeOperation: createAliasedAction(
		identityTypes.IDENTITY_ATTRIBUTE_EDIT,
		operations.editIdAttributeOperation
	),
	removeIdAttributeOperation: createAliasedAction(
		identityTypes.IDENTITY_ATTRIBUTE_REMOVE,
		operations.removeIdAttributeOperation
	),
	unlockIdentityOperation: createAliasedAction(
		identityTypes.IDENTITY_UNLOCK,
		operations.unlockIdentityOperation
	),
	lockIdentityOperation: createAliasedAction(
		identityTypes.IDENTITY_LOCK,
		operations.lockIdentityOperation
	),
	updateProfilePictureOperation: createAliasedAction(
		identityTypes.PROFILE_PICTURE_UPDATE,
		operations.updateProfilePictureOperation
	),
	loadCountriesOperation: createAliasedAction(
		identityTypes.IDENTITY_COUNTRIES_LOAD,
		operations.loadCountriesOperation
	),
	createSelfkeyIdOperation: createAliasedAction(
		identityTypes.IDENTITY_SELFKEY_ID_CREATE,
		operations.createSelfkeyIdOperation
	),
	loadIdentitiesOperation: createAliasedAction(
		identityTypes.IDENTITIES_LOAD,
		operations.loadIdentitiesOperation
	)
};

export default identityOperations;
