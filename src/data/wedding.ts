/**
 * Central wedding configuration for Komal & Deepak.
 * All names, Hindi & English labels, dates, ceremony timings, venue details,
 * and contact numbers from the official invitation card are stored in this file.
 */

export type WeddingEventVisual = "sangeet" | "haldi" | "mehendi" | "wedding" | "vidai";

export type CeremonySubItem = {
  time: string;
  timeHindi: string;
  title: string;
  titleHindi: string;
};

export type WeddingEvent = {
  id: string;
  visual: WeddingEventVisual;
  name: string;
  nameHindi: string;
  dayLabel: string;
  dayLabelHindi: string;
  /** Standard parseable date ("1 December 2026") for calendar export. */
  date: string;
  dateHindi: string;
  /** Standard parseable time ("8:00 PM") for calendar export, or Muhurat text. */
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
  /** ISO 8601 date-time with IST offset targeting Wednesday, 2 December 2026. */
  dateISO: string;
  family: {
    senderHeadingHindi: string;
    senderHeading: string;
    hosts: string;
    hostsHindi: string;
    address: string;
    addressHindi: string;
    contacts: string[];
    rsvpList?: string[];
    bestWishes?: string;
    bestWishesHindi?: string;
    shiningStars?: string[];
    brideLineage?: string;
    groomLineage?: string;
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
  /** Individual ceremony cards in chronological order (1–2 December 2026). */
  events: WeddingEvent[];
};

export const wedding: WeddingData = {
  bride: "Komal",
  brideHindi: "आयु० कोमल",
  groom: "Deepak",
  groomHindi: "चि० दीपक",
  initials: "K · D",
  auspiciousHeading: "॥ शुभ विवाह ॥",
  parinayLabel: "संग",
  ganeshMantra: "॥ श्री गणेशाय नमः ॥",
  sanskritShloka:
    "विघ्न हरण मंगल करण श्री गणपति महाराज । प्रथम निमंत्रण आपको पूरन करियो काज ॥",
  sanskritShlokaMeaning:
    "वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥",
  weddingDate: "2 December 2026",
  weddingDay: "Wednesday",
  weddingDayHindi: "बुधवार",
  dateISO: "2026-12-02T18:00:00+05:30",

  family: {
    senderHeadingHindi: "दर्शनाभिलाषी / प्रेषक",
    senderHeading: "An Invitation From",
    hosts: "Smt. Bijender Kaur & Late Sh. Subhash Chander",
    hostsHindi: "श्रीमती बिजेंद्र कौर एवं स्वर्गीय श्री सुभाष चंदर",
    address: "290/14, Quilla Mohalla, Bahadurgarh-124507",
    addressHindi: "२९०/१४, किला मोहल्ला, बहादुरगढ़-१२४५०७",
    contacts: ["9017824181", "8930385454"],
    brideLineage: "Grand D/o Late Smt. Savitri Devi W/o Late Sh. Shivdutt",
    groomLineage: "S/o Smt. Darshan Devi & Sh. Kaushal Kumar, R/o Bahadurgarh (Hr)",
    rsvpList: [
      "Sh. Prahlad Saini",
      "Sh. Jai Saini",
      "Sh. Chinu Saini",
      "Sh. Anuj Saini",
      "Sh. Yogesh Saini",
      "Sh. Dhanvin Saini",
    ],
    bestWishes: "With Best Regards From All Saini Family",
    bestWishesHindi: "समस्त सैनी परिवार",
    shiningStars: ["Dhanvin Saini", "Samridhi Saini", "Namasya Saini"],
  },

  weddingVenue: {
    headingHindi: "शुभ विवाह स्थल",
    name: "RR FARM",
    nameHindi: "आर.आर. फार्म",
    landmark: "Badli Road",
    landmarkHindi: "बादली रोड",
    road: "Bahadurgarh-124507, Haryana",
    roadHindi: "बहादुरगढ़-१२४५०७, हरियाणा",
    location: "RR FARM, Badli Road, Bahadurgarh-124507, Haryana, India",
    locationHindi: "आर.आर. फार्म, बादली रोड, बहादुरगढ़-१२४५०७",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=RR+FARM+Badli+Road+Bahadurgarh+124507",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=RR%20FARM%20Badli%20Road%20Bahadurgarh%20124507&t=&z=15&ie=UTF8&iwloc=&output=embed",
  },

  blessing: {
    message: "Your gracious presence, love and blessings mean the world to us as our children embark on their sacred new journey.",
    gratitudeTitle: "With Love & Gratitude",
    gratitudeMessage: "Thank you for joining our joy and blessing the couple.",
  },

  daySchedules: [
    {
      date: "1 December 2026",
      dateHindi: "१ दिसंबर २०२६",
      day: "Tuesday",
      dayHindi: "मंगलवार",
      items: [
        {
          title: "Ladies Sangeet",
          titleHindi: "महिला संगीत",
          time: "08:00 PM",
          timeHindi: "रात्रि 8:00 बजे",
        },
      ],
    },
    {
      date: "2 December 2026",
      dateHindi: "२ दिसंबर २०२६",
      day: "Wednesday",
      dayHindi: "बुधवार",
      items: [
        {
          title: "Dinner (Wedding Feast)",
          titleHindi: "प्रीतिभोज",
          time: "06:00 PM",
          timeHindi: "सायं 6:00 बजे",
        },
        {
          title: "Arrival of Barat",
          titleHindi: "बारात आगमन",
          time: "07:00 PM",
          timeHindi: "सायं 7:00 बजे",
        },
        {
          title: "Vidai",
          titleHindi: "विदाई (तारों की छांव में)",
          time: "Taaron Ke Chaon Mein",
          timeHindi: "तारों की छांव में",
        },
      ],
    },
  ],

  events: [
    {
      id: "sangeet",
      visual: "sangeet",
      name: "Ladies Sangeet",
      nameHindi: "महिला संगीत",
      dayLabel: "Tuesday",
      dayLabelHindi: "मंगलवार",
      date: "1 December 2026",
      dateHindi: "१ दिसंबर २०२६",
      time: "08:00 PM",
      timeHindi: "रात्रि 8:00 बजे",
      venue: "290/14, Quilla Mohalla",
      venueHindi: "२९०/१४, किला मोहल्ला",
      address: "Quilla Mohalla, Bahadurgarh-124507",
      addressHindi: "किला मोहल्ला, बहादुरगढ़-१२४५०७",
      description:
        "An enchanting evening of joyful music, melodious wedding folk songs, traditional dance, and festive celebrations.",
    },
    {
      id: "dinner",
      visual: "wedding",
      name: "Wedding Feast (Dinner)",
      nameHindi: "प्रीतिभोज",
      dayLabel: "Wednesday",
      dayLabelHindi: "बुधवार",
      date: "2 December 2026",
      dateHindi: "२ दिसंबर २०२६",
      time: "06:00 PM",
      timeHindi: "सायं 6:00 बजे",
      venue: "RR FARM",
      venueHindi: "आर.आर. फार्म",
      address: "Badli Road, Bahadurgarh-124507",
      addressHindi: "बादली रोड, बहादुरगढ़-१२४५०७",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=RR+FARM+Badli+Road+Bahadurgarh+124507",
      description:
        "A grand celebration feast welcoming family and guests to partake in delicious culinary delights on this joyous evening.",
    },
    {
      id: "barat",
      visual: "wedding",
      name: "Arrival of Barat",
      nameHindi: "बारात आगमन",
      dayLabel: "Wednesday",
      dayLabelHindi: "बुधवार",
      date: "2 December 2026",
      dateHindi: "२ दिसंबर २०२६",
      time: "07:00 PM",
      timeHindi: "सायं 7:00 बजे",
      venue: "RR FARM",
      venueHindi: "आर.आर. फार्म",
      address: "Badli Road, Bahadurgarh-124507",
      addressHindi: "बादली रोड, बहादुरगढ़-१२४५०७",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=RR+FARM+Badli+Road+Bahadurgarh+124507",
      description:
        "Warm and joyous ceremonial welcome to the Groom, his family, and the Barat with garland exchanges, band, and blessings.",
    },
    {
      id: "vidai",
      visual: "vidai",
      name: "Vidai",
      nameHindi: "विदाई (तारों की छांव में)",
      dayLabel: "Wednesday",
      dayLabelHindi: "बुधवार",
      date: "2 December 2026",
      dateHindi: "२ दिसंबर २०२६",
      time: "Taaron Ke Chaon Mein",
      timeHindi: "तारों की छांव में",
      venue: "RR FARM",
      venueHindi: "आर.आर. फार्म",
      address: "Badli Road, Bahadurgarh-124507",
      addressHindi: "बादली रोड, बहादुरगढ़-१२४५०७",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=RR+FARM+Badli+Road+Bahadurgarh+124507",
      description:
        "A poignant, heartfelt farewell under the starry night sky with tears of love, eternal blessings, and wishes for lifelong joy.",
    },
  ],
};
