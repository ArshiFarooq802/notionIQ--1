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
- **Database**: PostgreSQL (Supabase) with Prisma ORM
- **Authentication**: NextAuth.js with server-side sessions
- **AI**: Google Gemini AI for chat, summarization, and quiz generation
- **File Storage**: Supabase Storage buckets
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

### Core Features
✅ Server-side authentication with NextAuth.js (no loading screens)
✅ Login/Signup pages with validation
✅ PostgreSQL database with Prisma ORM
✅ Conversation ID system for isolated chat contexts
✅ Custom markdown CSS styling (headings, tables, code blocks, lists, etc.)
✅ Leftmost collapsible sidebar with navigation
✅ Expandable history sidebar for conversations
✅ Basic chat interface with message display
✅ TanStack Query integration for real-time updates

### Pending Implementation
- Folders page with hierarchical structure
- Drag-and-drop folder reordering
- File upload functionality with Supabase Storage
- Document parsing (PDF, DOCX, images)
- File cards with action buttons
- AI-powered summarization with dedicated conversation windows
- Quiz generation system (multiple choice, checkboxes, dropdowns)
- Quiz results with scoring and explanations
- PYQ (Previous Year Questions) analysis
- PDF export for conversations

## Environment Variables Required

### Database (Already Configured)
- DATABASE_URL
- PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE

### Required for Full Functionality
- **GEMINI_API_KEY**: Google Gemini AI API key for chat and AI features
- **NEXT_PUBLIC_SUPABASE_URL**: Supabase project URL for file storage
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Supabase anonymous key for file storage
- **NEXTAUTH_SECRET**: Secret for NextAuth.js sessions (defaults to SESSION_SECRET)

## How to Use

1. **Sign Up**: Create an account at `/signup`
2. **Login**: Access the platform at `/login`
3. **Chat**: Start conversations in the chat interface
4. **Folders**: (Coming soon) Organize files in hierarchical folders
5. **Upload Files**: (Coming soon) Upload PDFs, documents, and images
6. **Summarize**: (Coming soon) Get AI summaries of uploaded documents
7. **Create Quizzes**: (Coming soon) Generate quizzes from your notes
8. **Download**: (Coming soon) Export conversations as PDFs

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
- November 3, 2025: Initial project setup with core authentication and chat infrastructure
- Database schema created and migrated
- Basic chat UI implemented with conversation isolation
- Custom markdown rendering with comprehensive CSS styling
