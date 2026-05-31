/* ============================================================
   GALLERY DATA  —  src/data.js
   A curated, 3D-friendly slice of Naadir's real portfolio.

   The full portfolio (and its auto-compiled data) lives in
   Naadir-Dev-Portfolio.github.io. This file mirrors a representative
   selection so the museum stays explorable rather than overwhelming.

   Each section becomes a "gallery" inside the glass pavilion.
   Each project becomes a glass display case.
     emblem  — which procedural 3D object floats inside the case
     img     — screenshot loaded onto the case's lightbox panel
               (falls back to a generated card if it can't be fetched)
   ============================================================ */

export const PROFILE = {
  name: 'Naadir Duglas',
  role: 'Automation & Data Specialist',
  tagline: 'Enterprise Reporting Ops, Automation & AI Agent Workflows',
  links: {
    site: 'https://naadir-dev-portfolio.github.io/',
    github: 'https://github.com/Naadir-Dev-Portfolio',
    linkedin: 'https://www.linkedin.com/in/naadir-duglas/',
    email: 'mailto:naadir.dev.mail@gmail.com',
  },
};

export const SECTIONS = [
  {
    id: 'python',
    label: 'Python Desktop',
    blurb: 'Desktop apps and tools built with PyQt6 that solve real problems.',
    emblem: 'code',
    accent: 0x6ee7b7,
    projects: [
      {
        title: 'Finance Dashboard',
        desc: 'Interactive finance KPI dashboard with automated data importing, charting and portfolio tracking, built with PyQt6.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/Finance-Dashboard/main/portfolio/FinanceScreen.png',
        tags: ['Python', 'PyQt6', 'Data-Viz'],
        details: 'https://github.com/Naadir-Dev-Portfolio/Finance-Dashboard/blob/main/README.md',
      },
      {
        title: 'Income Prophet',
        desc: 'Turns bank statements into interactive income & expenditure forecasts using SARIMA, ETS and Prophet models.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/Income-Prophet/main/portfolio/income-prophet.png',
        tags: ['Python', 'PyQt6', 'Forecasting'],
        details: 'https://github.com/Naadir-Dev-Portfolio/Income-Prophet/blob/main/README.md',
      },
      {
        title: 'Document OCR Studio',
        desc: 'Local deterministic OCR app that scans document images into editable text, structured sections and CSV-ready grids.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/Document-OCR-Studio/main/portfolio/document-ocr-studio.png',
        tags: ['Python', 'OCR', 'Desktop'],
        details: 'https://github.com/Naadir-Dev-Portfolio/Document-OCR-Studio/blob/main/README.md',
      },
      {
        title: 'Mortgage Overpayment Tracker',
        desc: 'Model overpayment scenarios, visualise interest saved, and see exactly when you will be mortgage free.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/Mortgage-Overpayment-Tracker/main/portfolio/mortgage-overpayment-tracker.png',
        tags: ['Python', 'PyQt6', 'Finance'],
        details: 'https://github.com/Naadir-Dev-Portfolio/Mortgage-Overpayment-Tracker/blob/main/README.md',
      },
    ],
  },
  {
    id: 'powerbi',
    label: 'Power BI',
    blurb: 'Interactive dashboards turning open data into instant clarity.',
    emblem: 'chart',
    accent: 0xf6c453,
    projects: [
      {
        title: 'UK Labour Market',
        desc: 'Tracks UK unemployment, claimant counts and regional variation using official ONS and DWP data. Published live to the Power BI service.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/powerbi-uk-Labour-Market-Dashboard/main/portfolio/powerbi-uk-labour-market-dashboard.png',
        tags: ['Power BI', 'DAX', 'Power Query'],
        details: 'https://naadir-dev-portfolio.github.io/powerbi-uk-Labour-Market-Dashboard/',
      },
      {
        title: 'NHS Waiting Times',
        desc: 'Tracks NHS England RTT waiting-list pressure across trusts, regions and specialties — where backlogs rise and strain is most acute.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/powerbi-nhs-waiting-times-dashboard/main/portfolio/powerbi-nhs-waiting-times-dashboard.png',
        tags: ['Power BI', 'DAX', 'Open Data'],
        details: 'https://naadir-dev-portfolio.github.io/powerbi-nhs-waiting-times-dashboard/',
      },
      {
        title: 'Crime & Community Safety',
        desc: 'Public crime analytics using England & Wales police data to track what is driving change and which areas are emerging hotspots.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/powerbi-crime-community-safety-dashboard/main/portfolio/powerbi-crime-community-safety-dashboard.png',
        tags: ['Power BI', 'DAX', 'Python'],
        details: 'https://naadir-dev-portfolio.github.io/powerbi-crime-community-safety-dashboard/',
      },
      {
        title: 'Call Handling SoS',
        desc: 'Contact-centre service-level dashboard tracking calls offered, answered, abandoned, ASA and AHT against standards of service.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/powerbi-call-handling-standards-of-service-dashboard/main/portfolio/powerbi-call-handling-standards-of-service-dashboard.png',
        tags: ['Power BI', 'DAX', 'Contact Centre'],
        details: 'https://naadir-dev-portfolio.github.io/powerbi-call-handling-standards-of-service-dashboard/',
      },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Agents',
    blurb: 'Agents, generative chatbots and AI workflows powered by Gemini & OpenAI.',
    emblem: 'orb',
    accent: 0x8b9dff,
    projects: [
      {
        title: 'Spheria',
        desc: 'Hero project — an AI desktop OS with multi-agent orchestration, tool calling, persistent memory and a custom animated orb interface.',
        img: null,
        tags: ['AI', 'Multi-Agent', 'PyQt6'],
        details: 'https://github.com/Naadir-Dev-Portfolio/Spheria/blob/main/README.md',
      },
      {
        title: 'Enterprise GenAI Assistant',
        desc: 'Custom enterprise chatbot on Gemini 1.5 Flash with a RAG pipeline over internal docs — built and deployed for a team within days.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/Enterprise-GenAI-Assistant/main/portfolio/ccmiChatbot_demo.webp',
        tags: ['AI', 'Gemini', 'RAG'],
        details: 'https://github.com/Naadir-Dev-Portfolio/Enterprise-GenAI-Assistant/blob/main/README.md',
        demo: 'https://ccmi-genai-chat.streamlit.app/',
      },
      {
        title: 'AI Quiz Bot',
        desc: 'Adaptive knowledge testing powered by Gemini 1.5 Flash — generates fresh quizzes on any topic on demand.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/AI-Quizbot/main/portfolio/aiQuizbot.webp',
        tags: ['AI', 'Gemini', 'Streamlit'],
        details: 'https://github.com/Naadir-Dev-Portfolio/AI-Quizbot/blob/main/README.md',
        demo: 'https://aiquizbot.streamlit.app/',
      },
    ],
  },
  {
    id: 'web',
    label: 'Web Development',
    blurb: 'Production portals and browser-based data tools.',
    emblem: 'browser',
    accent: 0x67d4e8,
    projects: [
      {
        title: 'Economics Dashboard',
        desc: 'Interactive browser-based economics dashboard — live macro data, yield curves, housing, employment and inflation.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/Economics-Dashboard-Web/main/portfolio/economics-dashboard-web.png',
        tags: ['Web', 'JS', 'Data-Viz'],
        details: 'https://github.com/Naadir-Dev-Portfolio/Economics-Dashboard-Web/blob/main/README.md',
      },
      {
        title: 'Team Hub Website',
        desc: 'Front-end portal for an internal data team showcasing tools, projects and team info in a clean, responsive layout.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/Team-Hub-Website/main/portfolio/team-hub-website.png',
        tags: ['Web', 'HTML', 'CSS', 'JS'],
        details: 'https://github.com/Naadir-Dev-Portfolio/Team-Hub-Website/blob/main/README.md',
        demo: 'https://ccmiteamsite-by-naadir.netlify.app/',
      },
      {
        title: 'Power BI Request Portal',
        desc: 'Walks stakeholders through the Power BI report commissioning process — replaces the email back-and-forth.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/PowerBI-Request-Portal/main/portfolio/pbirequest.webp',
        tags: ['Web', 'HTML', 'Power BI'],
        details: 'https://github.com/Naadir-Dev-Portfolio/PowerBI-Request-Portal/blob/main/README.md',
        demo: 'https://powerbirequest-by-naadir.netlify.app/',
      },
    ],
  },
  {
    id: 'games',
    label: 'Cognitive Games',
    blurb: 'Browser games that build numeracy and logic through play.',
    emblem: 'game',
    accent: 0xff9d6e,
    projects: [
      {
        title: 'Rain Drops',
        desc: 'Fast-paced arithmetic training inspired by Lumosity Rain Drops — tests mental calculation speed under pressure.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/RainDrops/main/portfolio/raindropsScreen.webp',
        tags: ['Web', 'JS', 'Game'],
        details: 'https://github.com/Naadir-Dev-Portfolio/RainDrops/blob/main/index.html',
        demo: 'https://raindrops-by-naadir.netlify.app/',
      },
      {
        title: 'Hexamatch',
        desc: 'Hexagonal tile-matching game that builds intuitive understanding of equivalent fractions through play.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/Hexamatch/main/portfolio/hexamatchScreen.webp',
        tags: ['Web', 'JS', 'Game'],
        details: 'https://github.com/Naadir-Dev-Portfolio/Hexamatch/blob/main/index.html',
        demo: 'https://hexamatch-by-naadir.netlify.app/',
      },
      {
        title: 'AlgebraVerse',
        desc: 'Progressive algebra challenge system, from basic equations to multi-step problem solving, with difficulty scaling.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/Algebraverse/main/portfolio/algebraverseScreen.webp',
        tags: ['Web', 'JS', 'Game'],
        details: 'https://github.com/Naadir-Dev-Portfolio/Algebraverse/blob/main/index.html',
        demo: 'https://algebraverse-by-naadir.netlify.app/',
      },
      {
        title: 'Logic Grid',
        desc: 'Visual boolean logic-gate puzzle that builds intuition for AND, OR and NOT operations.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/LogicGrid/main/portfolio/logicgridscreen.webp',
        tags: ['Web', 'JS', 'Game'],
        details: 'https://github.com/Naadir-Dev-Portfolio/LogicGrid/blob/main/index.html',
        demo: 'https://logicgrid-by-naadir.netlify.app/',
      },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile Apps',
    blurb: 'Cross-platform apps in React Native and native Kotlin.',
    emblem: 'phone',
    accent: 0xa78bfa,
    projects: [
      {
        title: 'Mobile Health Planner',
        desc: 'Mobile version of a custom workout-plan library built in React Native with an embedded HTML/CSS/JS webview.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/Mobile-Health-Planner/main/portfolio/mobile-health-planner.png',
        tags: ['React Native', 'Expo'],
        details: 'https://github.com/Naadir-Dev-Portfolio/Mobile-Health-Planner/blob/main/README.md',
      },
      {
        title: 'Mobile Scratchpad',
        desc: 'A remotely accessible scratchpad for sharing snippets of text, code blocks and other small files on the go.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/Mobile-Scratchpad/main/portfolio/mobile-scratchpad.png',
        tags: ['React Native', 'Expo'],
        details: 'https://github.com/Naadir-Dev-Portfolio/Mobile-Scratchpad/blob/main/README.md',
      },
      {
        title: 'HealthSync Exporter',
        desc: 'Kotlin Android app that parses, standardises and consolidates health data, uploading to OneDrive as scheduled CSVs.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/Android-HealthSync-Exporter/main/portfolio/android-healthsync-exporter.png',
        tags: ['Kotlin', 'Android', 'MS Graph'],
        details: 'https://github.com/Naadir-Dev-Portfolio/Android-HealthSync-Exporter/blob/main/README.md',
      },
    ],
  },
  {
    id: 'extensions',
    label: 'Browser Extensions',
    blurb: 'Chromium extensions that add productivity to the browser workflow.',
    emblem: 'puzzle',
    accent: 0xf472b6,
    projects: [
      {
        title: 'Browser Automation',
        desc: 'Side-panel tool that records browser actions — clicks, typing, navigation — then replays them as reusable automations.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/Browser-Automation-Extension/main/portfolio/browser-automation-extension.png',
        tags: ['Chromium', 'JS'],
        details: 'https://github.com/Naadir-Dev-Portfolio/Browser-Automation-Extension/blob/main/README.md',
      },
      {
        title: 'AI Article Sender',
        desc: 'Scrapes any article and sends the full text straight to ChatGPT, Claude, Gemini or Perplexity.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/AI-Article-Sender/main/portfolio/ai-article-sender.png',
        tags: ['Chrome', 'JS', 'AI'],
        details: 'https://github.com/Naadir-Dev-Portfolio/AI-Article-Sender/blob/main/README.md',
      },
      {
        title: 'AI Tab Organiser',
        desc: 'Instantly groups all your open tabs into colour-coded categories using Claude or Gemini.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/AI-Tab-Organiser/main/portfolio/ai-tab-organiser.png',
        tags: ['Chrome', 'JS', 'AI'],
        details: 'https://github.com/Naadir-Dev-Portfolio/AI-Tab-Organiser/blob/main/README.md',
      },
      {
        title: 'YouTube Summariser',
        desc: 'A Chrome extension that enhances Gemini inside YouTube videos for faster learning and research.',
        img: 'https://raw.githubusercontent.com/Naadir-Dev-Portfolio/AI-YouTube-Gemini-Summariser/main/portfolio/ai-youtube-gemini-summariser.png',
        tags: ['Chrome', 'JS', 'Gemini'],
        details: 'https://github.com/Naadir-Dev-Portfolio/AI-YouTube-Gemini-Summariser/blob/main/README.md',
      },
    ],
  },
];
