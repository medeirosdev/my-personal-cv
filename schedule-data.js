// Weekly schedule — edit this file to update your commitments, then commit and push.
//
// Each grid entry (SCHEDULE_EVENTS):
//   day:   'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
//   start: exact start — a whole hour (8 = 08:00) or 'HH:MM' ('13:30')
//   end:   exact end, same format, after start. The block snaps to the hour grid
//          (rounded outwards); the exact times show in the hover tooltip.
//   label: free text shown on the block (keep it short — the block can be narrow;
//          if a commitment starts mid-hour, put the exact time in the label,
//          e.g. "Reunião (13:20)" — the block itself still snaps to the hour grid.
//   color: optional accent — 'accent' | 'teal' | 'amber' | 'rose' (defaults to 'accent')
//   marginStart / marginEnd: optional per-event override of SCHEDULE_MARGIN (minutes)
//   until: optional 'YYYY-MM-DD' — the block is hidden after this date. Use it on
//          one-off events of a specific week so they never look recurring.
//
// No people's names in labels.

// Average error margin shown on hover: may start up to +start min late, end up to +end min late.
window.SCHEDULE_MARGIN = { start: 0, end: 10 };

window.SCHEDULE_EVENTS = [
  // ---- Fixos ----
  { day: 'mon', start: 8, end: 12, label: 'Trabalho', color: 'accent' },
  { day: 'tue', start: 8, end: 12, label: 'Trabalho', color: 'accent' },
  { day: 'wed', start: 8, end: 12, label: 'Trabalho', color: 'accent' },
  { day: 'thu', start: 8, end: 12, label: 'Trabalho', color: 'accent' },
  { day: 'fri', start: 8, end: 12, label: 'Trabalho', color: 'accent' },

  { day: 'thu', start: '13:30', end: '14:00', marginEnd: 0, label: 'Reunião IC HUC (13:30)', color: 'teal' },
  { day: 'tue', start: 21, end: 22, label: 'Reunião de Pesquisa', color: 'teal' },
  { day: 'wed', start: 13, end: 17, label: 'Pesquisa', color: 'teal' },

  { day: 'mon', start: 16, end: 18, label: 'Aula de Física', color: 'amber' },

  // ---- Extras — semana 05/10 a 11/10/2026 (remover ao fim da semana) ----
  { day: 'mon', start: '13:30', end: '14:00', label: 'Reunião IC (13:30)', color: 'rose', until: '2026-10-11' },
  { day: 'mon', start: '14:00', end: '14:45', label: 'Entrevista (14:00–14:45)', color: 'rose', until: '2026-10-11' },
  { day: 'wed', start: 19, end: 20, label: 'Reunião PW', color: 'rose', until: '2026-10-11' },
];

// Events outside the current week — listed below the grid, hidden once past.
//   label: event name
//   start / end: 'YYYY-MM-DD' — a continuous range (end optional for a single day)
//   dates: ['YYYY-MM-DD', ...] — alternative for non-consecutive days
window.UPCOMING_EVENTS = [
  { label: 'IX Curso de Introdução – Nanotecnologia & Nanotoxicologia', start: '2026-10-14', end: '2026-10-15' },
  { label: 'BIOS', start: '2026-10-22', end: '2026-10-23' },
  { label: 'IX Proteomics Workshop', start: '2026-11-10', end: '2026-11-12' },
  { label: 'Seminários de Física Computacional', dates: ['2026-11-13', '2026-11-16'] },
];
