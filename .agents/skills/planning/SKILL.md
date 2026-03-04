---
name: planning
description: Interactive feature planning tool that guides you through adding new features to SPEC.md and API.md. Collects requirements through interview-style questions and automatically updates documentation.
---

# Planning - Interactive Feature Planning Skill

## Overview

This skill helps you add new features to SPEC.md and API.md through an interactive interview process. It collects requirements systematically and automatically updates documentation in a consistent format.

## When to Use

Use this skill when you want to add a new feature to the project:

- **User types `/planning`** command
- **User says** "add new feature", "plan feature", "기능 추가"
- **Before backend development** - to define feature requirements
- **When extending the service** - to maintain documentation consistency

## Workflow

### Core Principle: Consultative Approach

This skill doesn't just ask questions - it **actively consults** with you to refine the feature:

- ✅ **Analyze context**: Read SPEC.md/API.md to understand existing patterns
- ✅ **Provide feedback**: Review your answers and suggest improvements
- ✅ **Propose alternatives**: "Have you considered this approach?"
- ✅ **Warn about pitfalls**: Point out potential issues early
- ✅ **Recommend best practices**: Based on existing codebase patterns

**Example Consultation:**
```
User: "Add search API with POST method"

Skill: "🤔 Quick feedback!

I noticed you want to use POST for search. However:
- Current pattern: All read operations use GET (see SPEC.md Section 7)
- RESTful convention: GET for queries, POST for creation
- Benefits of GET: Browser caching, shareable URLs

Recommendation: GET /api/v1/archives/search?keyword={keyword}

Is there a specific reason for using POST? (e.g., complex search filters in body)"
```

---

### Step 1: Feature Overview

Ask the user basic information about the feature:

**Q1. Feature Name & Description**
```
What feature would you like to add? (Brief description)

Examples:
- "Search functionality for archives"
- "Notification system for time capsules"
- "Monthly emotion report"
```

**Q2. User Value**
```
What value does this feature provide to users?

Example:
- "Users can quickly find archives using keywords"
- "Users get notified when time capsules unlock"
```

### Step 2: Feature Details

**Q3. Main Scenarios**
```
Describe the main usage scenario (1-3 steps):

Example:
1. User enters "cafe" in search box
2. System searches content and location names
3. Display matching results in list
```

**Q4. Special Rules or Constraints**
```
Are there any special rules or constraints?

Examples:
- Minimum 2 characters for search
- Maximum 100 results
- Combine with emotion filters
- (Optional - can skip)
```

### Step 3: Data Model

**Q5. Entity Requirement**
```
Do you need a new Entity? (Y/N)

If Y: Ask for entity details
If N: Check if existing entity needs modification
```

**If new Entity (Y):**

**Q5-1. Entity name?**
```
Example: SearchHistory

💡 Naming convention check:
- Current entities: Archive, TimeCapsule, User, Notification
- Pattern: PascalCase, singular noun
- ✅ Good: SearchHistory, UserPreference
- ❌ Avoid: search_history, SearchHistories
```

**Q5-2. Entity fields?**
```
Example:
- user (FK to User, NOT NULL)
- keyword (String, NOT NULL, max 100 chars)
- resultCount (int)
- createdAt (LocalDateTime, auto-generated)

📊 Pattern analysis (from existing entities):
Standard fields all entities have:
- id (PK, Long, auto-increment)
- createdAt (LocalDateTime, auto-generated)
- updatedAt (LocalDateTime, auto-updated)

Common patterns:
- User relationship: user (FK to User, @ManyToOne)
- Soft delete: deletedAt (LocalDateTime, nullable)
- Status fields: Use enums (e.g., CapsuleStatus)

Recommendations based on your feature:
[Provide specific field suggestions]

Missing anything? Should we add:
- deletedAt for soft delete?
- Additional metadata fields?
```

**If modifying existing Entity (N):**
```
Q5-1. Which entity to modify?
Example: Archive

📋 Current Archive fields (from SPEC.md):
- user (FK to User)
- emotion (Emotion enum)
- content (String)
- visibility (Visibility enum)
- location (Location @Embedded)
- likeCount (int)

Q5-2. What fields to add/change?

⚠️ Impact check:
- Adding required field → Need migration strategy
- Changing type → Breaking change for API
- Removing field → Check if used in existing APIs
```

### Step 4: API Design

**Q6. API Endpoint**
```
What is the API endpoint?

Format: [METHOD] /api/v1/[resource]/[path]
Example: GET /api/v1/archives/search
```

**🔍 API Design Review:**

After user provides endpoint, analyze and provide feedback:

```
Your suggestion: [User's answer]

✅ Validation:
- Prefix check: /api/v1 included? (Required)
- HTTP method: Appropriate for operation?
  - GET: Read/Query
  - POST: Create
  - PUT/PATCH: Update
  - DELETE: Delete
- Resource naming: Plural noun? (archives, not archive)

📚 Existing API patterns (from SPEC.md):
- GET /api/v1/archives - List archives
- GET /api/v1/archives/{id} - Get single archive
- POST /api/v1/archives - Create archive
- GET /api/v1/archives/nearby - Geospatial query

💡 Recommendations:
[Based on user's feature, suggest:]
- Consistency with existing endpoints
- RESTful best practices
- Alternative approaches

Example feedback:
"I see you want POST /api/v1/search. However:
- Recommendation: GET /api/v1/archives/search
- Reason: Keeps search under /archives resource (consistent with /archives/nearby)
- Alternative: If search spans multiple resources, POST /api/v1/search is acceptable

Which do you prefer?"
```

---

**Q7. Request Parameters**
```
What are the request parameters?

Example:
- Query params: keyword (required), emotion (optional), page, size
- Path params: (if any)
- Request body: (if any)
```

**📊 Parameter Analysis:**

```
Your parameters: [User's answer]

🔎 Review:
1. Required vs Optional
   - Required: keyword
   - Optional: emotion, page, size
   - ✅ Good: Clear separation

2. Naming Convention Check
   - Current pattern: camelCase (from existing APIs)
   - ✅ Good: keyword, emotion
   - ⚠️ Check: keyword_search → keyword

3. Data Types
   - String: keyword, emotion
   - Integer: page, size
   - ✅ Specify constraints (e.g., keyword: min 2 chars)

💡 Missing considerations:
- Pagination: page, size (recommend: default page=0, size=20)
- Sorting: sort parameter? (e.g., sort=createdAt,desc)
- Filters: Combine with emotion filter?

Recommendations:
Query params:
- keyword (String, required, min 2 chars, max 100 chars)
- emotion (Emotion enum, optional)
- page (int, optional, default 0)
- size (int, optional, default 20, max 100)
- sort (String, optional, default "createdAt,desc")

Agree? Any changes?"
```

---

**Q8. Response Type**
```
What is the response type?

Example:
- Page<ArchiveSummaryResponse>
- ArchiveDetailResponse
- List<NotificationResponse>
```

**🎯 Response Design Review:**

```
Your suggestion: [User's answer]

📋 Existing Response DTOs (from SPEC.md/API.md):
- ArchiveSummaryResponse: Basic archive info (for lists)
- ArchiveDetailResponse: Full archive info (for single item)
- Page<T>: Paginated results (current standard)

✅ Consistency Check:
Your: List<ArchiveResponse>
Pattern: Page<ArchiveSummaryResponse>

💡 Recommendation:
Use: Page<ArchiveSummaryResponse>

Reasons:
1. Consistency: All list endpoints return Page<T>
2. Pagination: Frontend already handles Page format
3. Performance: ArchiveSummaryResponse is lighter than full details

Should response include:
- Search metadata? (e.g., total results, query time)
- Highlighting? (which field matched)
- Suggestions? (did you mean...)

Example enhanced response:
```json
{
  "content": [ArchiveSummaryResponse...],
  "page": 0,
  "size": 20,
  "totalElements": 150,
  "totalPages": 8,
  "metadata": {
    "query": "카페",
    "resultCount": 150,
    "executionTimeMs": 45
  }
}
```

Keep it simple or add metadata?"
```

### Step 5: Document Generation

After collecting all information, automatically update:

1. **SPEC.md Section 2** (Core Features)
   - Add feature description
   - Add usage scenarios
   - Add detailed rules

2. **SPEC.md Section 6** (Data Model)
   - Add new entity definition
   - OR update existing entity

3. **SPEC.md Section 7** (API Endpoints)
   - Add API endpoint specification
   - Add parameters and response info

4. **API.md**
   - Add detailed API specification
   - Add request/response examples
   - Add status codes

5. **(Optional) TASK_LIST.json**
   - Add frontend implementation task

### Step 6: Completion Report

Provide a summary of changes:

```
✅ Documentation updated successfully!

SPEC.md changes:
- Section 2.X: [Feature Name] added
- Section 6: [Entity Name] entity added/updated
- Section 7.X: [API Endpoint] added

API.md changes:
- X. [Feature Name]: Detailed API spec added
  - Request parameters
  - Response schema
  - Status codes
  - Examples

Next steps:
1. Create backend issue: "SPEC.md Section 7.X - Implement [Feature] API"
2. Start backend development (refer to SPEC.md Section 6, 7)
3. Start frontend development (refer to TASK_LIST.json)
4. Run /wrap after completion (auto-sync documentation)
```

## Implementation Details

### Question Strategy

- **One at a time**: Ask questions sequentially, not all at once
- **Provide examples**: Each question includes practical examples
- **Allow skip**: User can skip optional questions
- **Use choices**: When applicable, offer 1/2/3 options

### Document Update Rules

**SPEC.md Formatting:**
```markdown
### 2.X [Feature Name] ([English Name])

#### Feature Description
[1-2 sentences describing user value]

#### Main Scenarios
1. **[Scenario Name]**
   - User action: [...]
   - System behavior: [...]
   - Result: [...]

#### Detailed Rules
| Item | Description |
|------|-------------|
| [Rule] | [Detail] |
```

**Entity Formatting:**
```markdown
[EntityName] ([Korean Name])
├── id (PK, Long, auto-increment)
├── [field1] ([Type], [Constraints])
├── [field2] (FK to [Entity], @ManyToOne)
├── createdAt (LocalDateTime, auto-generated)
└── updatedAt (LocalDateTime, auto-updated)
```

**API Formatting:**
```markdown
### 7.X [Feature Name]
```
[METHOD]  /api/v1/[resource]/[path]  [Description]
                                      [Additional details]
```
```

### Validation

- **Check duplicates**: Verify feature doesn't already exist
- **Consistency**: Follow existing naming conventions
- **Required fields**: Re-ask if critical information is missing
- **API prefix**: Automatically add `/api/v1` if not present

## Example Usage

### Example 1: Search Feature (with Consultative Dialogue)

**User**: `/planning`

**Skill**: "What feature would you like to add?"

**User**: "Search functionality"

**Skill**:
```
Great! Search is a valuable feature. 🔍

Before we dive in, I checked SPEC.md and noticed:
- You already have filtering by emotion (Section 2.2)
- Nearby geospatial search exists (Section 7.3)

💡 Clarification: Is this for:
1. Keyword search (content + location names)
2. Advanced search (filters + keywords combined)
3. Something else?
```

**User**: "1 - Keyword search"

**Skill**:
```
Perfect! Keyword search it is.

Q: What value does this provide to users?
```

**User**: "Users can quickly find archives"

**Skill**:
```
Good! Let me help make this more specific.

Current answer: "Users can quickly find archives"

💡 Enhanced version:
"Users can search their past memories by keywords in content or location names,
making it easy to find specific moments (e.g., 'that cafe visit last month')"

Use enhanced version? (Y/N/Edit)
```

**User**: "Y"

**Skill**:
```
Excellent!

Q: Main usage scenario? (Describe in 1-3 steps)
```

**User**: "User types keyword, sees results"

**Skill**:
```
Got it! Let me expand this a bit:

Your scenario: "User types keyword, sees results"

📊 Detailed scenario (based on existing patterns):
1. User enters "카페" in search box
2. System searches content AND locationName fields
3. Returns matching archives sorted by latest first
4. Display results using existing ArchiveCard component

Sound good? Any changes?
```

**User**: "Perfect"

**Skill**:
```
Great!

Q: Do you need a new Entity for search history tracking? (Y/N)

💡 Consideration:
- Pro: Can show "recent searches", usage analytics
- Con: Additional table, storage cost
- Pattern: Most apps track search for UX improvement

Recommendation: Yes, create SearchHistory
```

**User**: "Yes"

**Skill**:
```
Excellent decision!

Q: Entity name?
Default suggestion: SearchHistory
```

**User**: "SearchHistory"

**Skill**:
```
Perfect! Follows naming convention.

Now, let me suggest fields based on existing entity patterns:

📋 Recommended fields (from Archive, TimeCapsule patterns):
✅ id (PK, Long, auto-increment) - Standard
✅ user (FK to User, @ManyToOne, NOT NULL) - Who searched
✅ keyword (String, NOT NULL, max 100 chars) - Search term
✅ resultCount (int) - Number of results (for analytics)
✅ createdAt (LocalDateTime, auto-generated) - When searched

Optional fields to consider:
💡 appliedFilters (String) - If emotion filter was used
💡 executionTimeMs (Long) - Performance tracking

Include optional fields? (Y/N/Some)
```

**User**: "Just the recommended ones"

**Skill**:
```
Perfect! Keeping it simple.

Q: API endpoint design?

I'll suggest based on existing patterns:

Current pattern analysis:
- GET /api/v1/archives - List all
- GET /api/v1/archives/nearby - Geospatial query
- Pattern: GET for read operations

💡 Recommendation: GET /api/v1/archives/search

Alternative: GET /api/v1/search/archives
(If you plan multi-resource search later)

Which do you prefer?
```

**User**: "First one"

**Skill**:
```
Great choice! Keeps it under /archives resource.

Q: Request parameters?

Based on existing APIs, I suggest:

✅ Query parameters:
- keyword (String, required, min 2 chars, max 100 chars)
- emotion (Emotion enum, optional) - Combine with emotion filter
- page (int, optional, default 0)
- size (int, optional, default 20)

⚠️ Consideration:
Minimum keyword length = 2 chars
Reason: 1-char searches = poor results + DB load

Looks good? Any changes?
```

**User**: "Looks good"

**Skill**:
```
Excellent!

Q: Response type?

Pattern check:
- GET /api/v1/archives returns: Page<ArchiveSummaryResponse>
- GET /api/v1/archives/nearby returns: ArchiveSummaryResponse[]

💡 Recommendation: Page<ArchiveSummaryResponse>

Reasons:
1. Consistency with /archives
2. Frontend pagination already implemented
3. Better performance for large result sets

Alternative: Add search metadata
{
  "results": Page<ArchiveSummaryResponse>,
  "metadata": { "query": "카페", "totalResults": 150 }
}

Simple Page or with metadata?
```

**User**: "Simple Page"

**Skill**:
```
Perfect! KISS principle.

✅ All information collected!

Let me summarize before updating documents:

Feature: Search
- Description: Keyword search for archives (content + location)
- Entity: SearchHistory (user, keyword, resultCount, createdAt)
- API: GET /api/v1/archives/search
- Params: keyword (required, min 2), emotion (optional), page, size
- Response: Page<ArchiveSummaryResponse>

Proceed with documentation update? (Y/N/Review)
```

**User**: "Y"

**Skill**: (Updates documents and reports completion)

**Result**:
```
✅ Documentation updated successfully!

SPEC.md changes:
- Section 2.5: Search Feature added
- Section 6: SearchHistory entity added
- Section 7.3: GET /api/v1/archives/search added

API.md changes:
- 4. Search: Detailed API spec added

Next steps:
1. Create backend issue
2. Backend development
3. Frontend development
4. /wrap after completion
```

### Example 2: Notification Feature (Minimal Input)

**User**: `/planning`

**User**: "Notification for time capsule unlock"

**Skill**: (Asks follow-up questions)

**User**: (Provides minimal answers, skips optional questions)

**Result**:
```
✅ Documentation updated successfully!

SPEC.md changes:
- Section 2.6: Notification Feature added
- Section 6: Notification entity added (if new)
- Section 7.7: GET /api/v1/notifications added

API.md changes:
- 5. Notifications: Basic API spec added
```

## Important Notes

### Do NOT

- ❌ Create code or implementation
- ❌ Modify backend/frontend code
- ❌ Make assumptions without asking
- ❌ Update documents without user confirmation
- ❌ Be dogmatic - always allow user's final decision

### Do

- ✅ Ask clear, concise questions
- ✅ Provide examples for each question
- ✅ Allow users to skip optional questions
- ✅ Maintain existing document format
- ✅ Report all changes clearly
- ✅ Suggest next steps
- ✅ **Analyze existing patterns** from SPEC.md/API.md
- ✅ **Provide contextual feedback** on each answer
- ✅ **Suggest improvements** proactively
- ✅ **Warn about potential issues** early
- ✅ **Respect user's decisions** - you advise, user decides

### Consultative Interaction Pattern

**For each user answer:**

1. **Acknowledge**: "Great! I see you want to..."
2. **Analyze**: Check against existing patterns in SPEC.md/API.md
3. **Feedback**: Point out alignment or mismatches
4. **Suggest**: Offer improvements or alternatives
5. **Explain**: Provide reasoning (performance, consistency, best practices)
6. **Respect**: Allow user to proceed with their choice or adjust

**Example:**
```
User: "POST /api/search with body { keyword, filters }"

Skill:
"I understand you want POST with body. Let me share my thoughts:

✅ POST is reasonable if:
- Complex search filters (nested JSON)
- Sensitive data (passwords, etc.)

💡 However, I noticed:
- Current pattern: GET /api/v1/archives/nearby uses query params
- Your filters seem simple (keyword, emotion)
- Recommendation: GET /api/v1/archives/search?keyword=X&emotion=Y

Benefits:
- Consistency with existing APIs
- Browser caching possible
- Shareable URLs

⚠️ Downside of GET:
- URL length limit (~2000 chars)
- Not suitable for complex filters

Your call! Do you want to:
1. Use GET (recommended for simple search)
2. Use POST (if you anticipate complex filters later)
3. Discuss more?"
```

### Feedback Categories

**1. Pattern Consistency** 🔄
- Compare with existing entities/APIs
- Point out naming conventions
- Suggest following established patterns

**2. Best Practices** ✨
- RESTful principles
- Performance considerations
- Security concerns
- Scalability issues

**3. Potential Issues** ⚠️
- Edge cases
- Performance bottlenecks
- Breaking changes
- Migration complexity

**4. Enhancement Opportunities** 💡
- Additional fields that might be useful
- Alternative approaches
- Future-proofing suggestions

### Tips

1. **Be conversational**: Ask questions naturally, like a product manager
2. **Provide context**: Explain why each question matters
3. **Flexible input**: Accept various answer formats (free text, numbers, Y/N)
4. **Smart defaults**: Suggest common patterns based on existing features
5. **Validation**: Check SPEC.md/API.md for existing similar features
6. **Evidence-based**: Reference actual code/docs when giving feedback
7. **Balanced**: Present pros/cons, let user decide
8. **Constructive**: Frame suggestions positively
9. **Concise**: Keep feedback focused and actionable
10. **Iterative**: Allow back-and-forth refinement

## File Locations

- **SPEC.md**: `/Users/minjiwon/Desktop/feel-archive/docs/SPEC.md`
- **API.md**: `/Users/minjiwon/Desktop/feel-archive/docs/API.md`
- **TASK_LIST.json**: `/Users/minjiwon/Desktop/feel-archive/apps/frontend/docs/TASK_LIST.json`

## Integration with Workflow

This skill fits into the overall workflow:

```
Phase 1: Planning (AUTOMATED with /planning!)
  /planning → Interview → Auto-generate SPEC.md/API.md
  ↓
Phase 2: Backend Development
  Create issue → Develop → PR & Merge
  ↓
Phase 3: Frontend Development
  Develop → PR & Merge
  ↓
Phase 4: Documentation Sync (AUTOMATED with /wrap!)
  /wrap → Auto-sync SPEC.md/API.md with actual code
```

**Result**: Phases 1 and 4 fully automated! 🎉
