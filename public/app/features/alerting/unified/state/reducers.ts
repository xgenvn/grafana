import { combineReducers } from 'redux';
import { createAsyncMapSlice } from '../utils/redux';
import {
  fetchAlertManagerConfigAction,
  fetchPromRulesAction,
  fetchRulerRulesAction,
  fetchSilencesAction,
} from './actions';

export const reducer = combineReducers({
  promRules: createAsyncMapSlice('promRules', fetchPromRulesAction, (dataSourceName) => dataSourceName).reducer,
  rulerRules: createAsyncMapSlice('rulerRules', fetchRulerRulesAction, (dataSourceName) => dataSourceName).reducer,
  amConfigs: createAsyncMapSlice(
    'amConfigs',
    fetchAlertManagerConfigAction,
    (alertManagerSourceName) => alertManagerSourceName
  ).reducer,
  silences: createAsyncMapSlice('silences', fetchSilencesAction, (alertManagerSourceName) => alertManagerSourceName)
    .reducer,
});

export type UnifiedAlertingState = ReturnType<typeof reducer>;

export default reducer;
