import { legacy_createStore as createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';

function configureStore() {
    return createStore(rootReducer, compose(applyMiddleware(thunk)));
}

export const store = configureStore();
