export function formatClassDate(date: string, time: string): string {
  return `${date} ${time}`;
}

export function isClassSessionFinished(date: string, time: string): boolean {
  return new Date(`${date}T${time}`).getTime() < Date.now();
}
