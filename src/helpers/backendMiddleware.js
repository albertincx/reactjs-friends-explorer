import { LOCATION_CHANGE } from 'react-router-redux'

const API_HOST = 'http://localhost:8000/'
const secret = '?secrets_k=123123'
let timeoutHandler

function getHistoryState (history, key) {
  const {state} = history.location
  return false
  if (history.action === 'POP' && state && state.hasOwnProperty(key)) {
    return state
  }
  return false
}

export const backendMiddleware = (history) => {
  return ({dispatch}) => (next) => (action) => {
    switch (action.type) {

      case LOCATION_CHANGE : {
        console.log(history.action)
        if (history.action === 'POP') {
          let items = [], search = {}

          if (action.payload && action.payload.state && action.payload.state.items) {
            items = action.payload.state.items
            search = action.payload.state.search
            //search.success = true
          }
          console.log(history.action, items.length)
          if (items.length) {
            //dispatch({type: 'search_success', items, search, success: true})
          }
        }

        break
      }/**/

      case 'get_user' : {
        const {historyState} = history.location

        fetch(`${API_HOST}search/${action.id}${secret}`, {
          headers: {'Content-Type': 'application/json'}
        })
          .then(res => {
            if (res.status !== 200) {
              throw 'Not Found'
            } else {
              return res.json()
            }
          }).then(user => {
          //console.log(location)
          if (!location.search) {
            // console.log(history)
            //history.replace(location.pathname, {...historyState, user, id: action.id})
            // console.log({...historyState, user, id: action.id})
          }
          dispatch({type: 'user_success', user})
        }).catch(e => {
          dispatch({type: 'user_error', message: e.toString()})
        })

        break
      }

      case 'search' : {
        const {historyState} = history.location

        let hasTexts = ''
        let search = action.search ? action.search : action.state.search
        console.log(search)
        const query = Object.keys(search).map(function (k) {
          if (/text|company|age_from|age_to/.test(k)) hasTexts += search[k]
          return encodeURIComponent(k) + '=' + encodeURIComponent(search[k])
        }).join('&')

        const hash = query.replace(/(&?)(user|skip)=[0-9]+/g, '')

        if (timeoutHandler) {
          clearTimeout(timeoutHandler)
        }

        //const time = search.skip || !hasTexts ? 10 : 300

        //timeoutHandler = setTimeout(() => {

        fetch(`${API_HOST}search${secret}&${query}`, {
          headers: {'Content-Type': 'application/json'}
        })
          .then(res => {

            if (res.status !== 200) {
              // throw 'Not Found'
            } else {
              return res.json()
            }

          }).then(items => {

          const resultState = {type: 'search_success', items, search}

          if (search.skip) {
            resultState['skip'] = search.skip
          }
          dispatch(resultState)

          if (hash && (
              !location.search || hash !== location.search.substr(1)
            )) {
            console.log(hash, location.search)
            history.push('?' + hash, {...historyState, ...resultState})
          }
        }).catch(e => {
          dispatch({type: 'search_error', message: e.toString(), hash})
        })

        //}, time)

        break
      }
      case 'clear' :
        if (action.search) {
          Object.keys(action.search).map(function (k) {
            delete action.search[k]
          })
        }
        dispatch({
          type: 'clear_success',
          items: [],
          search: action.search
        })
        break

      default:
        break
    }
    return next(action)
  }
}