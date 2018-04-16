import React, {Component} from 'react'
import { Link } from 'react-router-dom'

export default class Poll extends Component {
  render() {
    return (
      <Link
       className='bg-white ma3 box post flex flex-column no-underline br2'
       to={`/poll/${this.props.poll.id}`}
      >
      <div className='flex items-center f3 measure black-80 fw3 bg-near-white br-pill ba b--light-blue b--dashed description'>
        {this.props.poll.title}
      </div>
    </Link>
    )
  }
}
