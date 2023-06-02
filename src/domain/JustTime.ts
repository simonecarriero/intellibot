export type JustTime = {
  hour: number;
  minutes: number;
};

export const justTime = (hour: number, minutes: number = 0): JustTime => ({ hour, minutes });

export const goe = (a: JustTime, b: JustTime) =>
  new Date(1970, 0, 1, a.hour, a.minutes) >= new Date(1970, 0, 1, b.hour, b.minutes);

export const loe = (a: JustTime, b: JustTime) =>
  new Date(1970, 0, 1, a.hour, a.minutes) <= new Date(1970, 0, 1, b.hour, b.minutes);

export const justTimeFromDate = (date: Date): JustTime => ({
  hour: date.getUTCHours(),
  minutes: date.getUTCMinutes(),
});

type JustTimeFormat = 'hh:mm' | 'hh' | 'mm';

export const formatTime = (time: JustTime, format: JustTimeFormat = 'hh:mm'): string => {
  switch (format) {
    case 'hh:mm':
      return `${formatTime(time, 'hh')}:${formatTime(time, 'mm')}`;
    case 'hh':
      return time.hour.toString().padStart(2, '0');
    case 'mm':
      return time.minutes.toString().padStart(2, '0');
  }
};
