import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import SearchForm from '../components/SearchForm'
import PersonItem from '../components/PersonItem'

class PersonClass extends React.Component {

  componentDidMount () {
    const {user, match} = this.props
    const {id} = match.params
    if (!user.id || user.id !== parseInt(id)) {
      this.getUser(id)
    }
    console.log('CREATE')

  }

  getUser (id) {
    this.props.dispatch({type: 'get_user', id})
  }

  /*shouldComponentUpdate (props) {
    console.log('shouldComponentUpdate',props)
  }*/
  componentDidUpdate (props) {
    console.log('UPDA')

    const {id} = this.props.match.params
    const {id: personId} = props.match.params

    if (personId && id && id !== personId) {
      this.getUser(id)
    }
  }

  render () {
    const {user, success} = this.props
    return (
      <div>
        {success ? <div>
          <div className='page'>
            {user.id ? <PersonItem user={user}/> : <div className='person'>User not Found</div>}
            <div className='close'>
              <Link to={'/'}>close x</Link>
            </div>
          </div>
          {user.id ? <SearchForm id={user.id} search={{}}/> : null}
        </div> : null}
      </div>
    )
  }
}

function mapStateToProps (state) {
  const {user, success} = state.user
  return {
    user,
    success
  }
}

export const Person = withRouter(connect(mapStateToProps)(PersonClass))