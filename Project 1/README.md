# Tourist-to-Tourist Chat Demo

An interactive demo for a class product that helps Harvard tourists connect with each other through a web forum/chat prototype.

## Features

- **Landing Page**: Welcome screen with Harvard-themed design and QR code simulation
- **Multi-language Chat**: Support for English, Spanish, Chinese, Thai, Ukrainian, and Hindi
- **Auto-translation**: Mock translation system with language prefixes
- **Real-time Messaging**: Post questions and replies with instant updates
- **Responsive Design**: Works on both mobile and desktop
- **Smooth Animations**: Powered by Framer Motion for polished interactions

## Tech Stack

- React 18 with TypeScript
- TailwindCSS for styling
- Framer Motion for animations
- Lucide React for icons

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view the demo

## Demo Flow

1. **Landing Page**: Users see a welcoming Harvard-themed landing page with a "Join the Tourist Forum" button
2. **Chat Interface**: After clicking join, users enter the chat interface with:
   - Language selector in the top navigation
   - Pre-loaded mock messages from various tourists
   - Real-time message input at the bottom
   - Reply functionality for threaded conversations
   - Upvote system for helpful messages

## Key Components

- **LandingPage**: Hero section with QR code simulation and feature highlights
- **ChatInterface**: Main chat view with message feed and input
- **MessageBubble**: Individual message display with translation and interactions
- **LanguageSelector**: Dropdown for switching between supported languages

## Mock Data

The demo includes realistic mock messages covering common tourist questions:
- Tour recommendations
- Food suggestions
- Photo spot advice
- Visitor information
- Accessibility tips

All messages include user avatars, timestamps, and realistic conversation flow.

## Translation System

The `translate()` function simulates AI translation by adding language prefixes:
- English: No prefix
- Spanish: `[ES]`
- Chinese: `[中文]`
- Thai: `[TH]`
- Ukrainian: `[UK]`
- Hindi: `[HI]`

This provides a clear visual indication of the translation feature without requiring actual AI integration.
