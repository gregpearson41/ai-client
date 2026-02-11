Data Flow Summary
1. Backend: MongoDB Model
admin-backend/src/models/Topic.js — Topics are stored in MongoDB with fields like topic_name, topic_label, description, and active.

2. Backend: API Endpoint
admin-backend/src/routes/publicTopics.js → admin-backend/src/controllers/topicController.js

Route: GET /api/public/topics (public, no auth required)
Query: Topic.find({ active: true }) — only fetches active topics
Select: _id, topic_name, topic_label, description
Sort: Alphabetical by topic_label
3. Frontend: Custom Hook
client-frontend/src/pages/ToolsPage_two/useToolsPage_two.ts

On component mount, useEffect triggers fetchTopics()
Calls GET ${ADMIN_API_URL}/api/public/topics (defaults to http://localhost:5050)
Stores the response in topics state, with topicsLoading and topicsError flags
4. Frontend: Dropdown Component
client-frontend/src/pages/ToolsPage_two/ToolsPage_two.tsx

Uses a Material-UI <TextField select> component
Maps over the topics array to render <MenuItem> elements
Each item uses topic._id as the value and topic.topic_label as the display text
When selected, the topic's _id is stored in formData.topic
5. On Form Submit
The selected topic._id is sent as topic_id in the POST payload to /api/public/chat-prompt.

In short: Topics are managed in MongoDB via the admin backend, exposed through a public REST endpoint, fetched on component mount via a custom React hook, and rendered as MUI <MenuItem> elements in a select dropdown.