const API_HOST = 'http://localhost:8000/'
const secret = '?secrets_k=123123'
let timeoutHandler

export const backendMiddleware = (history) => {
  return ({dispatch}) => (next) => (action) => {
    switch (action.type) {

      case 'get_user' : {

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
        const query = Object.keys(search).map(function (k) {
          if (/text|company|age_from|age_to/.test(k)) hasTexts += search[k]
          return encodeURIComponent(k) + '=' + encodeURIComponent(search[k])
        }).join('&')

        const hash = query.replace(/(&?)(user|skip)=[0-9]+/g, '')

        if (timeoutHandler) {
          clearTimeout(timeoutHandler)
        }

        const time = search.skip || !hasTexts ? 10 : 300

        timeoutHandler = setTimeout(() => {

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

            if (hash && (
                !location.search || hash !== location.search.substr(1)
              )) {
              history.push('?' + hash, {...historyState, ...resultState})
            } else {
              dispatch(resultState)
            }
          }).catch(e => {
            dispatch({type: 'search_error', message: e.toString(), hash})
          })

        }, time)

        break
      }

      default:
        break
    }
    return next(action)
  }
}