// Weekly schedule — edit this file to update your fixed commitments, then commit and push.
//
// Each entry:
//   day:   'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
//   start: whole hour in 24h format (6-24), e.g. 8 = 08:00
//   end:   whole hour in 24h format, must be greater than start, e.g. 10 = 10:00
//   label: free text shown on the block (keep it short — the block can be narrow;
//          if a commitment starts mid-hour, put the exact time in the label,
//          e.g. "Reunião (13:20)" — the block itself still snaps to the hour grid.
//   color: optional accent — 'accent' | 'teal' | 'amber' | 'rose' (defaults to 'accent')
window.SCHEDULE_EVENTS = [
  { day: 'mon', start: 8, end: 12, label: 'Trabalho', color: 'accent' },
  { day: 'tue', start: 8, end: 12, label: 'Trabalho', color: 'accent' },
  { day: 'wed', start: 8, end: 12, label: 'Trabalho', color: 'accent' },
  { day: 'thu', start: 8, end: 12, label: 'Trabalho', color: 'accent' },
  { day: 'fri', start: 8, end: 12, label: 'Trabalho', color: 'accent' },

  { day: 'mon', start: 13, end: 14, label: 'Reunião de Pesquisa (13:20)', color: 'teal' },
  { day: 'tue', start: 21, end: 22, label: 'Reunião de Pesquisa', color: 'teal' },
  { day: 'wed', start: 13, end: 17, label: 'Pesquisa', color: 'teal' },

  { day: 'mon', start: 16, end: 18, label: 'Aula de Física', color: 'amber' },
];
