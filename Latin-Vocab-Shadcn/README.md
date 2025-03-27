# Latin Vocabulary Learning App with Shadcn UI

A modern web application for learning Latin vocabulary through interactive quizzes, built with Node.js, Express, and styled with Tailwind CSS inspired by Shadcn UI.

## Features

- **Multiple Chapters**: Navigate through different themed vocabulary chapters
- **Two Practice Modes**: 
  - Practice by chapter
  - Practice weak words (words you frequently miss)
- **Two Question Types**:
  - Multiple choice questions
  - Fill-in-the-blank sentences
- **Progress Tracking**: Track your learning progress for each vocabulary word
- **Example Sentences**: See both Latin and English sentences using the vocabulary word
- **Clean, Modern UI**: Built with Tailwind CSS for a pleasant learning experience

## Project Structure

```
Latin-Vocab-Shadcn/
├── package.json        # Project dependencies
├── server.js           # Express server and API endpoints
├── vocabulary.json     # Latin vocabulary data by chapters
├── users.json          # User progress data
└── public/             # Static front-end files
    ├── index.html      # Main HTML page
    ├── styles.css      # Custom CSS beyond Tailwind
    └── app.js          # Client-side JavaScript
```

## Installation

1. Ensure you have [Node.js](https://nodejs.org/) installed
2. Clone or download this repository
3. Navigate to the project directory:
   ```
   cd /Users/Teresa/Downloads/Latin-Vocab-Shadcn/
   ```
4. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```
   or
   ```
   node server.js
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## How to Use

1. **Login**: Enter a username to login (no password required for this demo)
2. **Select a Chapter**: Click on a chapter from the list on the left
3. **Choose Question Format**: Select either Multiple Choice or Fill in the Blank
4. **Start Practice**: Click either "Practice Selected Chapter" or "Practice Weak Words"
5. **Answer Questions**: Respond to quiz questions and see immediate feedback
6. **Review Progress**: Track your mastery of vocabulary over time

## API Endpoints

The application provides the following API endpoints:

- `GET /api/vocabulary/chapters` - Get all vocabulary chapters
- `GET /api/vocabulary/chapters/:chapterNumber` - Get a specific chapter by number
- `GET /api/practice/next-question` - Get the next quiz question
  - Query parameters:
    - `chapter` - Chapter number for practice
    - `questionFormat` - 'multiple-choice' or 'fill-in-the-blank'
    - `mode` - 'weak-words' for practicing difficult words
    - `username` - Current user (for weak words mode)
- `POST /api/practice/submit-answer` - Submit an answer and update progress
- `GET /api/users/:username/progress` - Get user progress statistics
- `POST /api/users/login` - Simple login (creates user if not exists)

## Customization

- Add more vocabulary chapters and words by editing `vocabulary.json`
- Modify UI styling in `public/styles.css`
- Extend functionality by adding new question types or practice modes

## License

This project is open source and available for educational purposes.

## Acknowledgments

- Design inspired by [Shadcn UI](https://ui.shadcn.com/)
- Built with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)