import React, {Component} from 'react'
import Poll from '../components/Poll'
import {graphql} from 'react-apollo'
import gql from 'graphql-tag'

class ListPoll extends Component {

  render() {  
    if (this.props.allPollsQuery.loading) {
      return (<div className='flex w-100 h-100 items-center justify-center pt7'>
        Loading
      </div>)
    }

    return (<div className='w-100 flex justify-center pa2 br3 ba b--dashed b--blue mt3'>
      <div className='w-100 flex flex-wrap blue' style={{maxWidth: 1150}}>
        {this.props.allPollsQuery.allPolls.map((poll) => <Poll key={poll.id} poll={poll} />)}
      </div>
    </div>
    )
  }
}

const ALL_POLLS_QUERY = gql`
  query AllPollsQuery {
    allPolls(orderBy: createdAt_DESC) {
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

export default graphql(ALL_POLLS_QUERY, { name: 'allPollsQuery'})(ListPoll)
