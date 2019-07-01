import _ from 'lodash';
import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletSelectors } from '../wallet';
import { push } from 'connected-react-router';
// import config from '../config';
// import { Logger } from 'common/logger';

// const log = new Logger('orders-redux');

const MARKETPLACE_ORDERS_ROOT_PATH = '/main/marketplace-orders';

export const orderStatus = {
	PENDING: 'PENDING',
	COMPLETE: 'ORDER_COMPLETE',
	CANCELED: 'CANCELED',
	PAYMENT_COMPLETE: 'PAYMENT_COMPLETE',
	PAYMENT_IN_PROGRESS: 'PAYMENT_IN_PROGRESS',
	PAYMENT_ERROR: 'PAYMENT_ERROR',
	ALLOWANCE_IN_PROGRESS: 'ALLOWANCE_IN_PROGRESS',
	ALLOWANCE_COMPLETE: 'ALLOWANCE_COMPLETE',
	ALLOWANCE_ERROR: 'ALLOWANCE_ERROR'
};
// const ORDER_STATUS_CANCELED = 'CANCELED';

export const initialState = {
	all: [],
	byId: {},
	currentOrder: null
};

export const ordersTypes = {
	ORDERS_CREATE_OPERATION: 'orders/operations/CREATE',
	ORDERS_LOAD_OPERATION: 'orders/operations/LOAD',
	ORDERS_SET_ACTION: 'orders/actions/SET',
	ORDERS_UPDATE_ACTION: 'orders/actions/UPDATE',
	ORDERS_UPDATE_OPERATION: 'orders/operations/UPDATE',
	ORDERS_PAYMENT_START_OPERATION: 'orders/operations/payment/START',
	ORDERS_SET_CURRENT_ACTION: 'orders/actions/current/SET',
	ORDERS_SHOW_UI_OPERATION: 'orders/operations/ui/SHOW'
};

const ordersActions = {
	setOrdersAction: payload => ({
		type: ordersTypes.ORDERS_SET_ACTION,
		payload
	}),
	updateOrderAction: (id, update) => ({
		type: ordersTypes.ORDERS_UPDATE_ACTION,
		payload: { id, update }
	}),
	setCurrentOrderAction: payload => ({
		type: ordersTypes.ORDERS_SET_CURRENT_ACTION,
		payload
	})
};

const showOrderPaymentUIOperation = (orderId, backUrl, completeUrl) => async (
	dispatch,
	getState
) => {
	let order = ordersSelectors.getOrder(getState(), orderId);

	if (!order) {
		return dispatch(push(backUrl));
	}

	await dispatch(
		ordersActions.setCurrentOrder({
			orderId,
			backUrl,
			completeUrl
		})
	);

	if (order.status === orderStatus.COMPLETE) {
		return dispatch(push(completeUrl));
	}

	if (order.status === orderStatus.PAYMENT_COMPLETE) {
		return dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/${orderId}/payment/complete`));
	}

	if (order.status === orderStatus.PAYMENT_IN_PROGRESS) {
		return dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/${orderId}/payment/in-progress`));
	}

	if (order.status === orderStatus.PAYMENT_ERROR) {
		return dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/${orderId}/payment/error`));
	}

	await dispatch(ordersOperations.checkOrderAllowance(orderId));

	order = ordersSelectors.getOrder(getState(), orderId);

	if (order.status === orderStatus.PENDING) {
		return dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/${orderId}/allowance/`));
	}

	if (order.status === orderStatus.ALLOWANCE_IN_PROGRESS) {
		return dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/${orderId}/allowance/in-progress`));
	}

	if (order.status === orderStatus.ALLOWANCE_ERROR) {
		return dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/${orderId}/allowance/error`));
	}

	if (order.status === orderStatus.ALLOWANCE_COMPLETE) {
		return dispatch(push(`${MARKETPLACE_ORDERS_ROOT_PATH}/${orderId}/payment`));
	}
};

const ordersLoadOperation = () => async (dispatch, getState) => {
	const wallet = walletSelectors.getWallet(getState);
	const ordersService = getGlobalContext().marketplaceOrdersService;
	const orders = await ordersService.loadOrders(wallet.id);
	await dispatch(ordersActions.setOrdersAction(orders));
};

const ordersUpdateOperation = (id, update) => async (dispatch, getState) => {
	update = _.omit(update, 'walletId', 'id');
	const ordersService = getGlobalContext().marketplaceOrdersService;
	const order = await ordersService.updateOrder({ id, ...update });
	await dispatch(ordersActions.updateOrderAction(order));
};

const operations = {
	ordersLoadOperation,
	ordersUpdateOperation,
	showOrderPaymentUIOperation
};

const ordersOperations = {
	...ordersActions,
	ordersLoadOperation: createAliasedAction(
		ordersTypes.ORDERS_LOAD_OPERATION,
		operations.ordersLoadOperation
	),
	ordersUpdateOperation: createAliasedAction(
		ordersTypes.ORDERS_UPDATE_OPERATION,
		operations.ordersUpdateOperation
	),
	showOrderPaymentUIOperation: createAliasedAction(
		ordersTypes.ORDERS_SHOW_UI_OPERATION,
		operations.showOrderPaymentUIOperation
	)
};

const ordersReducers = {
	ordersSetReducer: (state, action) => {
		const { payload } = action;
		const all = payload.map(order => order.id);
		const byId = payload.reduce((acc, curr) => {
			acc[curr.id] = curr;
			return acc;
		}, {});

		return { ...state, all, byId };
	}
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case ordersTypes.ORDERS_SET_ACTION:
			return ordersReducers.ordersSetReducer(state, action);
	}
	return state;
};

const ordersSelectors = {};

export { ordersSelectors, ordersReducers, ordersActions, ordersOperations };

export default reducer;
