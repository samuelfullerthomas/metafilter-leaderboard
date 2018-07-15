export default {
  columnLayout: [
    {
      Header: 'Name',
      columns: [
        {
          Header: 'Username',
          accessor: 'name'
        },
        {
          Header: 'Profile link',
          accessor: 'href'
        },
        {
          Header: 'User id',
          accessor: 'userId'
        }
      ]
    },
    {
      Header: 'Stats',
      columns: [
        {
          Header: 'Activity rank',
          accessor: 'activityRank'
        },
        {
          Header: 'Popularity rank',
          accessor: 'popularityRank'
        },
        {
          Header: 'Favorites per comment',
          accessor: 'favoritesPerComment'
        },
        {
          Header: 'Total favorites',
          accessor: 'totalFavorites'
        },
        {
          Header: 'Comment count',
          accessor: 'commentCount'
        },
        {
          Header: 'Political comments percentage',
          accessor: 'politicalCommentsPercentage'
        }
      ]
    }
  ]
}
