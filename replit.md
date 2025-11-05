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
- **Markdown Rendering**: react-markdown with custom CSS styling

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
- PDF export for any chat conversation
- Download files directly from file cards
- Export includes timestamps and formatted messages

### ✅ UI/UX
- Leftmost collapsible sidebar with navigation (Chat, Folders, Profile)
- Expandable history sidebar for conversation threads
- Custom markdown rendering with comprehensive CSS styling
- Responsive design with Tailwind CSS
- Loading states and error handling
- Toast notifications for user actions
- Smooth animations and transitions

### ✅ Layout Structure
- **Main Sidebar**: Navigation between Chat, Folders, and Profile
- **History Sidebar** (Chat page): Conversation history with "New Chat" button
- **Folders Page**: Folder tree on left, files list on right
- **Chat Page**: Full-width chat interface with history sidebar
- **Quiz Page**: Full-screen quiz interface with progress tracking

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

### 3. **Organize with Folders**
- Click "Folders" in sidebar
- Click "+" to create new folder
- Type folder name and press Enter
- Drag folders to reorder them
- Click three dots on folder for rename/delete options
- Create subfolders by selecting parent folder first

### 4. **Upload Files**
- Select a folder from left panel
- Drag and drop files or click upload area
- Supported: JPG, PNG, PDF, DOCX
- Files automatically parsed for metadata (size, pages, type)
- View uploaded files as cards in right panel

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
- Download original files: Click "Download" on file card
- Export conversations: Click download icon in chat header
- Exports as formatted PDF with timestamps

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
- November 5, 2025: **Migrated file storage from Supabase to UploadThing**
  - Replaced all Supabase storage functions with UploadThing API
  - Updated file upload, download, and deletion across all API routes
  - Configured UploadThing with authentication middleware and file type validations
  - All file operations now use UploadThing's secure cloud storage
- November 3, 2025: Initial project setup with core authentication and chat infrastructure
  - Database schema created and migrated
  - Basic chat UI implemented with conversation isolation
  - Custom markdown rendering with comprehensive CSS styling
