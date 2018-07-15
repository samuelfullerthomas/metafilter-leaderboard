import axios from 'axios'
import { createBrowserHistory } from 'history'
import isAfter from 'date-fns/is_after'
import addHours from 'date-fns/add_hours'
import { isEmpty } from 'lodash-es'
const isDevelopment = process.env.NODE_ENV === 'development'

export default {
  getInitialState: async ({ get, set }, domain) => {
    const state = get()
    domain = domain || state.browserHistory.location.pathname.slice(1)
    let cacheExpired = false
    if (!isEmpty(state[domain]) && state[domain].expires) {
      cacheExpired = isAfter(new Date(), new Date(state[domain].expires))
    }
    if (!state[domain] || isEmpty(state[domain]) || cacheExpired) {
      const url = isDevelopment
        ? 'http://localhost:1337'
        : 'https://api.samthomas.io'
      const viewData = await axios.get(`${url}/leaderboard/${domain}?posts=${domain === 'metatalk' ? 50 : 600}`)
      viewData.data.expires = addHours(new Date(), 12)
      window.localStorage.setItem(domain, JSON.stringify(viewData.data))
      set({ [domain]: viewData.data })
    }
  },
  changeSubdomain: ({ get, set, dispatch }, newSubdomain) => {
    const state = get()
    state.browserHistory.push({ pathname: `/${newSubdomain}` })
    if (isEmpty(!state[newSubdomain])) {
      dispatch('getInitialState', newSubdomain)
    }
    set({view: newSubdomain, filters: []})
  },
  returnToHomepage: ({ get, set }) => {
    const { browserHistory } = get()
    browserHistory.push({ pathname: '/www' })
    set({view: 'www', filters: []})
  },
  updateFilters: ({ get, set }, { filterName, value }) => {
    if (!filterName) return
    const { filters } = get()
    const browserHistory = createBrowserHistory()
    const newFilters = filters.filter(f => f.id !== filterName)
    newFilters.push({
      id: filterName,
      value
    })
    const filterString = newFilters
      .map(({id, value}) => {
        return `${id}=${encodeURIComponent(value)}`
      }, '')
      .join('&')
    browserHistory.replace({ pathname: browserHistory.location.pathname, search: `?${filterString}` })
    set({ filters: newFilters })
  }
}
