# EduAI Platform - Educational AI Learning Platform

## Overview
A Next.js educational platform combining Notion-like folder organization with ChatGPT-style AI-powered features for document summarization, quiz generation, and intelligent learning assistance.

## Project Status
- **Created**: November 3, 2025
- **Status**: Core infrastructure complete, requires API keys for full functionality

## Architecture

### Tech Stack
- **Frontend**: Next.js 15+ with App Router, React 18, Tailwind CSS
- **Backend**: Next.js API Routes with Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with server-side sessions
- **AI**: Google Gemini AI for chat, summarization, and quiz generation
- **File Storage**: UploadThing for cloud file storage and management
- **Real-time Updates**: TanStack Query for seamless data synchronization
- **UI Components**: Custom components with Lucide icons
- **File Upload**: react-dropzone
- **Drag & Drop**: @dnd-kit for folder organization
- **Markdown Rendering**: react-markdown with remark-math, rehype-katex for LaTeX math support
- **Math Rendering**: KaTeX for beautiful mathematical equations (inline and display mode)

### Database Schema
- **Users**: User accounts with email/password authentication
- **Conversations**: Each chat or summarization session with unique IDs
- **Messages**: All messages linked to their specific conversation ID
- **Folders**: Hierarchical folder structure with parent-child relationships
- **Files**: Uploaded files with metadata (name, size, pages, type)
- **Quizzes**: AI-generated quizzes linked to files
- **QuizQuestions**: Individual quiz questions with answers and explanations

## Features Implemented

### ✅ Authentication & User Management
- Server-side authentication with NextAuth.js (instant page loads, no loading screens)
- Login/Signup pages with form validation
- Profile page with user settings management
- Secure password hashing with bcrypt
- JWT-based session management

### ✅ Database & State Management
- PostgreSQL database with Prisma ORM
- Complete database schema with all relationships
- TanStack Query for real-time updates and optimistic UI
- Conversation ID system for completely isolated chat contexts

### ✅ Folders & File Organization
- Hierarchical folder system with unlimited nesting
- Create, rename, and delete folders with confirmation dialogs
- Drag-and-drop folder reordering with @dnd-kit
- Parent-child folder relationships
- Folder-specific file viewing

### ✅ File Management
- File upload with drag-and-drop support
- Supported formats: JPG, PNG, PDF, DOCX
- UploadThing integration for cloud file storage
- Automatic file parsing and metadata extraction (size, pages, type)
- File download functionality
- File deletion with cascade cleanup

### ✅ AI-Powered Features
- **Chat Interface**: ChatGPT-style conversations with Gemini AI
- **Document Summarization**: Click summarize on any file to get AI-generated summary in dedicated conversation window
- **Quiz Generation**: Generate quizzes from uploaded documents with multiple-choice questions
- **PYQ Analysis**: Upload Previous Year Questions to generate similar question patterns from your notes
- **Image Vision**: Upload images (diagrams, handwritten notes, equations) and Gemini can understand and explain the content
- **Math Support**: AI responses render LaTeX math equations beautifully with KaTeX (inline $...$ and display $$...$$ modes)
- Each feature creates isolated conversation contexts

### ✅ Quiz System
- AI-generated quizzes with 10 questions per file
- Multiple question types (multiple choice, checkbox, dropdown)
- Interactive quiz-taking interface with progress tracking
- Question navigation (previous/next)
- Submit and view results with detailed feedback
- Correct/incorrect answer highlighting
- Explanations for each question
- Score calculation and percentage display

### ✅ Export & Download
- **Full Conversation Export**: Download entire chat conversation as PDF via dropdown menu
- **Individual Message Export**: Download single chat bubbles as PDFs with hover buttons
- **Save to Folder**: Save entire conversations or individual messages directly to folders
- **File Downloads**: Download original files directly from file cards
- Export includes timestamps and formatted messages

### ✅ File Preview & Management
- **Instagram/Twitter-Style Preview**: Click any file card to open full-screen preview modal
- **Navigation**: Use arrow keys or on-screen buttons to navigate between files
- **Image Viewing**: Full-screen image preview with zoom-to-fit
- **PDF Viewing**: Embedded PDF viewer in preview modal
- Clickable file cards (excluding action buttons)

### ✅ UI/UX
- Leftmost collapsible sidebar with navigation (Chat, Folders, Profile)
- Expandable history sidebar for conversation threads
- **Windows Explorer-Style Folder Management**: Browse folders and files in unified view
- **Action Cards**: "New Folder" and "Add Files" cards at top of folder contents
- **Hover Actions**: Download and save buttons appear on chat message hover
- **Dropdown Menu**: Chat actions menu with Download and Save to Folder options
- **Folder Picker Dialog**: Reusable Windows Explorer-style dialog for folder selection
- Custom markdown rendering with comprehensive CSS styling
- Responsive design with Tailwind CSS
- Loading states and error handling
- Toast notifications for user actions
- Smooth animations and transitions

### ✅ Layout Structure
- **Main Sidebar**: Navigation between Chat, Folders, and Profile
- **History Sidebar** (Chat page): Conversation history with "New Chat" button
- **Folders Page**: Windows Explorer-style with expandable folder tree on left, subfolders and files displayed together in main area
- **Chat Page**: Full-width chat interface with history sidebar and per-message actions
- **Quiz Page**: Full-screen quiz interface with progress tracking
- **File Preview**: Full-screen modal overlay with navigation and download options

## Environment Variables Required

### Database (Already Configured)
- DATABASE_URL
- PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE

### Required for Full Functionality
- **GEMINI_API_KEY**: Google Gemini AI API key for chat and AI features
- **UPLOADTHING_SECRET**: UploadThing secret key for file storage (Already Configured)
- **UPLOADTHING_APP_ID**: UploadThing app ID for file storage (Already Configured)
- **NEXTAUTH_SECRET**: Secret for NextAuth.js sessions (defaults to SESSION_SECRET)

## Complete User Journey

### 1. **Sign Up / Login**
- Create account at `/signup` with name, email, and password
- Login at `/login` with credentials
- Session persists across page refreshes

### 2. **Start Chatting**
- Click "Chat" in sidebar to open chat interface
- Type message and press Enter or click Send
- AI responds using Gemini model
- View conversation history in expandable sidebar
- Click "New Chat" to start fresh conversation
- Export any conversation as PDF using download button

### 3. **Organize with Folders (Windows Explorer Style)**
- Click "Folders" in sidebar
- **Create Root Folder**: Click "+" in sidebar or use "New Folder" card in main area
- **Create Subfolders**: Select parent folder, then use "New Folder" card or hover over folder in picker
- **Browse Subfolders**: Click subfolder cards to navigate deeper
- Expand/collapse folders in sidebar tree
- Drag folders to reorder them
- Click three dots on folder for rename/delete options
- **Unified View**: See both subfolders and files together in main area

### 4. **Upload Files**
- Select a folder from left panel (or create new one)
- Click "Add Files" card at top of folder contents
- Or click "+" in sidebar for quick access
- Supported: JPG, PNG, PDF, DOCX
- Files automatically parsed for metadata (size, pages, type)
- View uploaded files as cards alongside subfolders

### 4b. **Preview Files**
- Click anywhere on a file card (except action buttons) to open preview
- Navigate between files using arrow keys or on-screen buttons
- Press Escape or click X to close preview
- Download files directly from preview modal

### 5. **Summarize Documents**
- Click "Summarize" button on any file card
- AI analyzes document and creates summary
- Opens dedicated conversation window
- Continue chatting about the document
- Summary conversation saved in history

### 6. **Generate & Take Quizzes**
- Click "Quiz" button on any file card
- AI generates 10 multiple-choice questions
- Navigate through questions with Previous/Next
- Select answers by clicking options
- Submit quiz when done
- View detailed results with:
  - Score percentage and correct count
  - Each question with your answer
  - Correct answers for wrong questions
  - Explanations for all questions

### 7. **PYQ Analysis (Advanced)**
- When generating quiz, optionally include PYQ file ID
- AI analyzes patterns from Previous Year Questions
- Generates similar style questions from your notes
- Helps predict exam question patterns

### 8. **Download & Export**
- **Download Files**: Click "Download" on file card or in preview modal
- **Export Full Conversation**: Click menu icon (☰) in chat header → "Download as PDF"
- **Export Single Message**: Hover over any chat bubble → Click "Download"
- **Save to Folder**: 
  - For full conversation: Click menu icon → "Save to Folder" → Select folder
  - For single message: Hover over bubble → Click "Save" → Select folder
  - Create new folders directly in the picker dialog
- All exports include timestamps and formatted content

### 9. **Manage Profile**
- Click "Profile" in sidebar
- Update your name
- View account email
- Save changes

## Development Notes

### Custom Markdown Styling
All markdown elements have dedicated CSS classes in `styles/markdown.css`:
- Headings: `.markdown-h1` through `.markdown-h6`
- Paragraphs: `.markdown-paragraph`
- Lists: `.markdown-list-unordered`, `.markdown-list-ordered`
- Code: `.markdown-code-inline`, `.markdown-code-block`
- Tables: `.markdown-table`, `.markdown-thead`, `.markdown-tbody`
- And more...

### Conversation Isolation
Each chat and summarization session maintains its own unique conversation ID. Messages are stored with foreign keys to their conversation, ensuring complete separation between different sessions.

### Layout Structure
- Leftmost sidebar (collapsible): Main navigation
- History sidebar (expandable): Conversation threads
- Main content area: Chat interface or folder view

## Recent Changes
- November 6, 2025: **Major UI/UX Overhaul - Notion-Style File Management**
  - **File Preview System**: Implemented Instagram/Twitter-style full-screen preview modal for all files
  - **Windows Explorer Folders**: Redesigned folder page to show subfolders and files together in main area
  - **Action Cards**: Replaced drag-drop zone with "New Folder" and "Add Files" cards at top of contents
  - **Subfolder Support**: Full nested folder navigation with expandable tree in sidebar
  - **Folder Picker Dialog**: Reusable Windows Explorer-style dialog for selecting save locations
  - **Chat Enhancements**:
    - Individual message PDF downloads with hover buttons
    - Dropdown menu for chat actions (Download, Save to Folder)
    - Save entire conversations or single messages to any folder
    - Create new folders directly from save dialog
  - **Improved Navigation**: Click file cards to preview, click subfolder cards to navigate
  - **Hover Actions**: Download and Save buttons appear on chat message hover
- November 5, 2025: **Added Math Rendering and Image Vision Support**
  - Installed remark-math, rehype-katex, and katex packages for LaTeX math rendering
  - Updated MarkdownContent component to support inline ($...$) and display ($$...$$) math equations
  - Added KaTeX CSS for beautiful mathematical equation rendering
  - Modified file parser to convert images to base64 format
  - Implemented Gemini Vision API support for multimodal content (text + images)
  - Updated chat API to use vision model when images are uploaded
  - Gemini can now understand and explain diagrams, handwritten notes, and equations in images
- November 5, 2025: **Migrated file storage from Supabase to UploadThing**
  - Replaced all Supabase storage functions with UploadThing API
  - Updated file upload, download, and deletion across all API routes
  - Configured UploadThing with authentication middleware and file type validations
  - All file operations now use UploadThing's secure cloud storage
- November 3, 2025: Initial project setup with core authentication and chat infrastructure
  - Database schema created and migrated
  - Basic chat UI implemented with conversation isolation
  - Custom markdown rendering with comprehensive CSS styling
