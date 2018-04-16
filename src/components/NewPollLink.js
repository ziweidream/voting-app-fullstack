import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class NewPollLink extends Component {
  render() {
    return (
      <Link to='/create' className='fixed bg-white top-0 right-0 pa4 ttu dim f3 measure black-80 fw3 no-underline'>
        + New Poll
      </Link>
    )
  }
}
