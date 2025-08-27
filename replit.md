# Receipt Management System

## Overview

This is a full-stack receipt management application built with React, TypeScript, and Express.js. The system provides a modern card-based interface for managing receipts, replacing traditional table views with WhatsApp-style receipt cards. It includes features for filtering, reviewing, and scheduling automatic exports of receipt data.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Component Structure**: 
  - Card-based receipt display instead of traditional tables
  - Reusable UI components following atomic design principles
  - Modal-based workflows for receipt review and scheduling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with structured error handling
- **Data Validation**: Zod schemas for type-safe data validation
- **Storage Layer**: Abstract storage interface with in-memory implementation
- **Development**: Hot reloading with Vite integration

### Data Storage Solutions
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon Database serverless driver
- **Schema**: Centralized schema definitions in shared directory
- **Migrations**: Drizzle Kit for database schema management
- **Session Storage**: PostgreSQL-based session storage with connect-pg-simple

### Database Schema
- **Receipts Table**: Stores receipt data including payment methods, amounts, status, and metadata
- **Schedules Table**: Manages automated export configurations with frequency and format options
- **Key Fields**: Receipt numbers, datetime stamps, entity information, financial amounts, and status tracking

### Authentication and Authorization
- Session-based authentication with PostgreSQL session store
- Middleware for request logging and error handling
- Environment-based configuration for security

### API Structure
- **Receipt Endpoints**: CRUD operations with filtering capabilities
- **Schedule Endpoints**: Management of automated export schedules
- **Query Parameters**: Support for search, date ranges, payment methods, and status filtering
- **Response Format**: Consistent JSON responses with proper HTTP status codes

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants

### Data Management
- **TanStack React Query**: Server state management and caching
- **Drizzle ORM**: Type-safe database toolkit
- **Zod**: Schema validation and type inference

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing with Tailwind integration
- **ESBuild**: Fast JavaScript bundler for production

### Database Integration
- **Neon Database**: Serverless PostgreSQL platform
- **Connect PG Simple**: PostgreSQL session store for Express

### Replit Integration
- **Runtime Error Overlay**: Development error handling
- **Cartographer**: Replit-specific development tools
- **Dev Banner**: Development environment indicators