# Tamasha Onboarding Wizard

A multi-step onboarding form built with React and Vite.

## Features

- Four-step onboarding flow
- Personal information, preferences, and tech-stack selection
- Track-specific technology options
- Client-side validation for required fields, email, and portfolio URL
- Review screen with edit actions
- Draft persistence in `localStorage`
- Restores the saved step after refreshing the page
- Debounced draft saving
- Submission success state and restart action
- Responsive interface with accessible form labels and error messages

## Getting Started

The project has a React frontend and a small Django backend. Run them in separate terminals.

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local URL shown by Vite, usually:

```text
http://localhost:5173
```

Start the Django backend:

```bash
cd ../backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

The backend stores submitted onboarding records in `backend/db.sqlite3`.

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
src/
  App.jsx                 Main wizard layout
  App.css                 Application styles
  constants.js            Form options and labels
  components/Steps.jsx    Step views and navigation
  context/FormContext.jsx Shared form state, validation, and persistence
```

## Implementation Notes

Form state is managed through React Context so each step uses the same source of truth. Draft data and the current step are saved together in `localStorage` after a short debounce, which prevents a write on every keystroke while preserving progress after a refresh.

The review step validates the data again before submission as a final safety check. Submitting clears the saved draft and displays a success state instead of leaving the user on the review screen.

When the user submits the review step, the frontend sends the form data to `POST http://localhost:8000/api/onboarding/`. Django validates the basic required fields and stores the record in SQLite using the `Submission` model. Local storage is still used for unfinished drafts, while completed submissions are saved by Django.

## API

```text
POST /api/onboarding/
```

Example request body:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "portfolio": "https://example.com",
  "track": "Frontend",
  "experience": "Junior",
  "techStack": ["React", "TypeScript"]
}
```

## Future Improvements

For a production version, the form could submit to a backend API, include automated tests, provide server-side validation, and add analytics or error monitoring.
