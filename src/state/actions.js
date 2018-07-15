import axios from 'axios'
const isDevelopment = process.env.NODE_ENV === 'development'

export default {
  getInitialState: async ({ get, set }) => {
    const url = isDevelopment
      ? 'http://localhost:1337'
      : 'https://api.samthomas.io'
    const response = await axios.get(`${url}/leaderboard/www?posts=300`).catch(e => console.log(e))
    console.log(response.data)
    set(response.data)
  },
  returnToHomepage: ({ get }) => {
    const { browserHistory } = get()
    browserHistory.push({ pathname: '/' })
  }
}
