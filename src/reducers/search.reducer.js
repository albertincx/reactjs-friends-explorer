import { LOCATION_CHANGE } from 'react-router-redux'

const initialState = {
  search: {}, items: [], initial: true /*reload state on refresh*/
}

/* force set state.search from URL */
if (location.search) {
  let search = location.search.substring(1)
  try {
    initialState.search = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
  } catch (e) {}
}

export function search (state = initialState, action) {
  if (!/@@redux/.test(action.type)) console.log(`%c action`, `color: #03A9F4`, action)

  switch (action.type) {

    case LOCATION_CHANGE: {

      let historyItems = [],
        historySearch = state.initial ? state.search : {},
        historyUser = {},
        history = action.payload.state && !state.initial

      if (history) {
        const {
          items,
          search,
          user,
        } = action.payload.state
        if (items) historyItems = items
        historySearch = search
        historyUser = user
      }

      return {
        history,
        success: true,
        items: historyItems,
        search: historySearch,
        user: historyUser,
      }
    }

    case 'search':
      let stateSearch = {}
      if (state.success && action.search) {
        state.search = action.search
        stateSearch = action.search
      }
      return {
        search: stateSearch,
        skip: action.search ? action.search.skip : '',
        items: []
      }
    case 'search_success':
      return {
        success: true,
        ...action
      }

    default:
      break
  }

  return state
}