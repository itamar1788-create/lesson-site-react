# שיעור אישי · Personal Lesson

A bilingual (Hebrew RTL / English LTR) website for booking private lessons and driving lessons in Israel.
It is a front-end **demo**: the teachers, reviews and photos are fictional, and nothing is saved to a server.

## Run it

```bash
npm install
npm run dev      # development server
npm run build    # type-check + production build into dist/
```

## What it does

- **Booking wizard** (4 steps): subject → level / region → teacher and exact day and hour → send the request (opens WhatsApp).
- **Free hours only**: after choosing a teacher and a day, only the hours the teacher is free are offered. A lesson is
  assumed to last one hour, must fit inside the teacher's working hours, and cannot overlap another lesson, even in a different subject.
- **Teacher area (demo)**: approve or decline requests, a weekly board of approved lessons, cancel a lesson with an optional note,
  edit working hours, and give homework.
- **Student area (demo)**: upcoming lessons, history with filters, favourite teachers, and homework.
- **Homework**: the teacher attaches a PDF; the student downloads it and uploads a PDF back; the teacher marks it done or sends it
  back, with an optional grade and an optional feedback PDF.
- Day / night mode, English ⇄ Hebrew (with direction switch), swipe-back from the screen edge, a faint non-overlapping letters background.

## Structure

```
src/
  data/data.ts         subjects, regions, teachers, demo lessons (typed)
  i18n/                tiny translation layer: Hebrew text is the key, en.json holds English
  lib/schedule.ts      pure functions: working hours, busy slots, free hours
  lib/pdf.ts           builds small demo PDFs, downloads blobs
  lib/hooks.ts         theme, scroll hop, edge swipe
  store.tsx            useReducer store: lessons, working hours, homework, favourites
  components/          Avatar, FileInput, Limited ("show all"), Homework, Background
  pages/               Home, Subjects, Teachers, Book, About, Contact, Join, StudentArea, TeacherArea
```

## Notes

- Routing uses `HashRouter`, so it works on any static host without server rules.
- To use a real WhatsApp number, change `WA_NUMBER` in `src/data/data.ts`.
- Next steps: a real backend (for example Supabase) for accounts, lessons and file storage, plus tests for `lib/schedule.ts`.
