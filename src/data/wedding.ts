/**
 * Central wedding configuration for Sagarika & Divas.
 * All names, Hindi & English labels, dates, ceremony timings, venue details,
 * and contact numbers are stored in this single file.
 */

export type WeddingEventVisual = "sangeet" | "haldi" | "mehendi" | "wedding" | "vidai";
export type WeddingInteractionType = "haldi" | "mehendi" | "sangeet" | "wedding" | "vidai";

export type CeremonySubItem = {
  time: string;
  timeHindi: string;
  title: string;
  titleHindi: string;
};

export type WeddingEvent = {
  id: string;
  visual: WeddingEventVisual;
  interactionType?: WeddingInteractionType;
  name: string;
  nameHindi: string;
  dayLabel: string;
  dayLabelHindi: string;
  /** Standard parseable date ("8 December 2026") for calendar export. */
  date: string;
  dateHindi: string;
  /** Standard parseable time ("3:00 PM") for calendar export, or Muhurat text. */
  time: string;
  timeHindi: string;
  endTime?: string;
  venue: string;
  venueHindi?: string;
  address?: string;
  addressHindi?: string;
  mapUrl?: string;
  dressCode?: string;
  description: string;
  /** Optional grouped sub-ceremonies on the same day/card. */
  subItems?: CeremonySubItem[];
};

export type WeddingDaySchedule = {
  date: string;
  dateHindi: string;
  day: string;
  dayHindi: string;
  items: {
    title: string;
    titleHindi: string;
    time: string;
    timeHindi: string;
  }[];
};

export type WeddingData = {
  bride: string;
  brideHindi: string;
  groom: string;
  groomHindi: string;
  initials: string;
  auspiciousHeading: string;
  parinayLabel: string;
  ganeshMantra: string;
  sanskritShloka: string;
  sanskritShlokaMeaning: string;
  weddingDate: string;
  weddingDay: string;
  weddingDayHindi: string;
  /** ISO 8601 date-time with IST offset targeting Thursday, 10 December 2026. */
  dateISO: string;
  family: {
    senderHeadingHindi: string;
    senderHeading: string;
    hosts: string;
    hostsHindi: string;
    address: string;
    addressHindi: string;
    contacts: string[];
  };
  weddingVenue: {
    headingHindi: string;
    name: string;
    nameHindi: string;
    landmark: string;
    landmarkHindi: string;
    road: string;
    roadHindi: string;
    location: string;
    locationHindi: string;
    mapUrl: string;
    mapEmbedUrl: string;
  };
  blessing: {
    message: string;
    gratitudeTitle: string;
    gratitudeMessage: string;
  };
  /** Day-by-day summary exactly matching the printed Hindi/English card. */
  daySchedules: WeddingDaySchedule[];
  /** Individual ceremony cards in chronological order (8–10 December 2026). */
  events: WeddingEvent[];
};

export const wedding: WeddingData = {
  bride: "Sagrika",
  brideHindi: "आयु० सागरिका",
  groom: "Diwas",
  groomHindi: "चि० दिवस",
  initials: "D · S",
  auspiciousHeading: "॥ शुभ विवाह ॥",
  parinayLabel: "परिणय",
  ganeshMantra: "॥ श्री गणेशाय नमः ॥",
  sanskritShloka:
    "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
  sanskritShlokaMeaning:
    "O Lord Ganesha of the curved trunk and radiant as a million suns, bless these sacred wedding ceremonies and remove all obstacles always.",
  weddingDate: "10 December 2026",
  weddingDay: "Thursday",
  weddingDayHindi: "गुरुवार",
  dateISO: "2026-12-10T12:00:00+05:30",

  family: {
    senderHeadingHindi: "प्रेषक",
    senderHeading: "Hosted By",
    hosts: "Mrs. Kusum and Mr. Surya Singh Kshatri",
    hostsHindi: "श्रीमती कुसुम एवं श्री सूर्य सिंह क्षत्री",
    address: "Thakurpur, Prem Nagar, Dehradun, Uttarakhand, India",
    addressHindi: "ठाकुरपुर, प्रेमनगर, देहरादून",
    contacts: ["9997954507", "9119770909"],
  },

  weddingVenue: {
    headingHindi: "विवाह स्थल",
    name: "Football Ground",
    nameHindi: "फुटबॉल ग्राउंड",
    landmark: "Near Burans Aadhar Apartment",
    landmarkHindi: "निकट बुरांस आधार अपार्टमेंट",
    road: "Thakurpur Road, Dehradun, Uttarakhand, India",
    roadHindi: "ठाकुरपुर रोड, देहरादून",
    location:
      "Near Burans Aadhar Apartment, Thakurpur Road, Dehradun, Uttarakhand, India",
    locationHindi: "निकट बुरांस आधार अपार्टमेंट, ठाकुरपुर रोड, देहरादून",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Football+Ground+Near+Burans+Aadhar+Apartment+Thakurpur+Road+Dehradun+Uttarakhand",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Burans+Aadhar+Apartment+Thakurpur+Road+Dehradun+Uttarakhand&output=embed",
  },

  blessing: {
    message: "Your love and blessings mean the world to us.",
    gratitudeTitle: "With Love & Gratitude",
    gratitudeMessage: "Thank you for your blessings. They mean the world to us.",
  },

  daySchedules: [
    {
      date: "8 December 2026",
      dateHindi: "8 दिसंबर 2026",
      day: "Tuesday",
      dayHindi: "मंगलवार",
      items: [
        {
          title: "Women's Sangeet (Kirtan)",
          titleHindi: "महिला संगीत (कीर्तन)",
          time: "3:00 PM",
          timeHindi: "3:00 बजे दोपहर",
        },
      ],
    },
    {
      date: "9 December 2026",
      dateHindi: "9 दिसंबर 2026",
      day: "Wednesday",
      dayHindi: "बुधवार",
      items: [
        {
          title: "Ganesh Pujan & Haldi",
          titleHindi: "गणेश पूजन एवं हल्दी हाथ",
          time: "8:00 AM",
          timeHindi: "8:00 बजे प्रातः",
        },
        {
          title: "Mangal Snan",
          titleHindi: "मंगल स्नान",
          time: "10:00 AM",
          timeHindi: "10:00 बजे प्रातः",
        },
        {
          title: "Mehendi",
          titleHindi: "मेहंदी",
          time: "7:00 PM",
          timeHindi: "7:00 बजे सायं",
        },
      ],
    },
    {
      date: "10 December 2026",
      dateHindi: "10 दिसंबर 2026",
      day: "Thursday",
      dayHindi: "बृहस्पतिवार",
      items: [
        {
          title: "Baraat Welcome",
          titleHindi: "बारात स्वागत",
          time: "12:00 PM",
          timeHindi: "12:00 बजे दोपहर",
        },
        {
          title: "Wedding Feast (Pritibhoj)",
          titleHindi: "प्रीतिभोज",
          time: "1:00 PM",
          timeHindi: "1:00 बजे दोपहर",
        },
        {
          title: "Wedding Rituals (Vivah Sanskar)",
          titleHindi: "विवाह संस्कार",
          time: "As per auspicious Muhurat",
          timeHindi: "शुभलग्नानुसार",
        },
        {
          title: "Vidaai",
          titleHindi: "विदाई (भाँवरि पलकें)",
          time: "5:00 PM",
          timeHindi: "5:00 बजे सायं",
        },
      ],
    },
  ],

  events: [
    {
      id: "sangeet",
      visual: "sangeet",
      interactionType: "sangeet",
      name: "Women's Sangeet (Kirtan)",
      nameHindi: "महिला संगीत (कीर्तन)",
      dayLabel: "Tuesday",
      dayLabelHindi: "मंगलवार",
      date: "8 December 2026",
      dateHindi: "8 दिसंबर 2026",
      time: "3:00 PM",
      timeHindi: "3:00 बजे दोपहर",
      venue: "Thakurpur, Prem Nagar",
      venueHindi: "ठाकुरपुर, प्रेमनगर",
      address: "Thakurpur, Prem Nagar, Dehradun, Uttarakhand, India",
      addressHindi: "ठाकुरपुर, प्रेमनगर, देहरादून",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Thakurpur+Prem+Nagar+Dehradun+Uttarakhand",
      description:
        "An auspicious afternoon of devotional Kirtan, folk songs, dhol beats and joyous celebration with family and loved ones.",
    },
    {
      id: "haldi",
      visual: "haldi",
      interactionType: "haldi",
      name: "Ganesh Pujan, Haldi & Mangal Snan",
      nameHindi: "गणेश पूजन, हल्दी हाथ एवं मंगल स्नान",
      dayLabel: "Wednesday",
      dayLabelHindi: "बुधवार",
      date: "9 December 2026",
      dateHindi: "9 दिसंबर 2026",
      time: "8:00 AM",
      timeHindi: "8:00 बजे प्रातः (मंगल स्नान: 10:00 बजे प्रातः)",
      venue: "Thakurpur, Prem Nagar",
      venueHindi: "ठाकुरपुर, प्रेमनगर",
      address: "Thakurpur, Prem Nagar, Dehradun, Uttarakhand, India",
      addressHindi: "ठाकुरपुर, प्रेमनगर, देहरादून",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Thakurpur+Prem+Nagar+Dehradun+Uttarakhand",
      subItems: [
        {
          time: "8:00 AM",
          timeHindi: "8:00 बजे प्रातः",
          title: "Ganesh Pujan & Haldi",
          titleHindi: "गणेश पूजन एवं हल्दी हाथ",
        },
        {
          time: "10:00 AM",
          timeHindi: "10:00 बजे प्रातः",
          title: "Mangal Snan",
          titleHindi: "मंगल स्नान",
        },
      ],
      description:
        "Invoking Lord Ganesha's blessings at 8:00 AM with sacred Haldi rituals, followed by the auspicious Mangal Snan at 10:00 AM.",
    },
    {
      id: "mehendi",
      visual: "mehendi",
      interactionType: "mehendi",
      name: "Mehendi Ceremony",
      nameHindi: "मेहंदी",
      dayLabel: "Wednesday",
      dayLabelHindi: "बुधवार",
      date: "9 December 2026",
      dateHindi: "9 दिसंबर 2026",
      time: "7:00 PM",
      timeHindi: "7:00 बजे सायं",
      venue: "Thakurpur, Prem Nagar",
      venueHindi: "ठाकुरपुर, प्रेमनगर",
      address: "Thakurpur, Prem Nagar, Dehradun, Uttarakhand, India",
      addressHindi: "ठाकुरपुर, प्रेमनगर, देहरादून",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Thakurpur+Prem+Nagar+Dehradun+Uttarakhand",
      description:
        "An intimate evening of intricate henna artistry, music, laughter and celebration beneath the lights.",
    },
    {
      id: "wedding",
      visual: "wedding",
      interactionType: "wedding",
      name: "Baraat Welcome, Wedding Feast & Vivah Sanskar",
      nameHindi: "बारात स्वागत · प्रीतिभोज · विवाह संस्कार",
      dayLabel: "Thursday",
      dayLabelHindi: "बृहस्पतिवार",
      date: "10 December 2026",
      dateHindi: "10 दिसंबर 2026",
      time: "12:00 PM",
      timeHindi: "12:00 बजे दोपहर से शुभलग्नानुसार",
      venue: "Football Ground",
      venueHindi: "फुटबॉल ग्राउंड",
      address:
        "Near Burans Aadhar Apartment, Thakurpur Road, Dehradun, Uttarakhand, India",
      addressHindi: "निकट बुरांस आधार अपार्टमेंट, ठाकुरपुर रोड, देहरादून",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Football+Ground+Near+Burans+Aadhar+Apartment+Thakurpur+Road+Dehradun+Uttarakhand",
      subItems: [
        {
          time: "12:00 PM",
          timeHindi: "12:00 बजे दोपहर",
          title: "Baraat Welcome",
          titleHindi: "बारात स्वागत",
        },
        {
          time: "1:00 PM",
          timeHindi: "1:00 बजे दोपहर",
          title: "Wedding Feast (Pritibhoj)",
          titleHindi: "प्रीतिभोज",
        },
        {
          time: "Auspicious Muhurat",
          timeHindi: "शुभलग्नानुसार",
          title: "Wedding Rituals (Vivah Sanskar)",
          titleHindi: "विवाह संस्कार",
        },
      ],
      description:
        "Join us in welcoming the Baraat at 12:00 PM and sharing the Wedding Feast (Pritibhoj) at 1:00 PM, followed by the sacred Vivah Sanskar according to the auspicious Muhurat.",
    },
    {
      id: "vidai",
      visual: "vidai",
      interactionType: "vidai",
      name: "Vidaai",
      nameHindi: "विदाई (भाँवरि पलकें)",
      dayLabel: "Thursday",
      dayLabelHindi: "बृहस्पतिवार",
      date: "10 December 2026",
      dateHindi: "10 दिसंबर 2026",
      time: "5:00 PM",
      timeHindi: "5:00 बजे सायं",
      venue: "Football Ground",
      venueHindi: "फुटबॉल ग्राउंड",
      address:
        "Near Burans Aadhar Apartment, Thakurpur Road, Dehradun, Uttarakhand, India",
      addressHindi: "निकट बुरांस आधार अपार्टमेंट, ठाकुरपुर रोड, देहरादून",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Football+Ground+Near+Burans+Aadhar+Apartment+Thakurpur+Road+Dehradun+Uttarakhand",
      description:
        "A tender farewell filled with love, blessings and heartfelt emotions as Diwas and Sagrika step into their beautiful new journey together. 🤍✨",
    },
  ],
};
