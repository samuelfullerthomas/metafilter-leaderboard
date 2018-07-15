import React, { Component } from 'react'

import styles from './Loading.css'

export default class FourOhFour extends Component {
  render () {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}><div /><div /><div /><div /></div>
      </div>
    )
  }
}
