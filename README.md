# BizGPT - Product Requirements Assistant

A ChatGPT-like web application built with Next.js for product requirements submission and discussion. This application allows users to submit and discuss product requirements in a conversational interface.

## Features

- **Chat Interface**: ChatGPT-like conversation interface for discussing product requirements
- **Product Requirements Management**: Create, view, and manage product requirements in the sidebar
- **Real-time Chat**: Interactive chat with simulated AI responses
- **Auto-resizing Input**: Smart textarea that grows with content
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bizgpt
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Start a Conversation**: Type your product requirements or ideas in the chat input
2. **Create Requirements**: Click "New Requirement" in the sidebar to add structured requirements
3. **Discuss Ideas**: Use the chat interface to refine and discuss your product concepts
4. **Manage Requirements**: View and organize your requirements in the sidebar

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React useState hooks

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Main chat interface
│   └── globals.css        # Global styles
├── components/
│   └── AutoResizeTextarea.tsx  # Auto-resizing textarea component
```

## Features in Detail

### Chat Interface
- Real-time message display with user and assistant messages
- Loading states with animated indicators
- Auto-resizing input field
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

### Product Requirements
- Create new requirements with title, description, priority, and status
- Visual status indicators (draft, review, approved)
- Priority levels (high, medium, low)
- Click to edit functionality

### Responsive Design
- Mobile-friendly layout
- Custom scrollbars
- Smooth animations and transitions
- Clean, modern ChatGPT-inspired design

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding Features

The application is designed to be easily extensible. You can:

1. Add new message types or chat features
2. Implement real AI integration
3. Add requirement editing capabilities
4. Create user authentication
5. Add data persistence

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details