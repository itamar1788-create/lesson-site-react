// Demo data. All teachers, students and reviews are fictional.
export type Subject = { n: string; c: string; o: string; d: string; car?: 1; lv?: string[] };
export type Teacher = { n: string; s: number[]; r: number[]; y: number; img?: string };
export type Look = { k: string; h: string; s: 'long' | 'short' | 'bun' | 'beard'; c: string; b: string };
export type DayHours = { on: boolean; from: string; to: string };

export const LEVELS = [
 "יסודי",
 "חטיבה",
 "תיכון",
 "אקדמי"
];
export const DAYS = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];
export const PALETTE = ["#E5484D", "#2563EB", "#7C3AED", "#0B8A63", "#F97316", "#DB2777"];
/** Replace with your WhatsApp number (international format, no leading 0). */
export const WA_NUMBER = "972500000000";

export const SUBJECTS: Subject[] = [
 {
  "n": "מתמטיקה",
  "c": "#E5484D",
  "o": "#fff",
  "d": "מיסודי ועד 5 יחידות ואקדמי"
 },
 {
  "n": "אנגלית",
  "c": "#2563EB",
  "o": "#fff",
  "d": "שיחה, בגרות ופסיכומטרי"
 },
 {
  "n": "פיזיקה",
  "c": "#7C3AED",
  "o": "#fff",
  "d": "מכניקה, חשמל וגלים"
 },
 {
  "n": "מדעי המחשב",
  "c": "#0B8A63",
  "o": "#fff",
  "d": "תכנות, אלגוריתמים ובגרות"
 },
 {
  "n": "כימיה",
  "c": "#F97316",
  "o": "#fff",
  "d": "מהיסודות ועד כימיה אורגנית"
 },
 {
  "n": "נהיגה",
  "c": "#DB2777",
  "o": "#fff",
  "d": "מתחילים, טרום טסט ורענון",
  "car": 1,
  "lv": [
   "מתחילים",
   "ממשיכים",
   "טרום טסט",
   "רענון"
  ]
 }
];
export const REGIONS: [string, number][] = [
 [
  "מרכז וגוש דן",
  0
 ],
 [
  "השרון",
  0
 ],
 [
  "חיפה והקריות",
  10
 ],
 [
  "השפלה",
  10
 ],
 [
  "ירושלים והסביבה",
  15
 ],
 [
  "הצפון",
  20
 ],
 [
  "הדרום",
  20
 ]
];
export const TEACHERS: Teacher[] = [
 {
  "n": "נועה כהן",
  "s": [
   0,
   2
  ],
  "r": [
   0,
   1
  ],
  "y": 6
 },
 {
  "n": "דניאל לוי",
  "s": [
   3,
   0
  ],
  "r": [
   0,
   2,
   4
  ],
  "y": 8
 },
 {
  "n": "מיכל אברהם",
  "s": [
   1
  ],
  "r": [
   1,
   3,
   4
  ],
  "y": 5
 },
 {
  "n": "יוסף חדד",
  "s": [
   2,
   4
  ],
  "r": [
   4,
   3
  ],
  "y": 10
 },
 {
  "n": "רוני שפירא",
  "s": [
   0,
   3,
   2
  ],
  "r": [
   5,
   2
  ],
  "y": 4
 },
 {
  "n": "תמר ביטון",
  "s": [
   4,
   1
  ],
  "r": [
   6,
   3
  ],
  "y": 7
 },
 {
  "n": "עומר דוד",
  "s": [
   1,
   0
  ],
  "r": [
   0,
   1,
   3
  ],
  "y": 3
 },
 {
  "n": "שירה מזרחי",
  "s": [
   2,
   3
  ],
  "r": [
   5,
   6
  ],
  "y": 9
 },
 {
  "n": "אבי גולן",
  "s": [
   5
  ],
  "r": [
   0,
   1,
   3
  ],
  "y": 12
 },
 {
  "n": "ליאור פרץ",
  "s": [
   5
  ],
  "r": [
   4,
   2,
   5
  ],
  "y": 9
 }
];
export const LOOKS: Look[] = [
 {
  "k": "#F2C9A5",
  "h": "#3B2417",
  "s": "long",
  "c": "#2563EB",
  "b": "#DCE8FF"
 },
 {
  "k": "#E0AC83",
  "h": "#1F1A17",
  "s": "short",
  "c": "#0B8A63",
  "b": "#D9F3E8"
 },
 {
  "k": "#F2C9A5",
  "h": "#7A4A2A",
  "s": "bun",
  "c": "#DB2777",
  "b": "#FCE1EE"
 },
 {
  "k": "#C68B63",
  "h": "#1F1A17",
  "s": "beard",
  "c": "#7C3AED",
  "b": "#E9E1FD"
 },
 {
  "k": "#E0AC83",
  "h": "#4A3426",
  "s": "short",
  "c": "#F97316",
  "b": "#FFE6D2"
 },
 {
  "k": "#A86B45",
  "h": "#1F1A17",
  "s": "long",
  "c": "#E5484D",
  "b": "#FDDCDD"
 },
 {
  "k": "#F2C9A5",
  "h": "#2B1B12",
  "s": "short",
  "c": "#2563EB",
  "b": "#DCE8FF"
 },
 {
  "k": "#C68B63",
  "h": "#2B1B12",
  "s": "bun",
  "c": "#0B8A63",
  "b": "#D9F3E8"
 },
 {
  "k": "#E0AC83",
  "h": "#6B6B6B",
  "s": "beard",
  "c": "#E5484D",
  "b": "#FDDCDD"
 },
 {
  "k": "#8A5233",
  "h": "#1F1A17",
  "s": "short",
  "c": "#7C3AED",
  "b": "#E9E1FD"
 }
];
export const REVIEWS: [string, string][] = [
 [
  "דנה, אמא של תלמיד כיתה י׳",
  "הבן שלי התחיל ליהנות מהמקצוע, והציון עלה כבר אחרי חודש. הסברים ברורים וסבלנות אינסופית."
 ],
 [
  "אורי, תלמיד י״ב",
  "שיעורים מסודרים, תרגילים מדויקים ויחס אישי. קיבלתי הכנה מצוינת לבגרות."
 ],
 [
  "יעל, סטודנטית",
  "סוף־סוף הבנתי את החומר. השיעורים ברורים, בלי לחץ ובקצב שמתאים לי. ממליצה בחום."
 ],
 [
  "משה, אבא של תלמידה",
  "אחרי השיעור הראשון הבת שלי ביקשה להמשיך מיד. יחס אישי ותוצאות שרואים בציונים."
 ]
];
export const CAR_REVIEWS: [string, string][] = [
 [
  "נעמה, תלמידת נהיגה",
  "הגעתי לשיעור הראשון לחוצה ויצאתי בביטחון. הסברים רגועים וברורים לאורך כל הדרך."
 ],
 [
  "איתי, עבר טסט בניסיון ראשון",
  "הכנה מצוינת לטסט, כולל מסלולים מוכרים והערות מדויקות. עברתי בפעם הראשונה."
 ]
];
export const DEFAULT_HOURS: Record<number, DayHours[]> = {
 "0": [
  {
   "on": true,
   "from": "15:00",
   "to": "20:00"
  },
  {
   "on": true,
   "from": "15:00",
   "to": "20:00"
  },
  {
   "on": true,
   "from": "15:00",
   "to": "20:00"
  },
  {
   "on": true,
   "from": "15:00",
   "to": "20:00"
  },
  {
   "on": true,
   "from": "09:00",
   "to": "14:00"
  },
  {
   "on": false,
   "from": "09:00",
   "to": "13:00"
  }
 ]
};
export const HISTORY: { d: string; s: number; t: number }[] = [
 {
  "d": "28.10",
  "s": 0,
  "t": 0
 },
 {
  "d": "21.10",
  "s": 0,
  "t": 0
 },
 {
  "d": "19.10",
  "s": 5,
  "t": 8
 },
 {
  "d": "14.10",
  "s": 2,
  "t": 3
 },
 {
  "d": "09.10",
  "s": 5,
  "t": 9
 },
 {
  "d": "02.10",
  "s": 0,
  "t": 4
 }
];
export const UPCOMING: { d: string; tm: string; s: number; t: number; tl?: number }[] = [
 {
  "d": "שלישי 03.11",
  "tm": "17:00",
  "s": 0,
  "t": 0,
  "tl": 8
 },
 {
  "d": "חמישי 05.11",
  "tm": "18:30",
  "s": 5,
  "t": 8
 }
];
export type Lesson = { w: number; tm: string; s: number; p: string; st: 0 | 1 | 2 | 3; note?: string };
export const LESSONS: Lesson[] = [
 {
  "w": 0,
  "tm": "16:00",
  "s": 0,
  "p": "אורי",
  "st": 1
 },
 {
  "w": 0,
  "tm": "18:00",
  "s": 2,
  "p": "מאיה",
  "st": 1
 },
 {
  "w": 1,
  "tm": "17:00",
  "s": 0,
  "p": "גיא",
  "st": 0
 },
 {
  "w": 2,
  "tm": "15:30",
  "s": 2,
  "p": "הדר",
  "st": 1
 },
 {
  "w": 2,
  "tm": "17:30",
  "s": 0,
  "p": "נועם",
  "st": 0
 },
 {
  "w": 3,
  "tm": "16:00",
  "s": 0,
  "p": "אורי",
  "st": 1
 },
 {
  "w": 4,
  "tm": "10:00",
  "s": 2,
  "p": "אלון",
  "st": 0
 },
 {
  "w": 2,
  "tm": "17:30",
  "s": 2,
  "p": "דור",
  "st": 0
 },
 {
  "w": 2,
  "tm": "17:00",
  "s": 0,
  "p": "דנה",
  "st": 1
 }
];
export const HOURS: string[] = (() => { const a: string[] = []; for (let h = 8; h <= 20; h++) { const p = String(h).padStart(2, "0"); a.push(p + ":00", p + ":30"); } return a; })();
export const END_HOURS: string[] = HOURS.slice(1).concat("21:00");
