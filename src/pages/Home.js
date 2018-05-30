import React from 'react'
import SearchForm from '../components/SearchForm'

export const Home = props => (
  <SearchForm match={props.match} history={props.history}/>
)