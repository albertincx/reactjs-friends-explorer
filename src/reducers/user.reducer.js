import { LOCATION_CHANGE } from 'react-router-redux'

const initialState = {
  success: false,
  user: {},
  initial: true
}

export function user (state = initialState, action) {

  switch (action.type) {
    case LOCATION_CHANGE: {

      if (action.payload.state
        && !state.initial
        && action.payload.state.user) {

        const {user} = action.payload.state

        return {
          history: true,
          success: true,
          user
        }
      }

      break
    }
    case 'user_success': {
      state = {
        success: true,
        ...action,
      }
      break
    }
    case 'user_error': {
      state = {
        success: true,
        user: {},
      }
      break
    }
    default:
      break
  }
  return state
}
