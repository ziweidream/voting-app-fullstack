import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'

class CreatePoll extends Component {
  state = {
    title: '',
    inputs: ['input-0'],
    option: {
      name: '',
      voteQty: 0
    },
    options: []
  }

  appendInput() {
    console.log(this.state.option);
    this.state.options.push(this.state.option);
    var newInput = `input-${this.state.inputs.length}`;
    this.setState({
      inputs: this.state.inputs.concat([newInput]),
      options: this.state.options
    });
  }

  render() {
    return (<div className='ma4 flex justify-center bg-white'>
      <div style={{
          maxWidth: 500
        }} className=''>

        <input className='w-100 pa3 mv2' value={this.state.title} placeholder='Title' onChange={e => this.setState({title: e.target.value})}/> {
          this.state.inputs.map(input => <input key={input} id={input} className='w-100 pa3 mv2' onChange={e => this.setState({
              option: {
                name: e.target.value,
                voteQty: 0
              }
            })}/>)
        }
        <span>
          <button className='fl w-50 buttons avenir f5 link dim br-pill ph3 pv2 mt2 dib white bg-dark-green dim ttu pointer' onClick={() => this.appendInput()}>
            More Options
          </button>
        </span>
        <span>
          <button className='fl w-50 buttons avenir f5 link dim br-pill ph3 pv2 mt2 dib white bg-dark-green dim ttu pointer' onClick={this.handlePoll}>
            Create New Poll
          </button>
        </span>
      </div>
    </div>)
  }

  handlePoll = async () => {
    if (!this.props.loggedInUserQuery.loggedInUser) {
      console.warn('only logged in users can create new polls')
      return
    }

    this.state.options.push(this.state.option)
    this.setState({options: this.state.options})

    const {title, options} = this.state
    const authorId = this.props.loggedInUserQuery.loggedInUser.id
  

    await this.props.createPollMutation({
      variables: {
        title,
        options,
        authorId
      }
    })
    this.props.history.replace('/')
    window.location.reload()
  }
}

const CREATE_POLL_MUTATION = gql `
  mutation createPollMutation ($title: String!, $options: [PolloptionsOption!]!, $authorId: ID) {
    createPoll(
    title: $title,
    options: $options,
    authorId: $authorId

  ) {
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

const LOGGED_IN_USER_QUERY = gql `
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`

export default compose(graphql(CREATE_POLL_MUTATION, {name: 'createPollMutation'}), graphql(LOGGED_IN_USER_QUERY, {
  name: 'loggedInUserQuery',
  options: {
    fetchPolicy: 'network-only'
  }
}))(withRouter(CreatePoll))
