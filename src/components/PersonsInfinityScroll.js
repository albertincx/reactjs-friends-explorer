import React from 'react'
import { connect } from 'react-redux'
import PersonItem from './PersonItem'

class PersonsInfinityScroll extends React.Component {

  constructor (props) {
    super(props)

    this.limit = 30
    this.scrolled = false
    this.timeoutHandler = null
    this.noScroll = !props.skip
    this.init = true
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidUpdate () {
    if (this.scrolled) {
      window.removeEventListener('scroll', this.handleScroll)
    }
  }

  componentWillMount () {
    if (!this.noScroll) {
      this.init = false
    }
  }

  componentDidMount () {
    if (!this.noScroll) {
      //handle scroll to child container only
      window.addEventListener('scroll', this.handleScroll)
    }
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleScroll)
  }

  shouldComponentUpdate (props) {
    if (props.items.length && props.skip && !this.noScroll) {
      this.noScroll = true
      return true
    }

    return !props.skip && this.noScroll
  }

  handleScroll () {
    const totalHeight = document.body.offsetHeight,
      visibleHeight = document.documentElement.clientHeight,
      scrollTop = document.documentElement.scrollTop

    const scrollButton = document.getElementsByClassName('scrollToTop')[0]
    if (scrollTop) {
      scrollButton.style.display = 'block'
    } else {
      scrollButton.style.display = 'none'
    }
    if (this.noScroll) return

    let currentScroll
    if (scrollTop) {
      currentScroll = scrollTop
    } else {
      currentScroll = document.body.scrollTop
    }

    //detect end of page
    if (totalHeight <= currentScroll + visibleHeight) {
      this.scrolled = true
      const {search} = this.props
      if (!search.skip) search.skip = 0

      if (this.timeoutHandler) {
        clearTimeout(this.timeoutHandler)
      }

      this.timeoutHandler = setTimeout(() => {
        search.skip += this.limit
        this.props.fetchItems(search)
        window.removeEventListener('scroll', this.handleScroll)
      }, 200)
    }
  }

  render () {
    const {items} = this.props
    let {success} = this.props
    if (this.scrolled) success = true
    return (
      <div className='results'>
        {this.init ? <div className='scrollToTop' onClick={() => {
          document.documentElement.scrollTop = 0
        }}>^</div> : null}
        {success && items ? items.map(
          (item, index) =>
            <PersonItem key={'person' + index} user={item}/>
        ) : null}
        {success && items.length >= this.limit ? <PersonsMore skip={items.length} success={false}/> : null}
      </div>
    )
  }
}

function mapStateToProps (state, props) {
  const {items, search} = state.search
  const success = props.skip ? false : state.search.success
  const skip = state.search.skip ? state.search.skip : props.skip
  return {
    items,
    search,
    success,
    skip
  }
}

const mapDispatchToProps = dispatch => ({
  fetchItems: (search) => dispatch({type: 'search', search}),
})

const PersonsMore = connect(mapStateToProps, mapDispatchToProps)(PersonsInfinityScroll)

export default PersonsMore