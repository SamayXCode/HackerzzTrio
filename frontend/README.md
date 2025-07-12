# StackIt Clone

A React + Vite web application that replicates the StackIt Q&A platform interface using Tailwind CSS.

## Features

- Browse questions with different sorting options (newest, most voted, most answered, unanswered)
- View individual questions and their answers
- Post new questions with title, body, and tags
- Post answers to existing questions
- Upvote/downvote questions and answers
- Responsive design that works on desktop and mobile devices

## Technologies Used

- React 18
- Vite
- React Router v6
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the source code

2. Navigate to the project directory

```bash
cd stackit-clone
```

3. Install dependencies

```bash
npm install
# or
yarn
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
/src
  /assets        # Static assets like images and icons
  /components    # Reusable UI components
  /pages         # Page components for different routes
  App.jsx        # Main application component with routing
  main.jsx       # Entry point
  index.css      # Global styles and Tailwind imports
```

## Build for Production

To build the application for production, run:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Preview Production Build

To preview the production build locally, run:

```bash
npm run preview
# or
yarn preview
```

## License

This project is for educational purposes only.