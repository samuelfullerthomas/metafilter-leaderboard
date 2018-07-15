import ReactDOM from 'react-dom'
import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import connect from './src/state/atomConnector'
import App from './src/views/App'
import FourOhFour from './src/views/FourOhFour'

const mapStateToProps = (state) => ({ browserHistory: state.browserHistory })

console.log(`help I'm trapped in the console!`)

const AppRouter = connect(mapStateToProps)(({ browserHistory }) => (
  <Router history={browserHistory}>
    <Switch>
      <Route exact path='/www' component={App} />
      <Route exact path='/ask' component={App} />
      <Route exact path='/metatalk' component={App} />
      <Route exact path='/' component={App} />
      <Route component={FourOhFour} />
    </Switch>
  </Router>
))

ReactDOM.render(<AppRouter />, document.getElementById('root'))
