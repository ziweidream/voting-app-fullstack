import React, {Component} from 'react'
import Poll from '../components/Poll'
import NewPollLink from './NewPollLink'
import { withRouter } from 'react-router-dom'
import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'

class MyPolls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ''
    }

    this.handleDelete = this.handleDelete.bind(this);

  }

  render() {
    console.log(this.props)

    if (this.props.allPollsQuery.loading) {
      return (<div className='flex w-100 h-100 items-center justify-center pt7'>
        Loading
      </div>)
    }

    return (<div className='w-100 flex justify-center pa6'>
      <div className="f3 measure black-80 fixed top-1 left-1"><a href='/' className="no-underline">Home</a></div>
      <div>  <NewPollLink/> </div>
      <div className='w-100 flex flex-wrap' style={{maxWidth: 1150}}>
        {this.props.allPollsQuery.allPolls.map((poll) =>
          <div className="ma3 bg-near-white br3">
           <Poll key={poll.id} poll={poll}/>
           <span className="buttons avenir f9 link dim br-pill ph2 pv1 mt3 ml3 dib white bg-red pointer" onClick={()=>this.handleDelete(poll.id)}>Delete</span>
          </div>
      )}

      </div>
    </div>
    )
  }

  handleDelete(str) {
    console.log(str);
    this.setState({
      id: str
    }, () => {
      console.log(this.state);
      this.deletePoll();
    });
  }

 deletePoll = async () =>
 {

   const {id} = this.state
   //const authorId = this.props.loggedInUserQuery.loggedInUser.id
   await this.props.deletePollMutation({
     variables: {
       id
     }
   })
   this.props.history.replace('/')
   window.location.reload()
 }

}

const DELETE_POLL_MUTATION = gql `
mutation DeletePollMutation ($id: ID!) {
 deletePoll(id: $id) {
   id
   title
 }
}
`

const ALL_POLLS_QUERY = gql`
query AllPollsQuery($authorId: ID) {
  allPolls(
    filter: {
      author: {
        id: $authorId
      }
  }) {
    id
    title
    options {
      id
      name
      voteQty
    }
  }
}
`
const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`
export default compose(
  graphql(ALL_POLLS_QUERY, {
     name: 'allPollsQuery',
     options: (ownProps) => ({
       variables: {
         authorId: ownProps.match.params.id
       }
     })
  }),
  graphql(LOGGED_IN_USER_QUERY, {
   name: 'loggedInUserQuery',
   options: { fetchPolicy: 'network-only' }
 }),
 graphql(DELETE_POLL_MUTATION, {
  name: 'deletePollMutation'
})
)(withRouter(MyPolls))
