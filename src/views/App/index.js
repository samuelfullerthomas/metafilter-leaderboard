import React, { Component } from 'react'
import ReactTable from 'react-table'
import connect from '../../state/atomConnector'
import Loading from '../../components/Loading'

import styles from './App.css'
import 'react-table/react-table.css?raw'

const mapStateToProps = (state) => {
  const {
    data,
    dateRangeCovered,
    politicalComments,
    politicalPercentage,
    totalComments
  } = state[state.view] || state
  return {
    view: state.view,
    filters: state.filters,
    dateRangeCovered,
    politicalComments,
    politicalPercentage,
    totalComments,
    data
  }
}

const mapActions = [
  'getInitialState',
  'updateFilters',
  'getURLFilters',
  'changeSubdomain'
]

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    if (!props.match.params.domain) {
      props.changeSubdomain('www')
    } else {
      props.getInitialState()
    }
    props.getURLFilters()
  }

  render () {
    const {
      data,
      totalComments,
      politicalPercentage,
      dateRangeCovered,
      politicalComments,
      filters,
      view,
      changeSubdomain
    } = this.props
    if (!data) {
      return (
        <Loading />
      )
    }
    return (
      <div>
        <div className={styles.header}>
          <div className={styles.titles}>
            <div className={view === 'www' ? styles.titleSelected : styles.title} onClick={() => changeSubdomain('www')}>
              Metafilter Leaderboard
            </div>
            <div className={view === 'ask' ? styles.titleSelected : styles.title} onClick={() => changeSubdomain('ask')}>
              AskMetafilter Leaderboard
            </div>
            <div className={view === 'metatalk' ? styles.titleSelected : styles.title} onClick={() => changeSubdomain('metatalk')}>
              Metatalk Leaderboard
            </div>
          </div>
          <div className={styles.subHeader}>
            <div>{dateRangeCovered}</div>
            <div>Total comments: {totalComments}</div>
            <div>Political comments: {politicalComments}</div>
            <div>Political percentage: {politicalPercentage}</div>
            <div>Total commenters: {data.length}</div>
          </div>
        </div>
        <ReactTable
          data={data}
          filterable
          filtered={filters}
          onFilteredChange={filtered => {
            this.props.updateFilters(filtered)
          }}
          columns={[
            {
              Header: 'Name',
              columns: [
                {
                  Header: 'Username',
                  Filter: this.filter.bind(this),
                  accessor: 'name'
                },
                {
                  Header: 'Profile link',
                  Filter: this.filter.bind(this),
                  Cell: row => (<a target='_blank' href={row.value}>{row.value}</a>),
                  accessor: 'href'
                },
                {
                  Header: 'User id',
                  Filter: this.filter.bind(this),
                  accessor: 'userId'
                }
              ]
            },
            {
              Header: 'Stats',
              columns: [
                {
                  Header: 'Activity rank',
                  accessor: 'activityRank',
                  Filter: this.filter.bind(this),
                  filterMethod: this.filterByLTOrGT.bind(this)
                },
                {
                  Header: 'Popularity rank',
                  accessor: 'popularityRank',
                  Filter: this.filter.bind(this),
                  filterMethod: this.filterByLTOrGT.bind(this)
                },
                {
                  Header: 'Favorites per comment',
                  accessor: 'favoritesPerComment',
                  Filter: this.filter.bind(this),
                  filterMethod: this.filterByLTOrGT.bind(this)
                },
                {
                  Header: 'Total favorites',
                  accessor: 'totalFavorites',
                  Filter: this.filter.bind(this),
                  filterMethod: this.filterByLTOrGT.bind(this)
                },
                {
                  Header: 'Comment count',
                  accessor: 'commentCount',
                  Filter: this.filter.bind(this),
                  filterMethod: this.filterByLTOrGT.bind(this)
                },
                {
                  Header: 'Political comments percentage',
                  accessor: 'politicalCommentsPercentage',
                  Filter: this.filter.bind(this),
                  filterMethod: this.filterByLTOrGT.bind(this)
                }
              ]
            }
          ]}
          defaultPageSize={50}
          className='-striped -highlight'
        />
      </div>
    )
  }

  filter (options) {
    const { filters, updateFilters } = this.props
    return (
      <input
        onChange={event => {
          updateFilters({ filterName: options.column.id, value: event.target.value })
          options.onChange(event.target.value)
        }}
        style={{ width: '100%' }}
        value={options.filter && options.filter.value
          ? options.filter.value
          : filters.find(filter => filter.id === options.column.id)
            ? filters.find(filter => filter.id === options.column.id).value
            : ''
        }
      />
    )
  }

  filterByLTOrGT (filter, row) {
    const rowNumberValue = row[filter.id]
    const operator = filter.value.match(/([<>])/) ? filter.value.match(/([<>])/)[1] : '<'
    const filterNumberValue = filter.value.match(/(\d*\.?\d+)/) ? filter.value.match(/(\d*\.?\d+)/)[1] : 0
    if (operator === '>') {
      return Number(filterNumberValue) > Number(rowNumberValue)
    } else {
      return Number(filterNumberValue) < Number(rowNumberValue)
    }
  }
}

export default connect(mapStateToProps, mapActions)(App)
