export type NavigationTab =
  | "dashboard"
  | "channel-general"
  | "channel-hackathon"
  | "channel-events"
  | "channel-dev"
  | "channel-ideas"
  | "channel-study"
  | "events"
  | "projects"
  | "knowledge"
  | "settings"

export interface Workspace {
  id: string
  name: string
  slug: string
  description: string
  logoText: string
  memberCount: number
  onlineCount: number
  activeHackathonsCount: number
}

export type MemberStatus = "online" | "in_flow" | "away" | "offline"

export interface Member {
  id: string
  name: string
  handle: string
  role: "Lead" | "Full-Stack" | "AI/ML" | "Frontend" | "DevOps" | "Product"
  avatar: string
  status: MemberStatus
  currentStatusText?: string
}

export interface Reaction {
  emoji: string
  count: number
  reactedByMe?: boolean
}

export interface Message {
  id: string
  channelId: string
  author: Member
  content: string
  timestamp: string
  reactions: Reaction[]
  threadReplyCount?: number
  isPinned?: boolean
  codeSnippet?: {
    language: string
    code: string
  }
  attachment?: {
    name: string
    size: string
    type: "document" | "link" | "archive"
  }
}

export interface Channel {
  id: string
  name: string
  slug: string
  description: string
  category: "General" | "Core Teams" | "Focus Rooms" | "Engineering"
  unreadCount?: number
  isLocked?: boolean
}

export type EventType =
  | "hackathon"
  | "workshop"
  | "competition"
  | "meetup"
  | "study_session"
  | "submission_deadline"

export interface DeskEvent {
  id: string
  title: string
  type: EventType
  organizer: string
  date: string
  time: string
  locationOrUrl: string
  registrationUrl: string
  eligibility: string
  status: "open" | "closing_soon" | "ongoing" | "concluded"
  deadline: string
  tags: string[]
  prizePool?: string
  description: string
}

export type TaskStatus = "todo" | "in_progress" | "review" | "done"
export type TaskPriority = "low" | "medium" | "high" | "urgent"

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: Member
  dueDate: string
}

export interface Project {
  id: string
  name: string
  tagline: string
  description: string
  status: "planning" | "in_development" | "polishing" | "submitted"
  track?: string
  githubUrl?: string
  demoUrl?: string
  members: Member[]
  progressPercent: number
  tasks: Task[]
  deadlines: {
    label: string
    date: string
  }[]
}

export interface Announcement {
  id: string
  title: string
  content: string
  author: Member
  date: string
  isPinned: boolean
  tag: "Urgent" | "Important" | "Update"
}

export interface PollOption {
  id: string
  label: string
  votes: number
}

export interface Poll {
  id: string
  question: string
  description?: string
  options: PollOption[]
  author: Member
  totalVotes: number
  userVotedOptionId?: string
  isClosed: boolean
}

export interface KnowledgeItem {
  id: string
  title: string
  category: "Architecture" | "Guides" | "Meeting Notes" | "Study Resources" | "Decisions"
  excerpt: string
  author: Member
  updatedAt: string
  tags: string[]
  readingTimeMinutes: number
}

export interface StudyMaterial {
  id: string
  workspaceId: string
  title: string
  subject: string
  semester: string
  ia: "IA-1" | "IA-2" | "IA-3" | "Semester End" | "Reference"
  storagePath: string
  fileName: string
  fileSizeBytes: number
  fileType: "application/pdf" | "pdf" | string
  pageCount?: number
  uploadedBy?: {
    name: string
    avatar: string
    role?: string
  }
  description?: string
  tags?: string[]
  createdAt: string
  updatedAt?: string
}

