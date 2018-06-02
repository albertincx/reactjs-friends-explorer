import React from 'react'
import thunk from 'redux-thunk'
import { render } from 'react-dom'
import { connect, Provider } from 'react-redux'
import { Route, Switch, withRouter } from 'react-router'
import createHistory from 'history/createBrowserHistory'
import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux'

import { backendMiddleware } from './helpers'
import reducers from './reducers'
import { Home, NoMatch, Person } from './pages'

import './css/style.css'

const history = createHistory()
const backMiddleware = backendMiddleware(history)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const middleware = composeEnhancers(applyMiddleware(
  routerMiddleware(history),
  backMiddleware,
  thunk
))
const store = createStore(
  combineReducers({
    ...reducers,
    routerReducer
  }),
  middleware
)

const ConnectedSwitch = connect(state => ({location: state.location}))(Switch)
const AppContainer = () => (
  <ConnectedSwitch>
    <Route exact path="/" component={Home}/>
    <Route path="/person/:id" component={Person}/>
    <Route component={NoMatch}/>
  </ConnectedSwitch>
)

const App = withRouter(connect(state => ({location: state.location}))(AppContainer))

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
)
