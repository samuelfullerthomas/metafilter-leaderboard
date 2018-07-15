import axios from 'axios'
import { createBrowserHistory } from 'history'
const isDevelopment = process.env.NODE_ENV === 'development'

export default {
  getInitialState: async ({ get, set }) => {
    const url = isDevelopment
      ? 'http://localhost:1337'
      : 'https://api.samthomas.io'
    const response = await axios.get(`${url}/leaderboard/www?posts=600`).catch(e => console.log(e))
    set(response.data)
  },
  returnToHomepage: ({ get }) => {
    const { browserHistory } = get()
    browserHistory.push({ pathname: '/' })
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
