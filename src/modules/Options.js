import {createAction, handleActions} from 'redux-actions';
import update from 'immutability-helper';

const THEME = 'OPTIONS/THEME';
const COLOR = 'OPTIONS/COLOR';

export const theme = createAction(THEME);

const initialState = {
    theme: '',
    color: ''
};

export default handleActions({
    [THEME]: (state, action) => {
        return update(state, {
           theme: {
               $set: action.theme
           }
        });
    }
}, initialState);

