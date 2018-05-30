import React from 'react'
import { Link } from 'react-router-dom'

const PersonItem = props => (
  <div className='person'>
    <div className='username'>
      <Link to={{pathname: `/person/${props.user.id}`, state: {search: {}, user: props.user}}}>{props.user.name}</Link>
    </div>
    <div className='userinfo'>{`${props.user.gender}, ${props.user.age} y.o., works for ${props.user.company}`}</div>
    {props.user.cached ? <span className='cache-hint'>loaded from history</span> : null}
  </div>
)

export default PersonItem
