/**
 * Combine reducer for mobile. Only add if something needed.
 */
import { combineReducers } from 'redux';
import { reducersComponent } from '.';

const appReducer = combineReducers({
    ...reducersComponent
});
const rootReducer = (state, action) => {
    return appReducer(state, action);
};
export default rootReducer;
