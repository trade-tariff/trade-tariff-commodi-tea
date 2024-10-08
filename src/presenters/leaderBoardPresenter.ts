interface LeaderboardTable {
  headers: Array<{ text: string }>
  rows: Array<Array<{ text?: string }>>
}

export namespace LeaderboardPresenter {
  export function present (leaders: any[]): LeaderboardTable {
    const headers = [
      { text: 'Rank' },
      { text: 'Name' },
      { text: 'Score' }
    ]
    const rows = leaders.map(leader => {
      return [
        { text: leader?.rank ?? '' },
        { text: leader?.fullName ?? '' },
        { text: String(leader?.score ?? '') }
      ]
    })

    return { headers, rows }
  }
}
