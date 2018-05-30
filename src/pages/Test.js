import React from 'react'
import { connect } from 'react-redux'

class PersonClass extends React.Component {

  constructor (props){
    super(props)

  }


  componentDidUpdate (props) {
    console.log('DIDMONT')

    /*if (personId && id && id !== personId) {
      this.getUser(id)
    }*/
  }

  render () {
    const {user, success, history, location} = this.props
    // console.log(this.props)

    console.log(user)
    return (
      <div>
        Test
      </div>
    )
  }
}

function mapStateToProps (state, props) {
  // console.log(props)
  return state
}

export const Test = connect(mapStateToProps)(PersonClass)
