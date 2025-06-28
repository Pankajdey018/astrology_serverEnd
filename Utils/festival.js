module.exports = [
  {
    name: "Makar Sankranti",
    match: (p) => p.sunSign === "Makara" && p.date.includes("-01-14")
  },
  {
    name: "Maha Shivaratri",
    match: (p) =>
      p.tithi === "Chaturdashi" &&
      p.paksha === "Krishna" &&
      p.lunarMonth === "Magha"
  },
  {
    name: "Holi",
    match: (p) =>
      p.tithi === "Purnima" &&
      p.lunarMonth === "Phalguna"
  },
  {
    name: "Rama Navami",
    match: (p) =>
      p.tithi === "Navami" &&
      p.paksha === "Shukla" &&
      p.lunarMonth === "Chaitra"
  },
  {
    name: "Hanuman Jayanti",
    match: (p) =>
      p.tithi === "Purnima" &&
      p.lunarMonth === "Chaitra"
  },
  {
    name: "Narasimha Jayanti",
    match: (p) =>
      p.tithi === "Chaturdashi" &&
      p.paksha === "Shukla" &&
      p.lunarMonth === "Vaishakha"
  },
  {
    name: "Buddha Purnima",
    match: (p) =>
      p.tithi === "Purnima" &&
      p.lunarMonth === "Vaishakha"
  },
  {
    name: "Jagannath Rath Yatra",
    match: (p) =>
      p.tithi === "Dwitiya" &&
      p.paksha === "Shukla" &&
      p.lunarMonth === "Ashadha"
  },
  {
    name: "Guru Purnima",
    match: (p) =>
      p.tithi === "Purnima" &&
      p.lunarMonth === "Ashadha"
  },
  {
    name: "Raksha Bandhan",
    match: (p) =>
      p.tithi === "Purnima" &&
      p.lunarMonth === "Shravana"
  },
  {
    name: "Krishna Janmashtami",
    match: (p) =>
      p.tithi === "Ashtami" &&
      p.paksha === "Krishna" &&
      p.lunarMonth === "Bhadrapada"
  },
  {
    name: "Ganesh Chaturthi",
    match: (p) =>
      p.tithi === "Chaturthi" &&
      p.paksha === "Shukla" &&
      p.lunarMonth === "Bhadrapada"
  },
  {
    name: "Navaratri (start)",
    match: (p) =>
      p.tithi === "Pratipada" &&
      p.paksha === "Shukla" &&
      p.lunarMonth === "Ashwin"
  },
  {
    name: "Durga Ashtami",
    match: (p) =>
      p.tithi === "Ashtami" &&
      p.paksha === "Shukla" &&
      p.lunarMonth === "Ashwin"
  },
  {
    name: "Dussehra (Vijayadashami)",
    match: (p) =>
      p.tithi === "Dashami" &&
      p.paksha === "Shukla" &&
      p.lunarMonth === "Ashwin"
  },
  {
    name: "Sharad Purnima",
    match: (p) =>
      p.tithi === "Purnima" &&
      p.lunarMonth === "Ashwin"
  },
  {
    name: "Karva Chauth",
    match: (p) =>
      p.tithi === "Chaturthi" &&
      p.paksha === "Krishna" &&
      p.lunarMonth === "Kartik"
  },
  {
    name: "Dhanteras",
    match: (p) =>
      p.tithi === "Trayodashi" &&
      p.paksha === "Krishna" &&
      p.lunarMonth === "Kartik"
  },
  {
    name: "Diwali",
    match: (p) =>
      p.tithi === "Amavasya" &&
      p.lunarMonth === "Kartik"
  },
  {
    name: "Bhai Dooj",
    match: (p) =>
      p.tithi === "Dwitiya" &&
      p.paksha === "Shukla" &&
      p.lunarMonth === "Kartik"
  },
  {
    name: "Dev Deepawali",
    match: (p) =>
      p.tithi === "Purnima" &&
      p.lunarMonth === "Kartik"
  },
  {
    name: "Geeta Jayanti",
    match: (p) =>
      p.tithi === "Ekadashi" &&
      p.paksha === "Shukla" &&
      p.lunarMonth === "Margashirsha"
  }
];