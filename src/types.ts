export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type SyncDestination = 'linear' | 'notion' | 'asana' | 'jira' | 'slack';

export interface Participant {
  id: string;
  name: string;
  role: string;
  email?: string;
  avatar?: string;
}

export interface TranscriptSegment {
  id: string;
  speaker: string;
  time: string; // e.g. "04:12"
  timestampSeconds: number;
  text: string;
  isKeyMoment?: boolean;
}

export interface VerbatimQuote {
  id: string;
  quote: string;
  speaker: string;
  time: string;
  timestampSeconds?: number;
  context: string;
  relevance: 'high' | 'medium';
  tags?: string[];
}

export interface ActionItem {
  id: string;
  title: string;
  assignee: string;
  priority: Priority;
  dueDate: string;
  completed?: boolean;
  sourceQuote?: string;
  syncedTo?: Partial<Record<SyncDestination, {
    syncedAt: string;
    externalId: string;
    externalUrl: string;
  }>>;
}

export interface KeyTakeawayCategory {
  category: string;
  points: string[];
}

export interface FollowUpEmail {
  subject: string;
  body: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  durationMinutes: number;
  template: 'General Sync' | '1-on-1' | 'Product Review' | 'Customer Discovery' | 'Sprint Architecture' | 'Board Meeting';
  participants: Participant[];
  rawNotes: string;
  transcript: TranscriptSegment[];
  executiveSummary: string;
  keyTakeaways: KeyTakeawayCategory[];
  quotes: VerbatimQuote[];
  actionItems: ActionItem[];
  followUpEmailDraft: FollowUpEmail;
  lastEnhancedAt?: string;
  isLiveRecording?: boolean;
}

export interface SyncConfig {
  linear: {
    teamKey: string;
    project: string;
    state: string;
  };
  notion: {
    database: string;
    propertyMapping: string;
  };
  asana: {
    workspace: string;
    project: string;
  };
  jira: {
    projectKey: string;
    issueType: string;
  };
  slack: {
    channel: string;
    includeQuotes: boolean;
  };
}
