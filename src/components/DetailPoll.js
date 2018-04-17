import React, {Component} from 'react'
import {graphql, compose} from 'react-apollo'
import {withRouter} from 'react-router-dom'
import gql from 'graphql-tag'
import {Doughnut} from 'react-chartjs-2'
import '../DetailPoll.css'
import {Share} from 'react-twitter-widgets'

const bgColors = [
  'blue',
  'yellow',
  '#33ff33',
  '#ffb833',
  '#ff66b3',
  '#9999ff',
  'orange',
  'cyan',
  '#ffb3bf',
  'violet',
  'magenta',
  'rose',
  'green',
  'red',
  '#001a00',
  '#9999ff',
  '#ffff80',
  '#871287'
]
class DetailPoll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      voteQty: 0,
      inputs: ['input1-0'],
      option: {
        name: '',
        voteQty: 0
      },
      options: []
    }

    this.handleVote = this.handleVote.bind(this)
  }

  _isLoggedIn = () => {
    return this.props.loggedInUserQuery.loggedInUser && this.props.loggedInUserQuery.loggedInUser.id !== null
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  render() {
    if (this.props.pollQuery.loading) {
      return (<div className='flex w-100 h-100 items-center justify-center pt7'>
        <div>
          Loading
        </div>
      </div>)
    }

    const {Poll} = this.props.pollQuery

    const myOptions = Poll.options
    var myLabel = []
    var myData = []
    var arrOptions = []
    for (let i = 0; i < Poll.options.length; i++) {
      myLabel.push(Poll.options[i].name)
      myData.push(Poll.options[i].voteQty)
      var item = {}
      item.name = Poll.options[i].name
      item.voteQty = Poll.options[i].voteQty
      arrOptions.push(item)
    }

    var myColors = []
    if (bgColors.length >= Poll.options.length) {
      myColors = bgColors.slice(0, Poll.options.length)
    } else {
      var num = Poll.options.length - bgColors.length
      for (let i = 0; i < num; i++) {
        bgColors.push(this.getRandomColor())
      }
      myColors = bgColors
    }

    const data = {
      labels: myLabel,
      datasets: [
        {
          data: myData,
          backgroundColor: myColors,
          hoverBackgroundColor: myColors
        }
      ]
    };

    const shareUrl = "https://localhost:3000" + this.props.match.url
    const isAuthor = this.props.loggedInUserQuery.loggedInUser && this.props.loggedInUserQuery.loggedInUser.id === this.props.pollQuery.Poll.author.id
    return (<div className="ph2">
      <div className="pt1">
        {
          isAuthor
            ? (<Share url={shareUrl}/>)
            : ("")
        }
      </div>
      <div className='close fixed right-0 top-0 pointer' onClick={this.props.history.goBack}>
        <img src={require('../assets/close.svg')} alt=''/>
      </div>
      <div className='fl w-30 pa2 black80 options'>
        <div className='flex justify-center fw3 avenir f3 mb3 title'>
          {Poll.title}
        </div>
        {
          Poll.options.map(option => (<div className='br3 ba b-black-50 mv1 item avenir'>
            <span className=''>
              <button className='buttons avenir f6 link dim br-pill ph3 pv2 ma2 dib white bg-dark-green vote' onClick={() => this.handleVote(option.id, option.voteQty)}>
                Vote
              </button>
            </span>
            <span className='mh3'>{option.name}</span>
          </div>))
        }

        <div>
          {
            this.state.inputs.map(input => <input key={input} id={input} className='pa2 mv2' onChange={e => this.setState({
                option: {
                  name: e.target.value,
                  voteQty: 0
                }
              })}/>)
          }
          <button className='fl w-50 buttons avenir f6 link dim br-pill ph2 pv2 mt2 dib white bg-dark-green dim ttu pointer' onClick={() => this.addInput()}>
            More Options
          </button>
          <button className='fl w-50 buttons avenir f6 link dim br-pill ph2 pv2 mt2 dib white bg-dark-green dim ttu pointer' onClick={this.addOption}>
            Add New Options
          </button>
        </div>
      </div>
      <div className="fl w-70 pa2 avenir">
        <Doughnut data={data}/>
      </div>
    </div>)
  }

  addInput() {
    if (this._isLoggedIn()) {
      var newInput = `input1-${this.state.inputs.length}`
      this.setState({
        inputs: this.state.inputs.concat([newInput]),
        options: this.state.options
      })
    } else {
      alert("You need to login to create new options")
    }
  }

  addOption = async () => {
    // redirect if no user is logged in
    if (!this.props.loggedInUserQuery.loggedInUser) {
      alert('Only logged in users can create new polls')
      return
    }

    if (this.state.options.length === 0) {
      var arrOldOptions = []
      const oldOptions = this.props.pollQuery.Poll.options
      for (let i = 0; i < oldOptions.length; i++) {
        this.state.options.push({name: oldOptions[i].name, voteQty: oldOptions[i].voteQty})
      }
    } else {
      this.state.options.push(this.state.option)
    }
    this.setState({options: this.state.options})

    const {options} = this.state
    const id = this.props.pollQuery.Poll.id
    const authorId = this.props.loggedInUserQuery.loggedInUser.id

    await this.props.updatePollMutation({
      variables: {
        id,
        options
      }
    })

    var elements = document.getElementsByTagName("input");
    for (let x = 0; x < elements.length; x++) {
      if (elements[x].type == "text") {
        elements[x].value = "";
      }
    }
  }

  handleVote(str, num) {
    this.setState({
      id: str,
      voteQty: num + 1
    }, () => {
      this.changeVote();
    });
  }

  changeVote = async () => {
    const {id, voteQty} = this.state
    await this.props.UpdateOptionMutation({
      variables: {
        id,
        voteQty
      }
    })  
  }
}

const UPDATE_OPTION_MUTATION = gql `
 mutation UpdateOptionMutation ($id: ID!, $voteQty: Int!) {
  updateOption(id: $id, voteQty: $voteQty) {
    id
    voteQty
  }
}
`
const UPDATE_POLL_MUTATION = gql `
mutation updatePollMutation ($id: ID!, $options: [PolloptionsOption!]!) {
  updatePoll(id: $id, options: $options) {
    id
    options {
      id
      name
      voteQty
    }
  }
}
`

const POLL_QUERY = gql `
query PollQuery($id: ID!)
{
  Poll(id : $id) {
    id
    title
    options {
      id
      name
      voteQty
    }
    author {
      id
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
export default compose(
  graphql(POLL_QUERY, {
  name: 'pollQuery',
  options: ({match}) => ({
    variables: {
      id: match.params.id
    }
  })
}),                        
 graphql(UPDATE_OPTION_MUTATION, {name: 'UpdateOptionMutation'}), 
 graphql(UPDATE_POLL_MUTATION, {name: 'updatePollMutation'}), 
 graphql(LOGGED_IN_USER_QUERY, {
  name: 'loggedInUserQuery',
  options: {
    fetchPolicy: 'network-only'
  }
}))(withRouter(DetailPoll))
