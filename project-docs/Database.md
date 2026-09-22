# Database Schema

## User
- id
- name
- email
- passwordHash
- createdAt
- updatedAt

## Profile
- id
- userId
- college
- batchYear
- experienceLevel
- preferredRoles
- preferredLocations
- preferredWorkModes
- minSalary
- resumeUrl
- rawResumeText
- createdAt
- updatedAt

## Skill
- id
- name
- category
- normalizedName

## UserSkill
- id
- userId
- skillId
- level

## TargetCompany
- id
- userId
- name
- aliases
- careerPageUrl
- sourceType
- priorityLevel
- isActive
- lastCheckedAt
- createdAt
- updatedAt

## JobSource
- id
- name
- type
- baseUrl
- apiUrl
- isActive
- fetchFrequencyMinutes
- lastFetchedAt
- lastError
- createdAt
- updatedAt

## Job
- id
- sourceId
- targetCompanyId
- externalId
- title
- company
- normalizedCompany
- description
- applyUrl
- location
- workMode
- employmentType
- minSalary
- maxSalary
- currency
- experienceMin
- experienceMax
- deadline
- postedAt
- discoveredAt
- contentHash
- isPriorityCompany
- status
- rawData
- createdAt
- updatedAt

## JobSkill
- id
- jobId
- skillId
- confidence

## JobMatch
- id
- userId
- jobId
- score
- reasons
- createdAt
- updatedAt

## SavedJob
- id
- userId
- jobId
- status
- notes
- createdAt
- updatedAt

## Alert
- id
- userId
- jobId
- type
- channel
- status
- sentAt
- createdAt

## Company (Phase 3D)
- id
- companyId (CMP-000001, deterministic unique)
- slug (unique)
- name
- normalizedName (unique)
- officialWebsite
- careerUrl
- industry
- country
- primaryLocations
- logoUrl
- coverImageUrl
- active
- notificationEnabled
- notificationPreferences
- createdAt
- updatedAt

## CompanyAlias (Phase 3D)
- id
- companyId
- alias
- normalizedAlias
- isPotentialDuplicate
- createdAt

## CompanyConnection (Phase 3D)
- id
- companyId
- atsType (GREENHOUSE, LEVER, ASHBY, SMART_RECRUITERS, RECRUITEE, WORKABLE)
- boardToken
- apiUrl
- status (CONNECTED, EXTERNAL, ERROR, DISABLED, UNKNOWN)
- lastCheckedAt
- lastSuccessAt
- lastError
- jobCount
- createdAt
- updatedAt


