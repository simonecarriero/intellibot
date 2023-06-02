export type JustDate = {
  year: number;
  month: number;
  day: number;
};

export const justDate = (year: number, month: number, day: number): JustDate => ({ year, month, day });

export const justToday = (): JustDate => {
  const date = new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

type JustDateFormat = 'YYYY-MM-DD' | 'YYYY' | 'MM' | 'DD';

export const formatDate = (date: JustDate, format: JustDateFormat = 'YYYY-MM-DD'): string => {
  switch (format) {
    case 'YYYY-MM-DD':
      return `${formatDate(date, 'YYYY')}-${formatDate(date, 'MM')}-${formatDate(date, 'DD')}`;
    case 'YYYY':
      return date.year.toString();
    case 'MM':
      return date.month.toString().padStart(2, '0');
    case 'DD':
      return date.day.toString().padStart(2, '0');
  }
};
