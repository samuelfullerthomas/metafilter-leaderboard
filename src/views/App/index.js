import React, { Component } from 'react'
import ReactTable from 'react-table'
import connect from '../../state/atomConnector'
import Loading from '../../components/Loading'
import tableHelpers from '../../lib/tableHelpers'

import styles from './App.css'
import 'react-table/react-table.css?raw'

const mapStateToProps = (state) => {
  return {
    data: state.data,
    dateRangeCovered: state.dateRangeCovered,
    politicalComments: state.politicalComments,
    politicalPercentage: state.politicalPercentage,
    totalComments: state.totalComments
  }
}

const mapActions = [
  'getInitialState'
]

class App extends Component {
  constructor (props) {
    super(props)
    props.getInitialState()
  }

  render () {
    const {
      data,
      totalComments,
      politicalPercentage,
      dateRangeCovered,
      politicalComments
    } = this.props
    if (!data) {
      return (
        <Loading />
      )
    }
    return (
      <div>
        <div className={styles.header}>
          <div className={styles.title}>Metafilter Leaderboard</div>
          <div className={styles.subHeader}>
            <div>{dateRangeCovered}</div>
            <div>Total comments: {totalComments}</div>
            <div>Political comments: {politicalComments}</div>
            <div>Political percentage: {politicalPercentage}</div>
          </div>
        </div>
        <ReactTable
          data={data}
          filterable
          columns={tableHelpers.columnLayout}
          defaultPageSize={50}
          className='-striped -highlight'
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapActions)(App)
