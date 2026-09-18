"use server"

import {
  createFeatureRequest,
  hasVisitorVoted,
  toggleFeatureRequestVote,
  type CreateFeatureRequestInput,
} from "@/lib/requests/queries"

export async function createFeatureRequestAction(
  input: CreateFeatureRequestInput
) {
  return createFeatureRequest(input)
}

export async function toggleFeatureRequestVoteAction(
  requestId: string,
  visitorId: string
) {
  return toggleFeatureRequestVote(requestId, visitorId)
}

export async function hasVisitorVotedAction(
  requestId: string,
  visitorId: string
) {
  return hasVisitorVoted(requestId, visitorId)
}
