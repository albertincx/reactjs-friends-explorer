import { LOCATION_CHANGE } from 'react-router-redux'

const initialState = {
  search: {}, items: []
}

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

      let historyItems = [], historySearch = {}, historyUser = {}
      if (action.payload.state) {
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
        history: true,
        success: true,
        items: historyItems,
        search: historySearch,
        user: historyUser,
      }
    }

    case 'clear':
    case 'user_success': {
      state.loading = true
      return state
    }
    case 'search':
      let stateSearch = {}
      if (state.success && action.search) {
        state.search = action.search
        stateSearch = action.search
      }
      return {
        loading: true,
        search: stateSearch,
        skip: action.search ? action.search.skip : '',
        items: []
      }
    case 'user_success1': {
      state.search = {}
      break
    }
    case 'clear_success':
    case 'search_success':
      return {
        success: true,
        ...action
      }
    case 'restore_history': {
      return {
        success: true,
        items: action.items ? action.items : state.items,
        search: action.search ? action.search : state.search
      }
    }

    default:
      break
  }

  return state
}