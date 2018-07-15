import createAtom from 'tiny-atom'
import log from 'tiny-atom/log'
import actions from './actions'
import isBefore from 'date-fns/is_before'
import { createBrowserHistory } from 'history'
const environment = process.env.NODE_ENV

let data = {
  www: {},
  ask: {},
  metatalk: {}
}
const filters = window.location.search.slice(1).split('&').map(kv => kv.split('=')).map((kvArr) => {
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

try {
  const wwwData = JSON.parse(window.localStorage.getItem('www'))
  if (isBefore(new Date(), new Date(wwwData.expires))) {
    data.www = wwwData
  }
} catch (e) {}
try {
  const askData = JSON.parse(window.localStorage.getItem('ask'))
  if (isBefore(new Date(), new Date(askData.expires))) {
    data.ask = askData
  }
} catch (e) {}
try {
  const metatalkData = JSON.parse(window.localStorage.getItem('metatalk'))
  if (isBefore(new Date(), new Date(metatalkData.expires))) {
    data.metatalk = metatalkData
  }
} catch (e) {}
const view = window.location.pathname.split('/')[1] || 'wwww'
const initialState = Object.assign({ browserHistory: createBrowserHistory(), filters, view }, data)

module.exports = createAtom(initialState, actions, {
  debug: environment === 'development' ? log : false
})
