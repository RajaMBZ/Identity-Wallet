'use strict';

const AppConfigConstant = {
    "APP_NAME": "IdentityWallet",
    "APP_TITLE": "Identity Wallet",
    "API_ENDPOINT": "http://localhost:8080/api",
    "DEFAULT_LANGUAGE": "en",
    "DEBUG": "true",
    "constants": {
        "localStorageKeys": {
            "APP_OPEN_COUNT": "APP_OPEN_COUNT",
            "USER_DOCUMENTS_STORAGE_PATH": "USER_DOCUMENTS_STORAGE_PATH",
            "LEGAL_TERMS_AND_CONDITIONS": "LEGAL_TERMS_AND_CONDITIONS",
            "SELECTED_LANGUAGE": "SELECTED_LANGUAGE",
            "SELECTED_PRIVATE_KEY": "SELECTED_PRIVATE_KEY"
        },
        "events": {
            "ON_ELECTRON_APP_READY": "ON_ELECTRON_APP_READY",
            "ON_CONFIG_READY": "ON_CONFIG_READY",
            "ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE_REQUEST": "ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE_REQUEST",
            "ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE": "ON_USER_DOCUMENTS_STORAGE_PATH_CHANGE"
        }
    }
};

export default AppConfigConstant;