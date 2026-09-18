export type FeatureRequestCategory =
  | "calculator"
  | "document"
  | "guide"
  | "sales"
  | "employee"
  | "other"

export type FeatureRequestStatus =
  | "requested"
  | "reviewing"
  | "planned"
  | "developing"
  | "completed"
  | "rejected"

export type FeatureRequestIndustry =
  | "restaurant"
  | "cafe"
  | "shopping"
  | "service"
  | "manufacturing"
  | "other"

export interface FeatureRequestRow {
  id: string
  category: FeatureRequestCategory
  title: string
  content: string
  industry: string | null
  nickname: string | null
  visitor_id: string
  status: FeatureRequestStatus
  admin_note: string | null
  result_url: string | null
  vote_count: number
  created_at: string
  updated_at: string
}

export interface FeatureRequestVoteRow {
  id: string
  request_id: string
  visitor_id: string
  created_at: string
}

/** Multi-site unique visitors — partitioned by site_key */
export interface SiteVisitorRow {
  id: string
  site_key: string
  visitor_id: string
  first_seen_at: string
  last_seen_at: string
  visit_count: number
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      feature_requests: {
        Row: FeatureRequestRow
        Insert: {
          id?: string
          category: FeatureRequestCategory
          title: string
          content: string
          industry?: string | null
          nickname?: string | null
          visitor_id: string
          status?: FeatureRequestStatus
          admin_note?: string | null
          result_url?: string | null
          vote_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<FeatureRequestRow>
      }
      feature_request_votes: {
        Row: FeatureRequestVoteRow
        Insert: {
          id?: string
          request_id: string
          visitor_id: string
          created_at?: string
        }
        Update: Partial<FeatureRequestVoteRow>
      }
    }
  }
}
