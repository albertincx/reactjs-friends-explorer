import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import PersonsInfinityScroll from './PersonsInfinityScroll'

class SearchForm extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      items: [],
      search: props.search
    }
    this.handleChange = this.handleChange.bind(this)
    this.genderClick = this.genderClick.bind(this)
    this.stat = this.stat.bind(this)
  }

  stat () {
    const {search} = this.props
    this.props.clear({search})
  }

  handleChange (e) {
    const {search} = this.state
    const {name} = e.target
    let {value} = e.target
    if (/age_/.test(name) && value < 0) {
      value = 0
    }
    search[name] = value
    delete search.skip
    this.search(search)
  }

  componentDidMount () {
    if (location.search) {
      this.search(this.props.search)
    }
  }

  search (search) {
    const {id} = this.props
    if (id) search['user'] = id
    this.props.dispatch({
      type: 'search',
      search
    })
    // this.props.searchAction({search})
  }

  genderClick (type) {
    this.handleChange({
      target: {
        name: 'gender',
        value: type
      }
    })
  }

  render () {
    let {search} = this.state
    const {history, loading} = this.props
    if (history.action === 'POP' || loading) {
      search = this.props.search
    }
    return (
      <div>
        <form action='' method="POST">
          <div className='group'>
            <input
              value={search.text ? search.text : ''}
              type="search"
              placeholder={'search'}
              name='text'
              onChange={this.handleChange}
            />
          </div>
          <div className='group inline'>
            <div className='gender'>
              <ul className='inline'>
                <li
                  className={search.gender === 'male' ? 'active' : ''}
                  onClick={this.genderClick.bind(null, 'male')}>
                  male
                </li>
                <li
                  className={search.gender === 'female' ? 'active' : ''}
                  onClick={this.genderClick.bind(null, 'female')}>
                  female
                </li>
                <li
                  className={!search.gender ? 'active' : ''}
                  onClick={this.genderClick.bind(null, '')}>
                  not specified
                </li>
              </ul>
            </div>
            <div className='age'>
              <div className='inline'>
                <label htmlFor="" onClick={this.stat.bind(null)}>age from</label>
                <input
                  type="search"
                  value={search.age_from ? search.age_from : ''}
                  onChange={this.handleChange}
                  name='age_from'
                />
                <label htmlFor="">to</label>
                <input
                  type="search"
                  value={search.age_to ? search.age_to : ''}
                  onChange={this.handleChange}
                  name='age_to'
                />
              </div>
            </div>
            <div className='company'>
              <div className='inline'>
                <label htmlFor="">work for</label>
                <input
                  type="search"
                  value={search.company ? search.company : ''}
                  onChange={this.handleChange}
                  name='company'
                />
              </div>
            </div>
          </div>
        </form>
        <PersonsInfinityScroll/>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  const {search, loading} = state.search
  return {
    search,
    loading
  }
}
export default withRouter(connect(mapStateToProps)(SearchForm))

