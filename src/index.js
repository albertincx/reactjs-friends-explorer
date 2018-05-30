import React from 'react'
import thunk from 'redux-thunk'
import { render } from 'react-dom'
import { connect, Provider } from 'react-redux'
import { Route, Switch, Router } from 'react-router'
import { withRouter } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { ConnectedRouter, routerMiddleware, routerReducer } from 'react-router-redux'

import { backendMiddleware } from './helpers'
import reducers from './reducers'
import { Home, NoMatch, Person } from './pages'
import './css/style.css'

const history = createHistory()
const backMiddleware = backendMiddleware(history)

const store = createStore(
  combineReducers({
    ...reducers,
    routerReducer
  }),
  applyMiddleware(
    routerMiddleware(history),
    backMiddleware,
    thunk
  )
)
const ConnectedSwitch = withRouter(connect(state => ({
  location: state.location
}))(Switch))

const Routers = () => (<Switch>
  <Route exact path="/" component={Home}/>
  <Route path="/person/:id" component={Person}/>
  <Route component={NoMatch}/>
</Switch>)
const Routers2 = () => (<Switch>
  <Route exact path="/" component={Home}/>
  <Route path="/person/:id" component={Person}/>
  <Route component={NoMatch}/>
</Switch>)
const App = withRouter(connect(state => ({
  location: state.location,
}))(Routers))
console.log('START')

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App/>
      {/*<Routers2/>*/}
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
)
