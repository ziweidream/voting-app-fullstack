import React, { component } from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import CreatePoll from './components/CreatePoll'
import DetailPoll from './components/DetailPoll'
import CreateUser from './components/CreateUser'
import LoginUser from './components/LoginUser'
import MyPolls from './components/MyPolls'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import { ApolloProvider} from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import 'tachyons'

const httpLink = new createHttpLink({ uri: 'https://api.graph.cool/simple/v1/cjfhmxpfy4ttu012431hm4moz' })

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('graphcoolToken')
  const authorizationHeader = token ? `Bearer ${token}` : null
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  })
  return forward(operation)
})

const httpLinkWithAuthToken = middlewareLink.concat(httpLink)

const client = new ApolloClient({
  link: httpLinkWithAuthToken,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
})


ReactDOM.render((
  <ApolloProvider client={client}>
    <Router>
      <div>
        <Route exact path='/' component={App} />
        <Route path='/create' component={CreatePoll} />
        <Route path='/login' component={LoginUser} />
        <Route path='/signup' component={CreateUser} />
        <Route path='/poll/:id' component={DetailPoll} />
        <Route path='/author/:id' component={MyPolls} />
      </div>
    </Router>
  </ApolloProvider>
),
  document.getElementById('root'),
)
