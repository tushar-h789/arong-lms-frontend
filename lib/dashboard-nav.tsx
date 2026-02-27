/**
 * Role-based sidebar navigation configuration.
 * Maps each role to its menu items.
 */

import type { ReactNode } from 'react'
import {
  LayoutDashboardIcon,
  UsersIcon,
  BookOpenIcon,
  ShieldIcon,
  Building2Icon,
  SettingsIcon,
  BarChart3Icon,
  FileTextIcon,
  ClipboardListIcon,
  GraduationCapIcon,
  TrophyIcon,
  MessageSquareIcon,
  ActivityIcon,
  AwardIcon,
  BellIcon,
  PenLineIcon,
  RouteIcon,
} from '@/icons'

export type NavItemChild = { label: string; href: string }

export type NavItem = {
  label: string
  href: string
  icon: ReactNode
  children?: NavItemChild[]
}

export type RoleType = 'admin' | 'instructor' | 'learner' | 'hr' | 'org' | 'auditor' | 'it' | 'manager'

export const ROLES: RoleType[] = ['admin', 'instructor', 'learner', 'hr', 'org', 'auditor', 'it', 'manager']

const iconClass = 'size-5'

/** Base path for each role */
const base = {
  admin: '/dashboard/admin',
  instructor: '/dashboard/instructor',
  learner: '/dashboard/learner',
  hr: '/dashboard/hr',
  org: '/dashboard/admin/org',
  auditor: '/dashboard/auditor',
  it: '/dashboard/it',
  manager: '/dashboard/manager',
}

const reportsBase = `${base.admin}/reports`
const accessBase = `${base.admin}/access`

/** Role-specific navigation items */
export const NAV_ITEMS: Record<RoleType, NavItem[]> = {
  admin: [
    { label: 'Dashboard', href: base.admin, icon: <LayoutDashboardIcon className={iconClass} /> },
    {
      label: 'Users & Access',
      href: `${base.admin}/users`,
      icon: <UsersIcon className={iconClass} />,
      children: [
        { label: 'Users (List)', href: `${base.admin}/users` },
        { label: 'Invitations & Onboarding', href: `${base.admin}/users/invitations` },
        { label: 'Bulk Operations (Import Center)', href: `${base.admin}/users/import` },
        { label: 'Roles & Permissions (RBAC)', href: `${base.admin}/roles` },
        { label: 'Access Policies (Scope rules)', href: `${accessBase}/policies` },
        { label: 'Security & Login Controls', href: `${accessBase}/security` },
        { label: 'Audit Logs', href: `${accessBase}/audit-logs` },
      ],
    },
    {
      label: 'Course & Content',
      href: `${base.admin}/courses`,
      icon: <BookOpenIcon className={iconClass} />,
      children: [
        { label: 'Courses', href: `${base.admin}/courses` },
        { label: 'Course Builder', href: `${base.admin}/courses/new` },
        { label: 'Asset Library', href: `${base.admin}/asset-library` },
        { label: 'Course Templates', href: `${base.admin}/course-templates` },
        { label: 'Review & Approval', href: `${base.admin}/review-approval` },
        { label: 'Localization', href: `${base.admin}/localization` },
        { label: 'Course Analytics', href: `${base.admin}/course-analytics` },
      ],
    },
    // { label: 'Organization', href: `${base.admin}/org`, icon: <Building2Icon className={iconClass} /> },
    {
      label: 'Learning Paths',
      href: `${base.admin}/paths`,
      icon: <RouteIcon className={iconClass} />,
      children: [
        { label: 'Paths (List)', href: `${base.admin}/paths` },
        { label: 'Path Builder', href: `${base.admin}/paths/new` },
        { label: 'Path Templates', href: `${base.admin}/path-templates` },
        { label: 'Cohorts / Batches', href: `${base.admin}/cohorts` },
      ],
    },
    {
      label: 'Assignments',
      href: `${base.admin}/assignments`,
      icon: <FileTextIcon className={iconClass} />,
      children: [
        { label: 'Assign Training (Create Assignment)', href: `${base.admin}/assignments` },
        { label: 'Assignment Monitor', href: `${base.admin}/assignments/monitor` },
        { label: 'Cohorts / Batches', href: `${base.admin}/assignments/cohorts` },
        { label: 'Reminder Center', href: `${base.admin}/assignments/reminders` },
        { label: 'Auto-Assignment Rules', href: `${base.admin}/assignments/rules` },
      ],
    },
    {
      label: 'Assessments & Grading',
      href: `${base.admin}/assessments`,
      icon: <ClipboardListIcon className={iconClass} />,
      children: [
        { label: 'Question Bank', href: `${base.admin}/assessments/question-bank` },
        { label: 'Quiz Builder', href: `${base.admin}/assessments/quiz-builder` },
        { label: 'Grading Queue', href: `${base.admin}/grading` },
      ],
    },
    {
      label: 'Reports',
      href: `${reportsBase}`,
      icon: <BarChart3Icon className={iconClass} />,
      children: [
        { label: 'Overview', href: `${reportsBase}/overview` },
        { label: 'Training Needs Analysis (TNA)', href: `${reportsBase}/training-needs-analysis` },
        { label: 'Learner Progress', href: `${reportsBase}/learner-progress` },
        { label: 'Course Completion', href: `${reportsBase}/course-completion` },
        { label: 'Assessments', href: `${reportsBase}/assessments` },
        { label: 'Item Analysis', href: `${reportsBase}/item-analysis` },
        { label: 'Compliance & Certificates', href: `${reportsBase}/compliance-certificates` },
        { label: 'Attendance & Activity', href: `${reportsBase}/attendance-activity` },
        { label: 'Engagement & Resources', href: `${reportsBase}/engagement-resources` },
        { label: 'Training Feedback & Evaluation', href: `${reportsBase}/feedback-evaluation` },
        { label: 'Production Quality Impact', href: `${reportsBase}/production-quality` },
        { label: 'Learning Paths', href: `${reportsBase}/learning-paths` },
        { label: 'Export Center', href: `${reportsBase}/export-center` },
      ],
    },
    {
      label: 'Gamification',
      href: `${base.admin}/gamification`,
      icon: <TrophyIcon className={iconClass} />,
      children: [
        { label: 'Badges', href: `${base.admin}/gamification/badges` },
        { label: 'Points', href: `${base.admin}/gamification/points` },
        { label: 'Leaderboards', href: `${base.admin}/gamification/leaderboards` },
        { label: 'Rewards & Recognition', href: `${base.admin}/gamification/rewards-recognition` },
        { label: 'Gamification Analytics', href: `${base.admin}/gamification/analytics` },
      ],
    },
    {
      label: 'Communication',
      href: `${base.admin}/communication`,
      icon: <MessageSquareIcon className={iconClass} />,
      children: [
        { label: 'Announcements (Broadcast)', href: `${base.admin}/communication/announcements` },
        { label: 'Help Desk / Q&A', href: `${base.admin}/communication/help-desk` },
        { label: 'Discussions / Forums', href: `${base.admin}/communication/discussions` },
        { label: 'Live Sessions', href: `${base.admin}/communication/live-sessions` },
        { label: 'Notifications Center', href: `${base.admin}/communication/notifications` },
        { label: 'Message Templates', href: `${base.admin}/communication/message-templates` },
        { label: 'Content Moderation & Safety', href: `${base.admin}/communication/content-moderation` },
      ],
    },
   
    {
      label: 'People & Growth',
      href: `${base.admin}/promotion-eligibility`,
      icon: <AwardIcon className={iconClass} />,
      children: [
        { label: 'Promotion & Eligibility', href: `${base.admin}/promotion-eligibility` },
      ],
    },
    {
      label: 'Settings & Integrations',
      href: `${base.admin}/settings`,
      icon: <SettingsIcon className={iconClass} />,
      children: [
        { label: 'Settings Overview', href: `${base.admin}/settings` },
        { label: 'Branding & Theme', href: `${base.admin}/settings/branding` },
        { label: 'Certificate Templates', href: `${base.admin}/settings/certificate-templates` },
        { label: 'Email/SMS/Message Templates', href: `${base.admin}/settings/email-sms-templates` },
        { label: 'Integrations Hub', href: `${base.admin}/settings/integrations` },
        { label: 'HR Sync', href: `${base.admin}/settings/hr-sync` },
        { label: 'AMS Integration', href: `${base.admin}/settings/ams-integration` },
        { label: 'SSO / Authentication', href: `${base.admin}/settings/sso-auth` },
        { label: 'Video Conferencing', href: `${base.admin}/settings/video-conferencing` },
        { label: 'Security Policies', href: `${base.admin}/settings/security` },
        { label: 'Access Control', href: `${base.admin}/settings/access-control` },
        { label: 'Audit Logs', href: `${base.admin}/settings/audit-logs` },
        { label: 'System Logs / Health', href: `${base.admin}/settings/system-logs` },
      ],
    },
    {
      label: 'Support',
      href: `${base.admin}/support`,
      icon: <MessageSquareIcon className={iconClass} />,
    },
  ],
  instructor: [
    { label: 'Dashboard', href: base.instructor, icon: <LayoutDashboardIcon className={iconClass} /> },
    { label: 'My Courses', href: `${base.instructor}/my-courses`, icon: <BookOpenIcon className={iconClass} /> },
    {
      label: 'Assessments',
      href: `${base.instructor}/assessments`,
      icon: <ClipboardListIcon className={iconClass} />,
      children: [
        { label: 'Question Bank', href: `${base.instructor}/assessments/question-bank` },
        { label: 'Quiz Builder', href: `${base.instructor}/assessments/quiz-builder` },
        { label: 'Attempts & Results', href: `${base.instructor}/assessments/attempts` },
      ],
    },
    { label: 'Grading', href: `${base.instructor}/grading`, icon: <PenLineIcon className={iconClass} /> },
    { label: 'Communication', href: `${base.instructor}/communication`, icon: <MessageSquareIcon className={iconClass} /> },
    { label: 'Insights', href: `${base.instructor}/insights`, icon: <ActivityIcon className={iconClass} /> },
  ],
  learner: [
    { label: 'Dashboard', href: base.learner, icon: <LayoutDashboardIcon className={iconClass} /> },
    { label: 'My Learning', href: `${base.learner}/my-learning`, icon: <GraduationCapIcon className={iconClass} /> },
    { label: 'Courses', href: `${base.learner}/course`, icon: <BookOpenIcon className={iconClass} /> },
    { label: 'Assessments', href: `${base.learner}/quiz`, icon: <ClipboardListIcon className={iconClass} /> },
    { label: 'Progress', href: `${base.learner}/progress`, icon: <ActivityIcon className={iconClass} /> },
    { label: 'Certificates', href: `${base.learner}/certificates`, icon: <AwardIcon className={iconClass} /> },
    { label: 'Notifications', href: `${base.learner}/notifications`, icon: <BellIcon className={iconClass} /> },
    { label: 'IT Support', href: `${base.learner}/it-support`, icon: <MessageSquareIcon className={iconClass} /> },
  ],
  hr: [
    { label: 'Dashboard', href: base.hr, icon: <LayoutDashboardIcon className={iconClass} /> },
    { label: 'My Courses', href: `${base.hr}/my-courses`, icon: <BookOpenIcon className={iconClass} /> },
    { label: 'Assessments', href: `${base.hr}/assessments`, icon: <ClipboardListIcon className={iconClass} /> },
    { label: 'Grading', href: `${base.hr}/grading`, icon: <PenLineIcon className={iconClass} /> },
    { label: 'Communication', href: `${base.hr}/communication`, icon: <MessageSquareIcon className={iconClass} /> },
    { label: 'Insights', href: `${base.hr}/insights`, icon: <ActivityIcon className={iconClass} /> },
  ],
  org: [
    { label: 'Organization', href: base.org, icon: <Building2Icon className={iconClass} /> },
    { label: 'Dashboard', href: base.admin, icon: <LayoutDashboardIcon className={iconClass} /> },
    { label: 'Users', href: `${base.admin}/users`, icon: <UsersIcon className={iconClass} /> },
    { label: 'Courses', href: `${base.admin}/courses`, icon: <BookOpenIcon className={iconClass} /> },
    { label: 'Settings', href: `${base.admin}/settings`, icon: <SettingsIcon className={iconClass} /> },
  ],
  auditor: [
    { label: 'Dashboard', href: base.auditor, icon: <LayoutDashboardIcon className={iconClass} /> },
    { label: 'Audit Trail', href: `${base.auditor}/audit-trail`, icon: <FileTextIcon className={iconClass} /> },
    { label: 'Activity Logs', href: `${base.auditor}/activity-logs`, icon: <ActivityIcon className={iconClass} /> },
    { label: 'Compliance', href: `${base.auditor}/compliance`, icon: <ShieldIcon className={iconClass} /> },
  ],
  it: [
    { label: 'Dashboard', href: base.it, icon: <LayoutDashboardIcon className={iconClass} /> },
    { label: 'Security', href: `${base.it}/security-monitoring`, icon: <ShieldIcon className={iconClass} /> },
    { label: 'Integrations', href: `${base.it}/integrations`, icon: <Building2Icon className={iconClass} /> },
    { label: 'Performance', href: `${base.it}/performance`, icon: <BarChart3Icon className={iconClass} /> },
    { label: 'IT Support', href: `${base.it}/support`, icon: <MessageSquareIcon className={iconClass} /> },
  ],
  manager: [
    { label: 'Dashboard', href: base.manager, icon: <LayoutDashboardIcon className={iconClass} /> },
    { label: 'Assign', href: `${base.manager}/assign`, icon: <ClipboardListIcon className={iconClass} /> },
    { label: 'Team Progress', href: `${base.manager}/team-progress`, icon: <ActivityIcon className={iconClass} /> },
    { label: 'Compliance', href: `${base.manager}/compliance`, icon: <ShieldIcon className={iconClass} /> },
    { label: 'Reports', href: `${base.manager}/reports`, icon: <BarChart3Icon className={iconClass} /> },
  ],
}

/** Derive role from current pathname */
export function getRoleFromPath(pathname: string): RoleType {
  if (pathname.startsWith('/dashboard/admin/org') || pathname === '/dashboard/admin/org') return 'org'
  if (pathname.startsWith('/dashboard/admin')) return 'admin'
  if (pathname.startsWith('/dashboard/instructor')) return 'instructor'
  if (pathname.startsWith('/dashboard/learner')) return 'learner'
  if (pathname.startsWith('/dashboard/hr')) return 'hr'
  if (pathname.startsWith('/dashboard/auditor')) return 'auditor'
  if (pathname.startsWith('/dashboard/it')) return 'it'
  if (pathname.startsWith('/dashboard/manager')) return 'manager'
  return 'admin'
}
