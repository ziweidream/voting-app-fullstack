import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import {withRouter} from 'react-router-dom'
import ListPoll from './ListPoll'
import NewPollLink from './NewPollLink'
import gql from 'graphql-tag'
import {Link} from 'react-router-dom'

class App extends Component {
  _logout = () => {
    localStorage.removeItem('graphcoolToken')
    window.location.reload()
  }

  _showLogin = () => {
    this.props.history.replace('/login')
  }

  _showSignup = () => {
    this.props.history.replace('/signup')
  }

  _isLoggedIn = () => {
    return this.props.loggedInUserQuery.loggedInUser && this.props.loggedInUserQuery.loggedInUser.id !== null
  }

  render() {
    if (this.props.loggedInUserQuery.loading) {
      return (<div>Loading</div>)
    }

    if (this._isLoggedIn()) {
      return this.renderLoggedIn()
    } else {
      return this.renderLoggedOut()
    }
  }

  renderLoggedIn() {
    return (<div>
      <span className="f6 black-80">
        User ID: {this.props.loggedInUserQuery.loggedInUser.id}
      </span>
      <span>
        <Link className='bg-white ma3 box post flex flex-column no-underline f3 measure black-80 fw3 ttu br2' to={`/author/${this.props.loggedInUserQuery.loggedInUser.id}`}>
          My Polls
        </Link>
      </span>
      <div className='pv3'>
        <span className='dib bg-red white br-pill pa3 pointer dim' onClick={this._logout}>
          Logout
        </span>
      </div>
      <ListPoll/>
      <NewPollLink/>
    </div>)
  }

  renderLoggedOut() {
    return (<div>
      <div className='w-100 pa3 flex justify-center'>
        <span onClick={this._showLogin} className='dib pa2 mh6 white bg-blue dim pointer br3'>
          Log in with Email
        </span>

        <span onClick={this._showSignup} className='dib pa2 mh6 white bg-blue dim pointer br3'>
          Sign up with Email
        </span>
      </div>

      <div className='flex justify-center mt5 mb5 f2 black-80'>Select a poll to see the results and vote, or
        <span className="mh2">
          <a href="/login" className="no-underline">
            Log in
          </a>
        </span>
        /
        <span className="mh2">
          <a href="/signup" className="no-underline">
            Sign up</a>
        </span>
        to make a new poll!</div>
      <ListPoll/>
    </div>)
  }
}

const LOGGED_IN_USER_QUERY = gql `
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`

export default graphql(LOGGED_IN_USER_QUERY, {
  name: 'loggedInUserQuery',
  options: {
    fetchPolicy: 'network-only'
  }
})(withRouter(App))
