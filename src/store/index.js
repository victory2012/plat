/* eslint-disable */
import Vuex from 'vuex';

import defaultState from './state/state';
import mutations from './mutations/mutation';
import getters from './getters/getters';
import actions from './actions/actions';

import monMutations from './mutations/mon-mutation';
import monGetters from './getters/mon-getters';
import monActions from './actions/mon-actions';
import monState from './state/mon-state';

import trackMutations from './mutations/track-mutation';
import trackGetters from './getters/track-getters';
import trackActions from './actions/track-actions';
import trackState from './state/track-state';

const isDev = process.env.NODE_ENV === 'development';
export default () => {
  return new Vuex.Store({
    strict: isDev,
    state: defaultState,
    mutations,
    getters,
    actions,
    modules: {
      monitor: {
        namespaced: true,
        state: monState,
        mutations: monMutations,
        getters: monGetters,
        actions: monActions
      },
      track: {
        namespaced: true,
        state: trackState,
        mutations: trackMutations,
        getters: trackGetters,
        actions: trackActions
      }
    }
  });
};
