import HttpClient from './HttpClient/HttpClient'
import { parseRawUserData } from './parser'
import { UserStats } from 'src/types/UserStats'
import { APIResponse } from 'src/types/APIResponse'

const TRACKER_API = 'https://api.tracker.gg/api/v2/cold-war/standard/profile/battlenet/'

async function requestUserData(user: string): Promise<APIResponse> {
  const userUrl = `${TRACKER_API}${user}`.replace('#', '%23')
  console.log(`Sending request to ${userUrl}`)
  const time: number = new Date().getTime()

  const response: APIResponse = await HttpClient.get({
    url: userUrl,
    headers: {
      'User-Agent': 'cod-performance-tracker',
      'Accept': 'application/json',
      'Accept-Encoding': 'identity',
      'Connection': 'Keep-Alive',
    },
  })

  console.log(`Request received after ${new Date().getTime() - time}ms`)
  return response
}

async function getUserStats(user: string): Promise<UserStats> {
  const rawUserData: APIResponse = await requestUserData(user)
  return parseRawUserData(rawUserData)
}

function getHTMLFormatMessageFromUserStats(userStats: UserStats, all: boolean): string {
  let message = `<b>User: </b>${userStats.userId}\n`
  if (all) message += `<b>Platform: </b>${userStats.platform}\n`
  message += `<b>Global KD: </b>${userStats.globalKd}\n`
  if (all) message += `<b>Kills: </b>${userStats.kills}\n`

  return message
}

async function getUserStatsMessage(user: string, all: boolean): Promise<string> {
  try {
    const userStats: UserStats = await getUserStats(user)
    return getHTMLFormatMessageFromUserStats(userStats, all)
  } catch (err) {
    console.log(`Error: ${err}`)
    return `Could not get the information for ${user}`
  }
}

async function getDetailedReportInHTMLFormat(users: string[]): Promise<string> {
  let report = '<b>///////////////////// DETAILED REPORT /////////////////////</b>\n'
  for (const user of users) {
    report += '\n'
    report += await getUserStatsMessage(user, true)
  }
  return report
}

async function getReportInHTMLFormat(users: string[]): Promise<string> {
  let report = '<b>///////////////////// REPORT /////////////////////</b>\n'
  for (const user of users) {
    report += '\n'
    report += await getUserStatsMessage(user, false)
  }
  return report
}

export { getDetailedReportInHTMLFormat, getReportInHTMLFormat }
