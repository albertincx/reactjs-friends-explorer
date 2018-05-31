import { LOCATION_CHANGE } from 'react-router-redux'

const initialState = {
  success: false,
  user: {}
}

export function user (state = initialState, action) {

  switch (action.type) {
    case LOCATION_CHANGE: {
      if (action.payload.state) {
        const {
          user: historyUser,
        } = action.payload.state

        if (historyUser) {
          return {
            history: true,
            success: true,
            user: historyUser ? historyUser : {},
          }
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
