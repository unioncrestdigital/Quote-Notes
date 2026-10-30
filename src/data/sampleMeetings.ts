import { Meeting } from '../types';

export const SAMPLE_MEETINGS: Meeting[] = [
  {
    id: 'meet-seed-gtm',
    title: 'Seed Extension & GTM Launch Strategy',
    date: '2026-10-28',
    time: '10:00 AM',
    durationMinutes: 42,
    template: 'Product Review',
    participants: [
      { id: 'p1', name: 'Sarah Lin', role: 'CEO & Co-founder', email: 'sarah@quotenotes.io', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces' },
      { id: 'p2', name: 'Alex Rivera', role: 'Head of Growth', email: 'alex@quotenotes.io', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
      { id: 'p3', name: 'David Thorne', role: 'Partner, Benchmark Ventures', email: 'david@benchmark.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' },
    ],
    rawNotes: `- David likes the organic retention numbers (64% 4-week cohort)
- Main worry: self-serve churn if onboarding feels too heavyweight
- Sarah: "If we don't fix the Linear task sync roundtrip by Thursday, our beta users won't switch from Granola"
- GTM launch targets: ProductHunt on Nov 14th, invite-only for first 500 teams
- Alex to draft the viral comparison page showing verbatim quotes vs hallucinated AI summaries
- Need legal review on audio data retention terms (SOC2 requirement)`,
    transcript: [
      { id: 't1', speaker: 'Sarah Lin', time: '01:14', timestampSeconds: 74, text: "Good morning everyone. Let's look at the launch timeline. We've got 3 weeks before our public unveiling." },
      { id: 't2', speaker: 'David Thorne', time: '02:40', timestampSeconds: 160, text: "The engagement metrics you shared yesterday look exceptional. 64% month-one retention is well ahead of what we usually see in early-stage productivity tools.", isKeyMoment: true },
      { id: 't3', speaker: 'Alex Rivera', time: '05:12', timestampSeconds: 312, text: "Right now our biggest wedge is the verbatim quote engine. People hate when AI summarizes a meeting and makes up things someone never said." },
      { id: 't4', speaker: 'Sarah Lin', time: '08:35', timestampSeconds: 515, text: "If we don't fix the Linear task sync roundtrip by Thursday, our beta users won't switch from Granola. That friction is unacceptable.", isKeyMoment: true },
      { id: 't5', speaker: 'David Thorne', time: '14:20', timestampSeconds: 860, text: "I agree. The real defensibility isn't just taking notes; it's being the system of record that pipes actionable tasks straight into Linear and Notion with zero friction.", isKeyMoment: true },
      { id: 't6', speaker: 'Alex Rivera', time: '22:04', timestampSeconds: 1324, text: "I will draft the viral side-by-side comparison page showing how Quote Notes captures actual quotes versus hallucinated generic summaries." },
      { id: 't7', speaker: 'Sarah Lin', time: '35:50', timestampSeconds: 2150, text: "Let's also lock in the SOC2 compliance audit scope with our legal counsel before we open the self-serve floodgates." }
    ],
    executiveSummary: "The board and executive team aligned on a mid-November public launch date, citing strong 64% month-one retention. The core positioning will center on verbatim quote accuracy and seamless Linear/Notion task syncing as the primary competitive moat against legacy meeting recorders.",
    keyTakeaways: [
      {
        category: 'Product & Differentiation',
        points: [
          'Verbatim quote extraction is validated as the primary user delight metric over hallucinated summaries',
          'Bi-directional Linear and Notion syncing identified as the crucial switching catalyst',
          'Self-serve onboarding flow will be streamlined to under 90 seconds',
        ],
      },
      {
        category: 'Go-To-Market & Traction',
        points: [
          'Targeting public debut on November 14 with a 500-team invite cohort',
          'Marketing campaign will showcase live side-by-side transcript verification against raw audio',
        ],
      },
      {
        category: 'Governance & Security',
        points: [
          'Mandatory SOC2 audio storage policies to be formalized before onboarding enterprise tier accounts',
        ],
      },
    ],
    quotes: [
      {
        id: 'q-seed-1',
        quote: "If we don't fix the Linear task sync roundtrip by Thursday, our beta users won't switch from Granola. That friction is unacceptable.",
        speaker: 'Sarah Lin',
        time: '08:35',
        timestampSeconds: 515,
        context: 'Directive regarding integration polish and user switching cost',
        relevance: 'high',
        tags: ['Product', 'Linear Sync', 'Launch Blocker'],
      },
      {
        id: 'q-seed-2',
        quote: "The real defensibility isn't just taking notes; it's being the system of record that pipes actionable tasks straight into Linear and Notion with zero friction.",
        speaker: 'David Thorne',
        time: '14:20',
        timestampSeconds: 860,
        context: 'Investor perspective on product defensibility and ecosystem stickiness',
        relevance: 'high',
        tags: ['Strategy', 'Integrations'],
      },
      {
        id: 'q-seed-3',
        quote: "64% month-one retention is well ahead of what we usually see in early-stage productivity tools.",
        speaker: 'David Thorne',
        time: '02:40',
        timestampSeconds: 160,
        context: 'Validation of product-market fit metrics',
        relevance: 'medium',
        tags: ['Metrics', 'Retention'],
      },
    ],
    actionItems: [
      {
        id: 'act-seed-1',
        title: 'Resolve Linear API roundtrip latency and add project selector mapping',
        assignee: 'Sarah Lin',
        priority: 'urgent',
        dueDate: 'Thursday, 5:00 PM',
        sourceQuote: "If we don't fix the Linear task sync roundtrip by Thursday, our beta users won't switch from Granola.",
        syncedTo: {
          linear: {
            syncedAt: '2026-10-28T11:30:00Z',
            externalId: 'ENG-382',
            externalUrl: 'https://linear.app/quote-notes/issue/ENG-382',
          },
        },
      },
      {
        id: 'act-seed-2',
        title: 'Draft landing page showing verbatim quotes vs hallucinated AI summaries',
        assignee: 'Alex Rivera',
        priority: 'high',
        dueDate: 'Next Monday',
        sourceQuote: "I will draft the viral side-by-side comparison page...",
      },
      {
        id: 'act-seed-3',
        title: 'Review SOC2 audio retention policies with external legal counsel',
        assignee: 'Sarah Lin',
        priority: 'medium',
        dueDate: 'Nov 3',
      },
    ],
    followUpEmailDraft: {
      subject: 'Recap: Seed Extension & Launch Milestones [Quote Notes]',
      body: `Hi David, Alex,

Thanks for a high-leverage discussion this morning.

Key Highlights:
• 64% month-one retention confirmed as our primary traction anchor.
• Launch scheduled for mid-November with a focus on verbatim quote accuracy.
• Linear & Notion task syncing prioritized as the #1 switcher feature.

Immediate Commitments:
1. Sarah: Fix Linear sync latency and test project mapping (Due: Thursday)
2. Alex: Complete side-by-side comparison landing page (Due: Monday)
3. Sarah: Legal review on audio data retention terms (Due: Nov 3)

Looking forward to the demo next week.

Best,
Sarah Lin`,
    },
    lastEnhancedAt: '2026-10-28T10:45:00Z',
  },
  {
    id: 'meet-sprint-arch',
    title: 'Sprint 42: Realtime Audio Engine & Sharding',
    date: '2026-10-29',
    time: '2:30 PM',
    durationMinutes: 35,
    template: 'Sprint Architecture',
    participants: [
      { id: 'p4', name: 'Elena Rostova', role: 'Staff Infrastructure Eng', email: 'elena@quotenotes.io', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces' },
      { id: 'p5', name: 'Marcus Vance', role: 'DevOps & Reliability Lead', email: 'marcus@quotenotes.io', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces' },
      { id: 'p6', name: 'Chloe Chen', role: 'Frontend Tech Lead', email: 'chloe@quotenotes.io', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces' },
    ],
    rawNotes: `- Elena benchmarked WebSocket audio chunks: 120ms latency end-to-end
- Marcus: Cloud SQL connection pool was bottlenecking during peak morning meetings
- Solution: add Redis caching layer for active session state
- Chloe built the inline quote highlight tool for the scratchpad
- Decision: Do not store raw uncompressed audio longer than 48 hours unless user toggles "Permanent Archive"`,
    transcript: [
      { id: 't11', speaker: 'Elena Rostova', time: '02:10', timestampSeconds: 130, text: "I ran load tests on our audio streaming pipeline. End-to-end chunk latency is now down to 120 milliseconds." },
      { id: 't12', speaker: 'Marcus Vance', time: '06:45', timestampSeconds: 405, text: "Our main choke point isn't the audio worker; it was Postgres connection spikes when 400 people finish meetings at the top of the hour.", isKeyMoment: true },
      { id: 't13', speaker: 'Elena Rostova', time: '11:15', timestampSeconds: 675, text: "Let's put a Redis buffer in front of the database writes so meeting syntheses can queue gracefully." },
      { id: 't14', speaker: 'Chloe Chen', time: '18:30', timestampSeconds: 1110, text: "On the frontend, the instant verbatim quote insertion is working like a charm. Users can highlight any spoken line and press Cmd+Q to cite it directly.", isKeyMoment: true },
      { id: 't15', speaker: 'Marcus Vance', time: '29:00', timestampSeconds: 1740, text: "We need an automated lifecycle policy to flush raw audio after 48 hours to keep cloud storage costs lean.", isKeyMoment: true },
    ],
    executiveSummary: "The engineering team successfully reduced audio streaming latency to 120ms and devised a Redis buffering strategy to prevent database connection spikes at the top of the hour. An automated 48-hour audio storage retention policy was agreed upon to maintain lean infrastructure margins.",
    keyTakeaways: [
      {
        category: 'Infrastructure & Performance',
        points: [
          'End-to-end audio streaming latency reduced to 120ms benchmark',
          'Redis write buffer approved to absorb peak top-of-the-hour synthesis traffic',
          'Storage cost optimization: automated 48-hour purge for ephemeral raw audio chunks',
        ],
      },
      {
        category: 'Frontend & UX',
        points: [
          'Instant Cmd+Q shortcut implemented for inline quote insertion directly into scratchpad notes',
          'Optimistic UI state added for instant task sync confirmation',
        ],
      },
    ],
    quotes: [
      {
        id: 'q-arch-1',
        quote: "Our main choke point isn't the audio worker; it was Postgres connection spikes when 400 people finish meetings at the top of the hour.",
        speaker: 'Marcus Vance',
        time: '06:45',
        timestampSeconds: 405,
        context: 'Root cause analysis for database concurrency bottlenecks',
        relevance: 'high',
        tags: ['Database', 'Scaling', 'Architecture'],
      },
      {
        id: 'q-arch-2',
        quote: "Users can highlight any spoken line and press Cmd+Q to cite it directly.",
        speaker: 'Chloe Chen',
        time: '18:30',
        timestampSeconds: 1110,
        context: 'Frontend interaction detail for Granola-style quote workflows',
        relevance: 'high',
        tags: ['UX', 'Quotes', 'Shortcuts'],
      },
    ],
    actionItems: [
      {
        id: 'act-arch-1',
        title: 'Provision Redis buffer cluster and deploy worker queue throttler',
        assignee: 'Marcus Vance',
        priority: 'urgent',
        dueDate: 'Wednesday',
        sourceQuote: "Let's put a Redis buffer in front of the database writes...",
        syncedTo: {
          linear: {
            syncedAt: '2026-10-29T15:00:00Z',
            externalId: 'INFRA-104',
            externalUrl: 'https://linear.app/quote-notes/issue/INFRA-104',
          },
        },
      },
      {
        id: 'act-arch-2',
        title: 'Implement 48-hour automated S3 lifecycle expiration rule',
        assignee: 'Elena Rostova',
        priority: 'high',
        dueDate: 'Friday',
      },
      {
        id: 'act-arch-3',
        title: 'Hook up Cmd+Q shortcut hints in the scratchpad toolbar',
        assignee: 'Chloe Chen',
        priority: 'medium',
        dueDate: 'Next sprint',
      },
    ],
    followUpEmailDraft: {
      subject: 'Architecture Sync: Sprint 42 Highlights',
      body: `Team,

Recap from Sprint 42 architecture review:
• Audio stream latency is down to 120ms.
• Redis buffer being stood up to absorb Postgres write spikes.
• Automated 48-hour audio cleanup rule is moving to production.

Action items are tracked in Linear under #INFRA.

Cheers,
Elena`,
    },
    lastEnhancedAt: '2026-10-29T15:15:00Z',
  },
  {
    id: 'meet-enterprise-disc',
    title: 'Customer Discovery: Apex Financial (500 Seats)',
    date: '2026-10-30',
    time: '8:00 AM',
    durationMinutes: 28,
    template: 'Customer Discovery',
    participants: [
      { id: 'p7', name: 'Liam O’Connor', role: 'VP Information Security, Apex', email: 'liam@apexfin.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces' },
      { id: 'p8', name: 'Rachel Gomez', role: 'Enterprise Solutions Architect', email: 'rachel@quotenotes.io', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces' },
    ],
    rawNotes: `- Liam represents 500 analysts and risk officers at Apex
- Huge compliance issue with Otter and generic AI bots joining customer calls with an avatar
- They explicitly require: NO bot in the call, client-side or private recording only
- Must have exact quote proof for compliance audit trails
- They use Jira and Slack enterprise grid
- Deal size: $120,000 ARR if we pass vendor security questionnaire by Nov 20`,
    transcript: [
      { id: 't21', speaker: 'Liam O’Connor', time: '03:15', timestampSeconds: 195, text: "Our compliance officers banned any tool that sends a virtual bot into Zoom or Teams meetings. It spooks wealth management clients.", isKeyMoment: true },
      { id: 't22', speaker: 'Rachel Gomez', time: '05:40', timestampSeconds: 340, text: "That is exactly why Quote Notes runs quietly on your own device—no bots ever join the call or interrupt the meeting." },
      { id: 't23', speaker: 'Liam O’Connor', time: '12:05', timestampSeconds: 725, text: "When our analysts document client agreements, we cannot accept AI paraphrasing. Having the verbatim quote linked to the exact second in the audio is non-negotiable.", isKeyMoment: true },
      { id: 't24', speaker: 'Rachel Gomez', time: '17:20', timestampSeconds: 1040, text: "And once verified, your analysts can sync those action items directly into Jira or Slack with one click." },
      { id: 't25', speaker: 'Liam O’Connor', time: '24:10', timestampSeconds: 1450, text: "If you can complete our security questionnaire by November 20th, we are prepared to commit to a 500-seat pilot for Q1.", isKeyMoment: true },
    ],
    executiveSummary: "Apex Financial is evaluating Quote Notes for 500 analysts. Their key adoption drivers are bot-free meeting capture and auditable verbatim quote attribution for regulatory compliance. Passing their vendor security assessment by Nov 20 unlocks a $120k ARR contract.",
    keyTakeaways: [
      {
        category: 'Customer Requirements',
        points: [
          'Absolute prohibition of bot avatars entering client meetings',
          'Verbatim quote auditability required for regulatory and compliance tracking',
          'Seamless integration with Jira and Slack Enterprise Grid',
        ],
      },
      {
        category: 'Commercial Opportunity',
        points: [
          '500-seat deployment across wealth advisory and risk analysts ($120k ARR potential)',
          'Security questionnaire submission deadline is November 20th',
        ],
      },
    ],
    quotes: [
      {
        id: 'q-apex-1',
        quote: "Our compliance officers banned any tool that sends a virtual bot into Zoom or Teams meetings. It spooks wealth management clients.",
        speaker: 'Liam O’Connor',
        time: '03:15',
        timestampSeconds: 195,
        context: 'Firm security restriction against legacy bot-based meeting assistants',
        relevance: 'high',
        tags: ['Security', 'No-Bot Advantage', 'Compliance'],
      },
      {
        id: 'q-apex-2',
        quote: "When our analysts document client agreements, we cannot accept AI paraphrasing. Having the verbatim quote linked to the exact second in the audio is non-negotiable.",
        speaker: 'Liam O’Connor',
        time: '12:05',
        timestampSeconds: 725,
        context: 'Regulatory requirement making Quote Notes the clear choice',
        relevance: 'high',
        tags: ['Verbatim Quotes', 'Compliance', 'Audit Trail'],
      },
      {
        id: 'q-apex-3',
        quote: "If you can complete our security questionnaire by November 20th, we are prepared to commit to a 500-seat pilot for Q1.",
        speaker: 'Liam O’Connor',
        time: '24:10',
        timestampSeconds: 1450,
        context: 'Commercial commitment and proposal timeline',
        relevance: 'high',
        tags: ['Commercial', 'Timeline', 'Revenue'],
      },
    ],
    actionItems: [
      {
        id: 'act-apex-1',
        title: 'Complete and submit Apex Financial Security Assessment questionnaire',
        assignee: 'Rachel Gomez',
        priority: 'urgent',
        dueDate: 'Nov 18',
        sourceQuote: "If you can complete our security questionnaire by November 20th...",
        syncedTo: {
          jira: {
            syncedAt: '2026-10-30T08:15:00Z',
            externalId: 'DEAL-402',
            externalUrl: 'https://jira.atlassian.net/browse/DEAL-402',
          },
        },
      },
      {
        id: 'act-apex-2',
        title: 'Configure Jira cloud integration mapping for Apex risk analyst fields',
        assignee: 'Sarah Lin',
        priority: 'high',
        dueDate: 'Nov 10',
      },
      {
        id: 'act-apex-3',
        title: 'Schedule technical pilot kickoff with Liam and Apex InfoSec team',
        assignee: 'Rachel Gomez',
        priority: 'medium',
        dueDate: 'Nov 22',
      },
    ],
    followUpEmailDraft: {
      subject: 'Quote Notes + Apex Financial: Security Questionnaire & Next Steps',
      body: `Hi Liam,

Thank you for your time today. It was great discussing how Quote Notes protects client trust with zero meeting bots while providing verifiable quote attribution for your compliance audit trails.

Next Steps:
1. We will return the completed Information Security Questionnaire before November 18.
2. We will prepare custom Jira mapping presets for your wealth management workflows.
3. Looking forward to our pilot kickoff.

Best regards,
Rachel Gomez
Enterprise Solutions, Quote Notes`,
    },
    lastEnhancedAt: '2026-10-30T08:20:00Z',
  },
];
