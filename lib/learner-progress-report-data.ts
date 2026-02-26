/**
 * Learner Progress Report (Admin) — individual and group/department progress.
 * Replace with API later.
 */

export interface IndividualProgressRow {
  id: string
  name: string
  department: string
  assigned: number
  inProgress: number
  completed: number
  overdue: number
  avgScore: number | null
  timeSpent: string
}

export interface GroupProgressRowChild {
  id: string
  name: string
  assigned: number
  inProgress: number
  completed: number
  overdue: number
  avgScore: number
  timeSpent: string
}

export interface GroupProgressRow {
  id: string
  name: string
  department: string
  assigned: number
  inProgress: number
  completed: number
  overdue: number
  avgScore: number
  timeSpent: string
  children?: GroupProgressRowChild[]
}

export interface LearnerProgressReportData {
  individual: IndividualProgressRow[]
  group: GroupProgressRow[]
}

const INDIVIDUAL: IndividualProgressRow[] = [
  { id: 'u1', name: 'Rahim Ahmed', department: 'Weaving', assigned: 5, inProgress: 1, completed: 4, overdue: 0, avgScore: 82, timeSpent: '12h' },
  { id: 'u2', name: 'Fatima Khan', department: 'Embroidery', assigned: 4, inProgress: 2, completed: 2, overdue: 1, avgScore: 75, timeSpent: '8h' },
  { id: 'u3', name: 'Karim Hossain', department: 'Dyeing', assigned: 6, inProgress: 2, completed: 3, overdue: 1, avgScore: 68, timeSpent: '15h' },
  { id: 'u5', name: 'Imran Rahman', department: 'Weaving', assigned: 4, inProgress: 1, completed: 2, overdue: 1, avgScore: null, timeSpent: '5h' },
  { id: 'u9', name: 'Tasnim Akter', department: 'Weaving', assigned: 3, inProgress: 0, completed: 3, overdue: 0, avgScore: 88, timeSpent: '9h' },
  { id: 'u10', name: 'Mofizul Islam', department: 'Dyeing', assigned: 5, inProgress: 3, completed: 0, overdue: 2, avgScore: null, timeSpent: '4h' },
]

const GROUP: GroupProgressRow[] = [
  {
    id: 'dept-weaving',
    name: 'Weaving',
    department: 'Weaving',
    assigned: 12,
    inProgress: 2,
    completed: 10,
    overdue: 0,
    avgScore: 85,
    timeSpent: '32h',
    children: [
      { id: 'gr-weaving-a', name: 'Weaving A', assigned: 6, inProgress: 1, completed: 5, overdue: 0, avgScore: 86, timeSpent: '16h' },
      { id: 'gr-weaving-b', name: 'Weaving B', assigned: 6, inProgress: 1, completed: 5, overdue: 0, avgScore: 84, timeSpent: '16h' },
    ],
  },
  {
    id: 'dept-embroidery',
    name: 'Embroidery',
    department: 'Embroidery',
    assigned: 8,
    inProgress: 2,
    completed: 5,
    overdue: 1,
    avgScore: 76,
    timeSpent: '20h',
    children: [
      { id: 'gr-emb-a', name: 'Embroidery A', assigned: 4, inProgress: 1, completed: 2, overdue: 1, avgScore: 72, timeSpent: '10h' },
      { id: 'gr-emb-b', name: 'Embroidery B', assigned: 4, inProgress: 1, completed: 3, overdue: 0, avgScore: 80, timeSpent: '10h' },
    ],
  },
  {
    id: 'dept-dyeing',
    name: 'Dyeing',
    department: 'Dyeing',
    assigned: 11,
    inProgress: 5,
    completed: 3,
    overdue: 3,
    avgScore: 65,
    timeSpent: '19h',
    children: [
      { id: 'gr-dyeing-c', name: 'Dyeing C', assigned: 11, inProgress: 5, completed: 3, overdue: 3, avgScore: 65, timeSpent: '19h' },
    ],
  },
]

export const LEARNER_PROGRESS: LearnerProgressReportData = {
  individual: INDIVIDUAL,
  group: GROUP,
}
