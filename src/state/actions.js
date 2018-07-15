import axios from 'axios'
import { createBrowserHistory } from 'history'
const isDevelopment = process.env.NODE_ENV === 'development'

export default {
  getInitialState: async ({ get, set }, domain) => {
    const { browserHistory } = get()
    domain = domain || browserHistory.location.pathname.slice(1)
    const url = isDevelopment
      ? 'http://localhost:1337'
      : 'https://api.samthomas.io'
    const viewData = await axios.get(`${url}/leaderboard/${domain}?posts=${domain === 'metatalk' ? 50 : 600}`)
    set({
      view: domain,
      [domain]: viewData.data
    })
  },
  changeSubdomain: ({ get, set, dispatch }, newSubdomain) => {
    const state = get()
    state.browserHistory.push({ pathname: `/${newSubdomain}` })
    if (!state[newSubdomain]) {
      dispatch('getInitialState', newSubdomain)
    }
    set({view: newSubdomain, filters: []})
  },
  returnToHomepage: ({ get }) => {
    const { browserHistory } = get()
    browserHistory.push({ pathname: '/www' })
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
  },
  getURLFilters: ({ get, set }) => {
    const { browserHistory: { location: { search } } } = get()
    if (!search) return
    const filters = search.slice(1).split('&').map(kv => kv.split('=')).map((kvArr) => {
      return {
        id: kvArr[0],
        value: decodeURIComponent(kvArr[1])
      }
    }).filter(filter => {
      return [
        'name',
        'href',
        'userId',
        'activityRank',
        'popularityRank',
        'favoritesPerComment',
        'totalFavorites',
        'commentCount',
        'politicalCommentsPercentage'
      ].includes(filter.id)
    })
    set({ filters })
  }
}
