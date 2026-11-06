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
    senderHeadingHindi: "दर्शनाभिलाषी / प्रेषक",
    senderHeading: "With Warm Regards",
    hosts: "Durga Devi & Subedar Dil Bahadur Thapa Chhetri (Retd.)",
    hostsHindi: "श्रीमती दुर्गा देवी एवं सूबेदार दिल बहादुर थापा क्षत्री (से.नि.)",
    address: "Prateet Nagar, Raiwala, District Dehradun, Uttarakhand, India",
    addressHindi: "प्रतीत नगर, रायवाला, जनपद देहरादून",
    contacts: ["9997118366", "7889743382"],
  },

  weddingVenue: {
    headingHindi: "मांगलिक एवं विवाह स्थल",
    name: "Ganesh Farm",
    nameHindi: "गणेश फार्म",
    landmark: "B.D.G. Camp Road",
    landmarkHindi: "बी.डी.जी. कैंप रोड",
    road: "Raiwala, Prateet Nagar, District Dehradun, Uttarakhand, India",
    roadHindi: "रायवाला, प्रतीत नगर, देहरादून",
    location:
      "Ganesh Farm, B.D.G. Camp Road, Raiwala, District Dehradun, Uttarakhand, India",
    locationHindi: "गणेश फार्म, बी.डी.जी. कैंप रोड, रायवाला, प्रतीत नगर, देहरादून",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Ganesh+Farm+BDG+Camp+Road+Raiwala+Dehradun+Uttarakhand",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Ganesh+Farm+BDG+Camp+Road+Raiwala+Dehradun+Uttarakhand&output=embed",
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
          title: "Family Ceremony",
          titleHindi: "पारिवारिक कार्यक्रम",
          time: "2:00 PM",
          timeHindi: "2:00 बजे दोपहर",
        },
        {
          title: "Women's Sangeet / Kirtan",
          titleHindi: "महिला संगीत / कीर्तन",
          time: "Time to be confirmed",
          timeHindi: "समय शीघ्र घोषित",
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
          title: "Ganesh Pujan",
          titleHindi: "गणेश पूजन",
          time: "9:00 AM",
          timeHindi: "9:00 बजे प्रातः",
        },
        {
          title: "Haldi Ceremony",
          titleHindi: "हल्दी संस्कार",
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
          title: "Baraat Departure",
          titleHindi: "बारात प्रस्थान",
          time: "9:00 AM",
          timeHindi: "9:00 बजे प्रातः",
        },
        {
          title: "Wedding Ceremony",
          titleHindi: "विवाह संस्कार",
          time: "As per auspicious wedding muhurat",
          timeHindi: "शुभलग्नानुसार",
        },
        {
          title: "Groom & Bride's Griha Pravesh",
          titleHindi: "वर-वधू गृह प्रवेश",
          time: "6:00 PM",
          timeHindi: "6:00 बजे सायं",
        },
      ],
    },
    {
      date: "11 December 2026",
      dateHindi: "11 दिसंबर 2026",
      day: "Friday",
      dayHindi: "शुक्रवार",
      items: [
        {
          title: "Preeti Bhoj (Wedding Reception Feast)",
          titleHindi: "प्रीतिभोज (शुभ विवाह स्वागत भोज)",
          time: "7:00 PM",
          timeHindi: "7:00 बजे सायं",
        },
      ],
    },
  ],

  events: [
    {
      id: "sangeet",
      visual: "sangeet",
      interactionType: "sangeet",
      name: "Family Ceremony & Women's Sangeet (Kirtan)",
      nameHindi: "पारिवारिक कार्यक्रम एवं महिला संगीत (कीर्तन)",
      dayLabel: "Tuesday",
      dayLabelHindi: "मंगलवार",
      date: "8 December 2026",
      dateHindi: "8 दिसंबर 2026",
      time: "2:00 PM",
      timeHindi: "2:00 बजे दोपहर से",
      venue: "Ganesh Farm, B.D.G. Camp Road, Raiwala",
      venueHindi: "गणेश फार्म, बी.डी.जी. कैंप रोड, रायवाला",
      address: "B.D.G. Camp Road, Raiwala, Prateet Nagar, Dehradun, Uttarakhand",
      addressHindi: "बी.डी.जी. कैंप रोड, रायवाला, प्रतीत नगर, देहरादून",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Ganesh+Farm+BDG+Camp+Road+Raiwala+Dehradun+Uttarakhand",
      subItems: [
        {
          time: "2:00 PM",
          timeHindi: "2:00 बजे दोपहर",
          title: "Family Ceremony",
          titleHindi: "पारिवारिक कार्यक्रम",
        },
        {
          time: "Time to be confirmed",
          timeHindi: "समय शीघ्र घोषित",
          title: "Women's Sangeet / Kirtan",
          titleHindi: "महिला संगीत / कीर्तन",
        },
      ],
      description:
        "An auspicious afternoon beginning with sacred family ceremonies at 2:00 PM, followed by devotional Kirtan, folk songs, lively dhol beats and joyful celebration.",
    },
    {
      id: "haldi",
      visual: "haldi",
      interactionType: "haldi",
      name: "Ganesh Pujan & Haldi Ceremony",
      nameHindi: "गणेश पूजन एवं हल्दी संस्कार",
      dayLabel: "Wednesday",
      dayLabelHindi: "बुधवार",
      date: "9 December 2026",
      dateHindi: "9 दिसंबर 2026",
      time: "9:00 AM",
      timeHindi: "9:00 बजे प्रातः (हल्दी संस्कार: 10:00 बजे प्रातः)",
      venue: "Ganesh Farm, B.D.G. Camp Road, Raiwala",
      venueHindi: "गणेश फार्म, बी.डी.जी. कैंप रोड, रायवाला",
      address: "B.D.G. Camp Road, Raiwala, Prateet Nagar, Dehradun, Uttarakhand",
      addressHindi: "बी.डी.जी. कैंप रोड, रायवाला, प्रतीत नगर, देहरादून",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Ganesh+Farm+BDG+Camp+Road+Raiwala+Dehradun+Uttarakhand",
      subItems: [
        {
          time: "9:00 AM",
          timeHindi: "9:00 बजे प्रातः",
          title: "Ganesh Pujan",
          titleHindi: "गणेश पूजन",
        },
        {
          time: "10:00 AM",
          timeHindi: "10:00 बजे प्रातः",
          title: "Haldi Ceremony",
          titleHindi: "हल्दी संस्कार",
        },
      ],
      description:
        "Invoking Lord Ganesha's divine blessings at 9:00 AM, followed by the auspicious Haldi ceremony at 10:00 AM with loved ones.",
    },
    {
      id: "mehendi",
      visual: "mehendi",
      interactionType: "mehendi",
      name: "Mehendi Ceremony",
      nameHindi: "मेहंदी संस्कार",
      dayLabel: "Wednesday",
      dayLabelHindi: "बुधवार",
      date: "9 December 2026",
      dateHindi: "9 दिसंबर 2026",
      time: "7:00 PM",
      timeHindi: "7:00 बजे सायं",
      venue: "Ganesh Farm, B.D.G. Camp Road, Raiwala",
      venueHindi: "गणेश फार्म, बी.डी.जी. कैंप रोड, रायवाला",
      address: "B.D.G. Camp Road, Raiwala, Prateet Nagar, Dehradun, Uttarakhand",
      addressHindi: "बी.डी.जी. कैंप रोड, रायवाला, प्रतीत नगर, देहरादून",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Ganesh+Farm+BDG+Camp+Road+Raiwala+Dehradun+Uttarakhand",
      description:
        "An enchanting evening of intricate henna artistry, music, celebration and festive joy under the lights.",
    },
    {
      id: "wedding",
      visual: "wedding",
      interactionType: "wedding",
      name: "Baraat Departure, Vivah Sanskar & Griha Pravesh",
      nameHindi: "बारात प्रस्थान · विवाह संस्कार · गृह प्रवेश",
      dayLabel: "Thursday",
      dayLabelHindi: "बृहस्पतिवार",
      date: "10 December 2026",
      dateHindi: "10 दिसंबर 2026",
      time: "9:00 AM",
      timeHindi: "9:00 बजे प्रातः से शुभलग्नानुसार",
      venue: "Ganesh Farm, B.D.G. Camp Road, Raiwala",
      venueHindi: "गणेश फार्म, बी.डी.जी. कैंप रोड, रायवाला",
      address: "B.D.G. Camp Road, Raiwala, Prateet Nagar, Dehradun, Uttarakhand",
      addressHindi: "बी.डी.जी. कैंप रोड, रायवाला, प्रतीत नगर, देहरादून",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Ganesh+Farm+BDG+Camp+Road+Raiwala+Dehradun+Uttarakhand",
      subItems: [
        {
          time: "9:00 AM",
          timeHindi: "9:00 बजे प्रातः",
          title: "Baraat Departure",
          titleHindi: "बारात प्रस्थान",
        },
        {
          time: "Auspicious Muhurat",
          timeHindi: "शुभलग्नानुसार",
          title: "Wedding Ceremony (Vivah Sanskar)",
          titleHindi: "विवाह संस्कार",
        },
        {
          time: "6:00 PM",
          timeHindi: "6:00 बजे सायं",
          title: "Groom & Bride's Griha Pravesh",
          titleHindi: "वर-वधू गृह प्रवेश",
        },
      ],
      description:
        "Baraat departure begins at 9:00 AM, followed by the sacred Vivah Sanskar rituals as per auspicious Muhurat, and welcoming the newlyweds during Griha Pravesh at 6:00 PM.",
    },
    {
      id: "preetibhoj",
      visual: "vidai",
      interactionType: "vidai",
      name: "Preeti Bhoj (Wedding Reception Feast)",
      nameHindi: "प्रीतिभोज (स्वागत भोज)",
      dayLabel: "Friday",
      dayLabelHindi: "शुक्रवार",
      date: "11 December 2026",
      dateHindi: "11 दिसंबर 2026",
      time: "7:00 PM",
      timeHindi: "7:00 बजे सायं",
      venue: "Ganesh Farm, B.D.G. Camp Road, Raiwala",
      venueHindi: "गणेश फार्म, बी.डी.जी. कैंप रोड, रायवाला",
      address: "B.D.G. Camp Road, Raiwala, Prateet Nagar, Dehradun, Uttarakhand",
      addressHindi: "बी.डी.जी. कैंप रोड, रायवाला, प्रतीत नगर, देहरादून",
      mapUrl:
        "https://www.google.com/maps/search/?api=1&query=Ganesh+Farm+BDG+Camp+Road+Raiwala+Dehradun+Uttarakhand",
      description:
        "A grand evening of celebratory dining, warmth and heartfelt blessings to honour the union of Diwas and Sagrika with family and friends.",
    },
  ],
};
