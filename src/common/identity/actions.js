import identityTypes from './types';

export const identityActions = {
	setCountriesAction: countries => ({
		type: identityTypes.IDENTITY_COUNTRIES_SET,
		payload: countries
	}),
	setRepositoriesAction: repos => ({
		type: identityTypes.IDENTITY_REPOSITORIES_SET,
		payload: repos
	}),
	setIdAttributeTypesAction: attributeTypes => ({
		type: identityTypes.IDENTITY_ID_ATTRIBUTE_TYPES_SET,
		payload: attributeTypes
	}),
	setUiSchemasAction: uiSchemas => ({
		type: identityTypes.IDENTITY_UI_SCHEMAS_SET,
		payload: uiSchemas
	}),
	setDocumentsAction: (walletId, documents) => ({
		type: identityTypes.IDENTITY_DOCUMENTS_SET,
		payload: {
			walletId,
			documents
		}
	}),
	deleteDocumentsAction: walletId => ({
		type: identityTypes.IDENTITY_DOCUMENTS_DELETE,
		payload: walletId
	}),
	setIdAttributesAction: (walletId, attributes) => ({
		type: identityTypes.IDENTITY_ATTRIBUTES_SET,
		payload: {
			walletId,
			attributes
		}
	}),
	deleteIdAttributesAction: walletId => ({
		type: identityTypes.IDENTITY_ATTRIBUTES_DELETE,
		payload: walletId
	}),
	deleteIdAttributeAction: attributeId => ({
		type: identityTypes.IDENTITY_ATTRIBUTE_DELETE,
		payload: attributeId
	}),
	addIdAttributeAction: attribute => ({
		type: identityTypes.IDENTITY_ATTRIBUTE_ADD,
		payload: attribute
	}),
	setDocumentsForAttributeAction: (attributeId, documents) => ({
		type: identityTypes.IDENTITY_ATTRIBUTE_DOCUMENTS_SET,
		payload: { attributeId, documents }
	}),
	deleteDocumentsForAttributeAction: attributeId => ({
		type: identityTypes.IDENTITY_ATTRIBUTE_DOCUMENTS_DELETE,
		payload: attributeId
	}),
	addDocumentAction: attribute => ({
		type: identityTypes.IDENTITY_DOCUMENT_ADD,
		payload: attribute
	}),
	updateDocumentAction: attribute => ({
		type: identityTypes.IDENTITY_DOCUMENT_UPDATE,
		payload: attribute
	}),
	updateIdAttributeAction: attribute => ({
		type: identityTypes.IDENTITY_ATTRIBUTE_UPDATE,
		payload: attribute
	}),
	deleteDocumentAction: documentId => ({
		type: identityTypes.IDENTITY_DOCUMENT_DELETE,
		payload: documentId
	})
};

export default identityActions;
