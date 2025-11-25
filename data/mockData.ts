
import { Course, Phase, RolePlayDay, RolePlayWeek } from '../types';

export const coursesData: Course[] = [
  { id: '1', name: 'Rachel’s English Academy', priority: 1, cost: 'Paid', speakingFocus: 10, startWeek: 1, verdict: 'Essential for American Accent foundation.', category: 'Must Buy' },
  { id: '2', name: 'BBC Learning English', priority: 2, cost: 'Free', speakingFocus: 6, startWeek: 1, verdict: 'Great for daily listening and vocabulary.', category: 'Recommended' },
  { id: '3', name: 'Cambly (Tutor Sessions)', priority: 3, cost: 'Paid', speakingFocus: 10, startWeek: 4, verdict: 'Crucial for real-time conversation practice.', category: 'Must Buy' },
  { id: '4', name: 'TED Talks Daily', priority: 4, cost: 'Free', speakingFocus: 5, startWeek: 2, verdict: 'Excellent for shadowing and public speaking nuance.', category: 'Recommended' },
  { id: '5', name: 'Udemy: Business English Mastery', priority: 5, cost: '$14.99', speakingFocus: 7, startWeek: 6, verdict: 'Good for professional vocabulary.', category: 'Optional' },
  { id: '6', name: 'ELSA Speak App', priority: 2, cost: 'Freemium', speakingFocus: 9, startWeek: 1, verdict: 'AI pronunciation feedback on the go.', category: 'Recommended' },
  { id: '7', name: 'Toastmasters Online', priority: 6, cost: 'Free', speakingFocus: 9, startWeek: 8, verdict: 'High-pressure speaking environment.', category: 'Optional' },
  { id: '8', name: 'LinguaLens AI Coach', priority: 1, cost: 'Free', speakingFocus: 10, startWeek: 1, verdict: 'Your daily analysis tool.', category: 'Must Buy' },
];

export const phasesData: Phase[] = [
  {
    id: 'phase1',
    title: 'Phase 1: The Foundation',
    description: 'Building correct pronunciation, intonation, and basic fluency.',
    weekRange: 'Weeks 1-4',
    milestones: ['Master TH sounds', 'Understand Schwa sound', 'Comfortable with 1-min self-intro'],
    dailySchedule: {
      morning: '30 mins: Phonetics & Shadowing (Rachel’s English)',
      evening: '30 mins: Role-Play Simulation (Day 1-30 plan)'
    },
    weekGoals: [
      'Week 1: Focus on Vowel sounds and mouth positioning.',
      'Week 2: Consonant clusters and linking words.',
      'Week 3: Intonation patterns (Statements vs Questions).',
      'Week 4: Rhythm and stress in sentences.'
    ]
  },
  {
    id: 'phase2',
    title: 'Phase 2: Professional Confidence',
    description: 'Expanding vocabulary and handling complex scenarios.',
    weekRange: 'Weeks 5-8',
    milestones: ['Lead a mock meeting', 'Debate a topic for 3 mins', 'Use 50 new idioms'],
    dailySchedule: {
      morning: '20 mins: Business News Shadowing',
      evening: '45 mins: Tutor Conversation or AI Analysis'
    },
    weekGoals: [
      'Week 5: Business vocabulary and email etiquette.',
      'Week 6: Small talk mastery and networking skills.',
      'Week 7: Presentation skills (Structure and Hook).',
      'Week 8: Negotiation and persuasion tactics.'
    ]
  },
  {
    id: 'phase3',
    title: 'Phase 3: Mastery & Flow',
    description: 'Achieving native-like speed, humor, and cultural nuance.',
    weekRange: 'Weeks 9-12',
    milestones: ['Tell a funny story naturally', 'Understand fast native speech', 'Zero hesitation'],
    dailySchedule: {
      morning: '15 mins: Podcast listening at 1.2x speed',
      evening: '1 hour: Open conversation / Social group'
    },
    weekGoals: [
      'Week 9: Storytelling techniques.',
      'Week 10: Understanding cultural references and humor.',
      'Week 11: Slang and informal speech registers.',
      'Week 12: Final Fluency Assessment.'
    ]
  }
];

export const rolePlayWeeks: RolePlayWeek[] = [
  {
    weekNumber: 1,
    title: 'Foundation Phase (Days 1-7)',
    focus: 'Build confidence with ultra-simple scenarios',
    milestones: [
      'Grasp 200+ basic collocations',
      'Speak 5-10 minutes continuously',
      'Pronunciation significantly clearer',
      'Friends notice improvement'
    ]
  },
  {
    weekNumber: 2,
    title: 'Early Progress Phase (Days 8-14)',
    focus: 'Expand beyond greetings, longer exchanges',
    milestones: [
      'Complete Collocations Challenge (all 30 days)',
      'Speak 10-15 minutes continuously',
      '50% fewer grammar errors',
      'Think more directly in English'
    ]
  },
  {
    weekNumber: 3,
    title: 'Transition Phase (Days 15-21)',
    focus: 'Move from daily life into professional contexts',
    milestones: [
      'Begin Professional English Level 2',
      'Handle 20+ minute conversations',
      'Comfortable in professional discussions',
      'Halfway through Professional Level 2'
    ]
  },
  {
    weekNumber: 4,
    title: 'Professional Foundation Phase (Days 22-27)',
    focus: 'Begin complex client interactions, negotiation',
    milestones: [
      'Complete Professional English Level 2',
      'Start Phrasal Verbs Challenge',
      'Handle complex 20-30 minute business conversations',
      'Navigate difficult personalities diplomatically'
    ]
  },
  {
    weekNumber: 5,
    title: 'Client-Ready Mastery Phase (Days 28-30)',
    focus: 'Full-spectrum client communication, complex scenarios',
    milestones: [
      'CLIENT-READY!',
      'Can conduct 30-45 minute professional conversations',
      'Sound natural with collocations + phrasal verbs',
      'Handle complex business discussions effortlessly'
    ]
  }
];

export const rolePlayData: RolePlayDay[] = [
  // WEEK 1
  {
    day: 1,
    week: 1,
    difficulty: '1/5',
    dailyGoal: 'Master simple greetings, names, and polite introductions',
    morning: { 
      title: 'Greeting a neighbor', 
      scenario: 'You are arriving home and see your neighbor working in their yard.', 
      userRole: 'Resident coming home', 
      partnerRole: 'Neighbor working in yard', 
      speakingPoints: ['Good evening', 'Nice weather', 'How are you?'], 
      possibleQuestions: [
        'How long have you lived here?', 
        'Do you need any help with that?', 
        'Have a nice evening!',
        'What are you planting there?',
        'Beautiful garden, do you maintain it yourself?',
        'Is trash pickup day tomorrow?',
        'Do you happen to know a good plumber nearby?',
        'Have you seen a cat wandering around?',
        'Did you hear that noise last night?',
        'Are you enjoying this weather?'
      ],
      partnerQuestions: [
        'Hi there, new to the neighborhood?', 
        'Beautiful day, isn\'t it?', 
        'What brings you here?',
        'Where did you move from?',
        'Do you have any kids or pets?',
        'How are you settling in?',
        'Can I borrow your lawnmower sometime?',
        'Are you planning any renovations?',
        'Do you work nearby?',
        'Welcome to the street!'
      ],
      vocabulary: ['Neighbor', 'Yard', 'Weekend'], 
      tips: 'Smile and keep eye contact.' 
    },
    evening: { 
      title: 'Introducing yourself professionally', 
      scenario: 'It is your first day at a new job. Introduce yourself to the manager.', 
      userRole: 'New employee', 
      partnerRole: 'Department manager', 
      speakingPoints: ['Nice to meet you', 'I work in...', 'Excited to be here'], 
      possibleQuestions: [
        'Who should I report to typically?', 
        'Where is my desk located?', 
        'What is the team culture like?',
        'When does the daily standup happen?',
        'Is there a specific dress code?',
        'Can you tell me about the current project?',
        'Who can I ask for IT support?',
        'Where do people usually go for lunch?',
        'What are the priority tasks for this week?',
        'Is there any training documentation I should read?'
      ],
      partnerQuestions: [
        'Welcome aboard! What is your background?', 
        'Do you have any questions for me?', 
        'Ready to get started?',
        'Have you met the rest of the team yet?',
        'What software tools are you most familiar with?',
        'What are your career goals here?',
        'Can you join the meeting at 10 AM?',
        'Did you get your access badge?',
        'How was your commute this morning?',
        'We are very happy to have you on the team.'
      ],
      vocabulary: ['Department', 'Role', 'Background'], 
      tips: 'Firm handshake (metaphorically) and clear name pronunciation.' 
    }
  },
  {
    day: 2,
    week: 1,
    difficulty: '1/5',
    dailyGoal: 'Use polite requests, understand responses, speak confidently',
    morning: { 
        title: 'Ordering coffee at café', 
        scenario: 'Ordering coffee at café', 
        userRole: 'Customer', 
        partnerRole: 'Barista', 
        speakingPoints: ['Can I have...', 'Medium size', 'To go'], 
        possibleQuestions: ['Do you have oat milk?', 'How much is that?', 'Can I pay by card?'],
        partnerQuestions: ['What can I get for you?', 'Room for cream?', 'Will that be all?'],
        vocabulary: ['Latte', 'Medium', 'Receipt'], 
        tips: 'Use "Could I please get..."' 
    },
    evening: { 
        title: 'Making small talk at work', 
        scenario: 'Making small talk at work', 
        userRole: 'New colleague', 
        partnerRole: 'Senior colleague', 
        speakingPoints: ['How long have you worked here?', 'Busy day?', 'Nice office'], 
        possibleQuestions: ['Where do you usually go for lunch?', 'Do you live nearby?', 'Any plans for the weekend?'],
        partnerQuestions: ['Settling in okay?', 'Where did you work before?', 'How was your commute?'],
        vocabulary: ['Colleague', 'Project', 'Lunch'], 
        tips: 'Keep it light and positive.' 
    }
  },
  {
    day: 3,
    week: 1,
    difficulty: '1/5',
    dailyGoal: 'Ask simple questions, give basic directions, speak clearly',
    morning: { title: 'Asking for directions on street', scenario: 'Asking for directions on street', userRole: 'Visitor/tourist', partnerRole: 'Passerby/local', speakingPoints: ['Excuse me', 'Is this the way to...', 'How far is it?'], vocabulary: ['Intersection', 'Straight', 'Turn'], tips: 'Be polite with "Excuse me" first.' },
    evening: { title: 'Joining a team meeting (introduction)', scenario: 'Joining a team meeting (introduction)', userRole: 'Team member introducing yourself', partnerRole: 'Team lead', speakingPoints: ['Hi everyone', 'Happy to join', 'My background is...'], vocabulary: ['Agenda', 'Team', 'Introduction'], tips: 'Speak loud enough to be heard.' }
  },
  {
    day: 4,
    week: 1,
    difficulty: '1/5',
    dailyGoal: 'Handle basic transactions, exchange details clearly',
    morning: { title: 'Buying groceries and paying', scenario: 'Buying groceries and paying', userRole: 'Customer', partnerRole: 'Cashier', speakingPoints: ['Credit card', 'Receipt please', 'Do you have bags?'], vocabulary: ['Total', 'Cashier', 'Checkout'], tips: 'Review numbers for prices.' },
    evening: { title: 'Exchanging contact information', scenario: 'Exchanging contact information', userRole: 'Professional A', partnerRole: 'Professional B', speakingPoints: ['Here is my card', 'What is your email?', 'Let’s stay in touch'], vocabulary: ['Email', 'LinkedIn', 'Contact'], tips: 'Confirm spelling of names/emails.' }
  },
  {
    day: 5,
    week: 1,
    difficulty: '1/5',
    dailyGoal: 'Speak about simple topics confidently, reduce pauses',
    morning: { title: 'Asking about the weather', scenario: 'Asking about the weather', userRole: 'Person A on street', partnerRole: 'Person B on street', speakingPoints: ['Looks like rain', 'Chilly today', 'Did you see the forecast?'], vocabulary: ['Forecast', 'Umbrella', 'Temperature'], tips: 'Common small talk starter.' },
    evening: { title: 'Discussing your job role', scenario: 'Discussing your job role', userRole: 'Colleague asking', partnerRole: 'You explaining your position', speakingPoints: ['I handle...', 'My main focus is...', 'I work with...'], vocabulary: ['Responsibilities', 'Department', 'Task'], tips: 'Use present simple tense.' }
  },
  {
    day: 6,
    week: 1,
    difficulty: '2/5',
    dailyGoal: 'Use more complex sentences, ask follow-up questions',
    morning: { title: 'Ordering food at restaurant', scenario: 'Ordering food at restaurant', userRole: 'Customer', partnerRole: 'Waiter/waitress', speakingPoints: ['I will have the...', 'Is it spicy?', 'Check please'], vocabulary: ['Menu', 'Appetizer', 'Entree'], tips: 'Use "I would like" for politeness.' },
    evening: { title: 'Receiving a task from manager', scenario: 'Receiving a task from manager', userRole: 'Employee', partnerRole: 'Manager', speakingPoints: ['When is it due?', 'Understood', 'I will get on it'], vocabulary: ['Deadline', 'Priority', 'Assignment'], tips: 'Clarify expectations immediately.' }
  },
  {
    day: 7,
    week: 1,
    difficulty: '2/5',
    dailyGoal: 'Share personal experiences, understand timelines',
    morning: { title: 'Asking friend about their weekend', scenario: 'Asking friend about their weekend', userRole: 'Friend A', partnerRole: 'Friend B', speakingPoints: ['Did you do anything fun?', 'How was it?', 'Relaxing'], vocabulary: ['Weekend', 'Plans', 'Relax'], tips: 'Show interest with "That sounds fun!"' },
    evening: { title: 'Asking for deadline/project details', scenario: 'Asking for deadline/project details', userRole: 'Employee', partnerRole: 'Team lead', speakingPoints: ['What is the timeline?', 'Are there any blockers?', 'Final deliverable'], vocabulary: ['Timeline', 'Milestone', 'Deliverable'], tips: 'Confirm dates explicitly.' }
  },
  // WEEK 2
  {
    day: 8,
    week: 2,
    difficulty: '2/5',
    dailyGoal: 'Negotiate politely, confirm details clearly, use appropriate language',
    morning: { title: 'Borrowing something from roommate', scenario: 'Borrowing something from roommate', userRole: 'You need to borrow', partnerRole: 'Roommate lending', speakingPoints: ['Could I borrow...', 'I promise to return it', 'Thanks a lot'], vocabulary: ['Borrow', 'Lend', 'Favor'], tips: 'Be polite and specific.' },
    evening: { title: 'Confirming a meeting time', scenario: 'Confirming a meeting time', userRole: 'Employee scheduling', partnerRole: 'Boss scheduling', speakingPoints: ['Does 2pm work?', 'I sent an invite', 'Confirmed'], vocabulary: ['Calendar', 'Schedule', 'Confirm'], tips: 'Repeat the time to verify.' }
  },
  {
    day: 9,
    week: 2,
    difficulty: '2/5',
    dailyGoal: 'Describe situations clearly, understand explanations, show gratitude',
    morning: { title: 'Asking for help at a store', scenario: 'Asking for help at a store', userRole: 'Customer needing assistance', partnerRole: 'Store employee', speakingPoints: ['Where can I find...', 'Do you have this in stock?', 'Thank you'], vocabulary: ['Aisle', 'Stock', 'Size'], tips: 'Be direct but polite.' },
    evening: { title: 'Reporting on work progress', scenario: 'Reporting on work progress', userRole: 'Employee updating', partnerRole: 'Manager listening', speakingPoints: ['I am currently working on...', 'It is going well', 'Almost done'], vocabulary: ['Status', 'Update', 'Progress'], tips: 'Highlight achievements first.' }
  },
  {
    day: 10,
    week: 2,
    difficulty: '2/5',
    dailyGoal: 'Use "I like/enjoy" structures, ask follow-up questions, show interest',
    morning: { title: 'Talking about hobbies/interests', scenario: 'Talking about hobbies with new friend', userRole: 'Sharing your hobbies', partnerRole: 'Friend asking questions', speakingPoints: ['I really enjoy...', 'Do you like...', 'It relaxes me'], vocabulary: ['Hobby', 'Pastime', 'Interest'], tips: 'Use enthusiastic tone.' },
    evening: { title: 'Greeting a client (brief)', scenario: 'Greeting a client (brief)', userRole: 'Office staff', partnerRole: 'Visiting client', speakingPoints: ['Welcome to our office', 'Can I get you water?', 'Right this way'], vocabulary: ['Welcome', 'Refreshment', 'Reception'], tips: 'Professional warmth is key.' }
  },
  {
    day: 11,
    week: 2,
    difficulty: '2/5',
    dailyGoal: 'Give reasons, apologize appropriately, explain circumstances',
    morning: { title: 'Explaining why you\'re late', scenario: 'Explaining why you\'re late to friend', userRole: 'Late arriving', partnerRole: 'Friend waiting', speakingPoints: ['So sorry I am late', 'Traffic was bad', 'I missed the bus'], vocabulary: ['Traffic', 'Delay', 'Apology'], tips: 'Don’t over-explain, just apologize.' },
    evening: { title: 'Welcoming a new client (extended)', scenario: 'Welcoming a new client (extended)', userRole: 'Sales representative', partnerRole: 'New client visiting', speakingPoints: ['Great to finally meet', 'Did you find us okay?', 'Let’s go to the conference room'], vocabulary: ['Hospitality', 'Meeting', 'Tour'], tips: 'Make them feel comfortable.' }
  },
  {
    day: 12,
    week: 2,
    difficulty: '3/5',
    dailyGoal: 'Use past tense, sequence events, practice active listening',
    morning: { title: 'Describing your morning routine', scenario: 'Describing your morning routine', userRole: 'You explaining', partnerRole: 'Friend asking questions', speakingPoints: ['Usually I wake up at...', 'Then I have coffee', 'Before I leave...'], vocabulary: ['Routine', 'Habit', 'Schedule'], tips: 'Use "First, Then, After that".' },
    evening: { title: 'Discussing client needs (discovery)', scenario: 'Discussing client needs (discovery call)', userRole: 'Consultant listening', partnerRole: 'Client explaining needs', speakingPoints: ['What are your main goals?', 'Tell me more about...', 'We can help with that'], vocabulary: ['Goals', 'Requirements', 'Pain points'], tips: 'Take notes and nod (if video).' }
  },
  {
    day: 13,
    week: 2,
    difficulty: '3/5',
    dailyGoal: 'Present ideas, negotiate timing, confirm details',
    morning: { title: 'Calling friend to make plans', scenario: 'Calling friend to make plans', userRole: 'You calling', partnerRole: 'Friend answering', speakingPoints: ['Are you free on Friday?', 'Let’s go to dinner', 'Sounds like a plan'], vocabulary: ['Reservation', 'Venue', 'Availability'], tips: 'Propose specific times.' },
    evening: { title: 'Taking a message from client', scenario: 'Taking a message from client', userRole: 'Receptionist/assistant', partnerRole: 'Client calling with message', speakingPoints: ['He is in a meeting', 'Can I take a message?', 'I will pass that along'], vocabulary: ['Message', 'Urgent', 'Callback'], tips: 'Verify phone numbers carefully.' }
  },
  {
    day: 14,
    week: 2,
    difficulty: '3/5',
    dailyGoal: 'Describe experiences, give opinions, provide reasons',
    morning: { title: 'Talking about a movie/show', scenario: 'Talking about a movie/show you watched', userRole: 'Recommending', partnerRole: 'Friend asking details', speakingPoints: ['It was amazing', 'The plot was...', 'You should watch it'], vocabulary: ['Plot', 'Character', 'Review'], tips: 'Avoid spoilers!' },
    evening: { title: 'Explaining services/solutions', scenario: 'Explaining services/solutions to client', userRole: 'Service provider', partnerRole: 'Interested client', speakingPoints: ['We specialize in...', 'This solution offers...', 'Benefits include...'], vocabulary: ['Solution', 'Benefit', 'Feature'], tips: 'Focus on value, not just features.' }
  },
  // WEEK 3
  {
    day: 15,
    week: 3,
    difficulty: '3/5',
    dailyGoal: 'Explain symptoms, understand suggestions, discuss choices',
    morning: { title: 'Discussing health/how you feel', scenario: 'Discussing health', userRole: 'Patient talking', partnerRole: 'Friend concerned', speakingPoints: ['I feel a bit under the weather', 'Headache', 'Maybe I need rest'], vocabulary: ['Symptoms', 'Remedy', 'Doctor'], tips: 'Use describing adjectives.' },
    evening: { title: 'Handling client questions on pricing', scenario: 'Handling client questions about pricing', userRole: 'Salesperson', partnerRole: 'Budget-conscious client', speakingPoints: ['This package includes...', 'It is great value', 'We can offer payment plans'], vocabulary: ['Budget', 'Investment', 'Cost'], tips: 'Avoid saying "expensive", say "premium".' }
  },
  {
    day: 16,
    week: 3,
    difficulty: '3/5',
    dailyGoal: 'Express problems clearly, listen to suggestions, ask for clarification',
    morning: { title: 'Asking for advice about a problem', scenario: 'Asking for advice about a problem', userRole: 'Seeking advice', partnerRole: 'Friend offering ideas', speakingPoints: ['I don’t know what to do', 'What would you do?', 'That makes sense'], vocabulary: ['Dilemma', 'Option', 'Advice'], tips: 'Be open to suggestions.' },
    evening: { title: 'Responding to a client objection', scenario: 'Responding to a client objection', userRole: 'Salesperson', partnerRole: 'Skeptical client', speakingPoints: ['I understand your concern', 'Actually, that is resolved by...', 'Let me clarify'], vocabulary: ['Objection', 'Concern', 'Clarification'], tips: 'Use "Yes, and..." technique.' }
  },
  {
    day: 17,
    week: 3,
    difficulty: '3/5',
    dailyGoal: 'Discuss options, compare alternatives, negotiate preferences',
    morning: { title: 'Planning a trip together', scenario: 'Planning a trip together', userRole: 'Travel enthusiast', partnerRole: 'Co-planner', speakingPoints: ['We could go to...', 'Flights are cheaper if...', 'I prefer the beach'], vocabulary: ['Itinerary', 'Booking', 'Destination'], tips: 'Compromise is key.' },
    evening: { title: 'Preparing proposal for client', scenario: 'Preparing proposal for client', userRole: 'Consultant', partnerRole: 'Client', speakingPoints: ['Here is the draft', 'Based on your requirements', 'What do you think?'], vocabulary: ['Proposal', 'Draft', 'Scope'], tips: 'Ask for feedback early.' }
  },
  {
    day: 18,
    week: 3,
    difficulty: '3/5',
    dailyGoal: 'Tell stories, personalize information, show emotion appropriately',
    morning: { title: 'Discussing family/relatives', scenario: 'Discussing family', userRole: 'Sharing family updates', partnerRole: 'Friend asking questions', speakingPoints: ['My brother is...', 'We gathered for...', 'Good memories'], vocabulary: ['Relative', 'Reunion', 'Sibling'], tips: 'Share positive anecdotes.' },
    evening: { title: 'Presenting proposal to client', scenario: 'Presenting proposal to client', userRole: 'Presenter', partnerRole: 'Client decision-maker', speakingPoints: ['Our strategy is...', 'This leads to...', 'Any questions?'], vocabulary: ['Strategy', 'ROI', 'Outcome'], tips: 'Speak with conviction.' }
  },
  {
    day: 19,
    week: 3,
    difficulty: '4/5',
    dailyGoal: 'Explain viewpoints, respond to counterarguments, provide details',
    morning: { title: 'Discussing a recent news story', scenario: 'Discussing a recent news story', userRole: 'Opinion sharer', partnerRole: 'Someone disagreeing/asking', speakingPoints: ['Did you read about...', 'I think it means...', 'Interesting perspective'], vocabulary: ['Article', 'Opinion', 'Trend'], tips: 'Respect differing views.' },
    evening: { title: 'First follow-up meeting', scenario: 'First follow-up meeting with client', userRole: 'Account manager', partnerRole: 'Client reviewing proposal', speakingPoints: ['Have you reviewed it?', 'Any changes needed?', 'Next steps'], vocabulary: ['Feedback', 'Revision', 'Approval'], tips: 'Be proactive.' }
  },
  {
    day: 20,
    week: 3,
    difficulty: '4/5',
    dailyGoal: 'Be specific, show appreciation, discuss options',
    morning: { title: 'Asking for a favor/help', scenario: 'Asking for a favor/help with something', userRole: 'Needing assistance', partnerRole: 'Person in position to help', speakingPoints: ['Huge favor to ask', 'I would appreciate it', 'I owe you one'], vocabulary: ['Assistance', 'Appreciate', 'Favor'], tips: 'Give them an out if they can\'t.' },
    evening: { title: 'Negotiating terms with client', scenario: 'Negotiating terms with client', userRole: 'Negotiator', partnerRole: 'Client with concerns', speakingPoints: ['We can adjust that', 'If you sign today...', 'Standard terms are...'], vocabulary: ['Contract', 'Clause', 'Agreement'], tips: 'Aim for win-win.' }
  },
  {
    day: 21,
    week: 3,
    difficulty: '4/5',
    dailyGoal: 'Express opinions clearly, defend position respectfully, find common ground',
    morning: { title: 'Discussing likes/dislikes about job', scenario: 'Discussing likes/dislikes about your job', userRole: 'Satisfied/frustrated employee', partnerRole: 'Listening friend', speakingPoints: ['The best part is...', 'I struggle with...', 'Overall it is good'], vocabulary: ['Workload', 'Culture', 'Management'], tips: 'Balance complaints with positives.' },
    evening: { title: 'Handling pricing negotiation', scenario: 'Handling pricing negotiation with client', userRole: 'Salesperson defending price', partnerRole: 'Client wanting discount', speakingPoints: ['The quality justifies...', 'We deliver results', 'I can offer a small discount'], vocabulary: ['Value', 'Margin', 'Discount'], tips: 'Stand firm on value.' }
  },
  // WEEK 4
  {
    day: 22,
    week: 4,
    difficulty: '4/5',
    dailyGoal: 'Give step-by-step instructions, answer questions, provide reassurance',
    morning: { title: 'Explaining how to do something', scenario: 'Explaining how to do something', userRole: 'Expert teaching', partnerRole: 'Learner asking questions', speakingPoints: ['Step one is...', 'Make sure to...', 'Does that make sense?'], vocabulary: ['Process', 'Instruction', 'Method'], tips: 'Check for understanding frequently.' },
    evening: { title: 'Addressing client concerns', scenario: 'Addressing client concerns about implementation', userRole: 'Implementation specialist', partnerRole: 'Worried client', speakingPoints: ['It will be smooth', 'We have a plan', 'Support is available'], vocabulary: ['Implementation', 'Support', 'Training'], tips: 'Be reassuring and confident.' }
  },
  {
    day: 23,
    week: 4,
    difficulty: '4/5',
    dailyGoal: 'Describe future scenarios, discuss possibilities confidently',
    morning: { title: 'Discussing future plans/dreams', scenario: 'Discussing future plans/dreams', userRole: 'Dreamer sharing', partnerRole: 'Friend interested', speakingPoints: ['One day I want to...', 'I am planning to...', 'It is a big goal'], vocabulary: ['Ambition', 'Goal', 'Vision'], tips: 'Use future tense correctly.' },
    evening: { title: 'Establishing timeline/milestones', scenario: 'Establishing timeline and milestones with client', userRole: 'Project manager', partnerRole: 'Client', speakingPoints: ['Phase 1 starts on...', 'Key milestone is...', 'Expected completion'], vocabulary: ['Phase', 'Kickoff', 'Launch'], tips: 'Be realistic with dates.' }
  },
  {
    day: 24,
    week: 4,
    difficulty: '4/5',
    dailyGoal: 'Listen actively, show empathy, find compromise, preserve friendship',
    morning: { title: 'Resolving a disagreement', scenario: 'Resolving a disagreement with friend', userRole: 'Person A with complaint', partnerRole: 'Person B defending position', speakingPoints: ['I felt hurt when...', 'Can we talk about...', 'I value our friendship'], vocabulary: ['Misunderstanding', 'Perspective', 'Resolution'], tips: 'Use "I" statements, not "You".' },
    evening: { title: 'Responding to positive feedback', scenario: 'Responding to client feedback (positive)', userRole: 'Service provider', partnerRole: 'Satisfied client', speakingPoints: ['Thank you so much', 'Glad you liked it', 'We aim to please'], vocabulary: ['Testimonial', 'Satisfaction', 'Referral'], tips: 'Ask for a referral if appropriate.' }
  },
  {
    day: 25,
    week: 4,
    difficulty: '4/5',
    dailyGoal: 'Explain ideas clearly, respect differing views, respond constructively',
    morning: { title: 'Discussing a book/article', scenario: 'Discussing a book/article you read', userRole: 'Enthusiastic reader', partnerRole: 'Curious listener', speakingPoints: ['The author argues...', 'It changed my mind', 'Highly recommended'], vocabulary: ['Author', 'Argument', 'Theme'], tips: 'Summarize key points concisely.' },
    evening: { title: 'Responding to critical feedback', scenario: 'Responding to client feedback (critical)', userRole: 'Service provider', partnerRole: 'Dissatisfied client', speakingPoints: ['I apologize for that', 'We will fix it', 'Thank you for telling me'], vocabulary: ['Improvement', 'Rectify', 'Standard'], tips: 'Don’t get defensive.' }
  },
  {
    day: 26,
    week: 4,
    difficulty: '4/5',
    dailyGoal: 'Describe problems, explain solutions calmly',
    morning: { title: 'Talking about challenges faced', scenario: 'Talking about challenges you faced', userRole: 'Sharing difficulties', partnerRole: 'Supportive listener', speakingPoints: ['It was tough because...', 'I overcame it by...', 'Learned a lot'], vocabulary: ['Challenge', 'Obstacle', 'Resilience'], tips: 'Focus on the solution.' },
    evening: { title: 'Managing client expectations', scenario: 'Managing client expectations about timeline', userRole: 'Project lead', partnerRole: 'Impatient client', speakingPoints: ['We need more time to...', 'Quality is priority', 'Revised date is...'], vocabulary: ['Quality Assurance', 'Delay', 'Expectation'], tips: 'Under-promise, over-deliver.' }
  },
  {
    day: 27,
    week: 4,
    difficulty: '5/5',
    dailyGoal: 'Listen deeply, synthesize information, offer creative solutions',
    morning: { title: 'Offering advice to a friend', scenario: 'Offering advice to a friend', userRole: 'Advisor', partnerRole: 'Person seeking advice', speakingPoints: ['Have you considered...', 'If I were you...', 'Whatever you decide'], vocabulary: ['Perspective', 'Suggestion', 'Support'], tips: 'Empower them to choose.' },
    evening: { title: 'Proposing changes/upgrades', scenario: 'Proposing changes/upgrades to client', userRole: 'Account manager', partnerRole: 'Existing client', speakingPoints: ['We have a new feature', 'It would help with...', 'Upgrade options'], vocabulary: ['Upgrade', 'Efficiency', 'Optimization'], tips: 'Focus on ROI.' }
  },
  // WEEK 5
  {
    day: 28,
    week: 5,
    difficulty: '5/5',
    dailyGoal: 'Show empathy, take responsibility, demonstrate competence',
    morning: { title: 'Discussing career options', scenario: 'Discussing career options/aspirations', userRole: 'Ambitious person', partnerRole: 'Mentor figure', speakingPoints: ['I am aiming for...', 'Career path', 'Leadership role'], vocabulary: ['Promotion', 'Development', 'Mentorship'], tips: 'Be clear about ambitions.' },
    evening: { title: 'Handling a client complaint', scenario: 'Handling a client complaint about service', userRole: 'Customer service manager', partnerRole: 'Upset client', speakingPoints: ['I completely understand', 'Let me solve this', 'Compensation'], vocabulary: ['Resolution', 'Refund', 'Apology'], tips: 'Validate their feelings first.' }
  },
  {
    day: 29,
    week: 5,
    difficulty: '5/5',
    dailyGoal: 'Present facts diplomatically, discuss complex topics, find win-win solutions',
    morning: { title: 'Discussing current events', scenario: 'Discussing current events/politics carefully', userRole: 'Thoughtful commentator', partnerRole: 'Someone with different view', speakingPoints: ['It is a complex issue', 'Data suggests...', 'Common ground'], vocabulary: ['Policy', 'Debate', 'Society'], tips: 'Stay neutral and respectful.' },
    evening: { title: 'Negotiating contract renewal', scenario: 'Negotiating a contract renewal with client', userRole: 'Sales manager', partnerRole: 'Long-term client', speakingPoints: ['Our partnership', 'Renewal terms', 'Loyalty discount'], vocabulary: ['Renewal', 'Term', 'Partnership'], tips: 'Emphasize past success.' }
  },
  {
    day: 30,
    week: 5,
    difficulty: '5/5',
    dailyGoal: 'Lead conversations confidently, handle multiple topics, demonstrate mastery',
    morning: { title: 'Complex problem-solving', scenario: 'Complex problem-solving conversation', userRole: 'Problem-solver', partnerRole: 'Collaborator', speakingPoints: ['Let’s analyze the root cause', 'Brainstorming', 'Action plan'], vocabulary: ['Analysis', 'Strategy', 'Execution'], tips: 'Lead the discussion.' },
    evening: { title: 'Full client onboarding', scenario: 'Full client onboarding meeting (complex)', userRole: 'Account manager', partnerRole: 'New premium client', speakingPoints: ['Let’s get started', 'Overview of services', 'Your success team'], vocabulary: ['Onboarding', 'Integration', 'Success'], tips: 'You are the expert now. Own it.' }
  }
];