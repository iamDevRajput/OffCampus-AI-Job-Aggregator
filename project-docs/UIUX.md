# UI/UX Requirements

## Visual Direction
- Dark professional dashboard
- Inspired by college placement portal/job-card dashboard
- Clear dense layout for repeated daily use
- No marketing landing page for MVP; first screen after login should be the job dashboard

## Main Layout
- Left sidebar: Dashboard, Saved, Applied, Ignored, Profile, Target Companies, Sources/Admin, Settings
- Top bar: search, filters, profile menu
- Main area: job cards/feed
- Right summary panel: profile match stats, top skills, priority alerts

## Job Card Fields
- Company name
- Job title
- Priority Company badge when applicable
- Match score
- Match reasons
- Skills/tags
- Package/salary or "Not disclosed"
- Location and work mode
- Experience eligibility
- Deadline or posted date
- Source name
- Apply button
- Save, Applied, Ignore actions

## Dashboard Behavior
- Priority company openings should appear first.
- Strong match openings should be visually highlighted.
- Auto-refresh every 30 seconds or use SSE/WebSocket later.
- Empty states should explain what the user needs to add next.

## Profile Page
- Form sections: Basic details, Skills, Preferences, Resume
- Save button with clear success/error state

## Target Companies Page
- Table/list of companies
- Add/edit company modal
- Fields: name, aliases, career URL, source type, priority level, active
- Status: last checked, jobs found, errors

## Admin Sources Page
- List configured job sources
- Enable/disable source
- Last fetched time
- Last error
- Manual "Run fetch now" button for development

