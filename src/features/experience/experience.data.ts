export interface ExperienceItem {
  title: string;
  company: string;
  parentCompany?: string;
  location: string;
  duration: string;
  description: string[];
}

export const experiences: ExperienceItem[] = [
  {
    title: "AI Developer",
    company: "Grow Space Innovations",
    parentCompany: "iQue Ventures Pvt. Ltd.",
    location: "Bengaluru, Karnataka, India",
    duration: "Jun 2025 – Present",
    description: [
      "Building AI-powered business solutions including HRMS, attendance management, employee analytics, and administrative dashboards.",
      "Developing real-time person detection, multi-object tracking, and face recognition systems for live RTSP camera streams using optimized GPU inference.",
      "Developing an end-to-end facial recognition attendance platform using FastAPI, PostgreSQL, React, and TypeScript, with responsive web interfaces and real-time data integration.",
      "Designing deep learning models, ML pipelines, and production APIs, with low-latency multi-camera streaming using WebRTC and MSE/fMP4.",
    ],
  },
  {
    title: "Assistant Technical Writer",
    company: "Rpinnacle Research Solutions",
    parentCompany: "Resbee Info Technologies Pvt Ltd",
    location: "Tamil Nadu, India",
    duration: "Aug 2024 – Mar 2025",
    description: [
      "Produced comprehensive technical documentation and research reports for deep learning and data science projects.",
      "Contributed to dataset analysis, experimental evaluation, and comparative model studies across multiple algorithms.",
      "Interpreted model performance, identified limitations, and recommended improvements based on analytical findings.",
      "Supported research-driven publications by documenting methodologies, experimental results, and technical insights.",
    ],
  },
  {
    title: "Python/Django Intern",
    company: "Clovion Tech Solutions Pvt. Ltd.",
    location: "Azhagiyamandapam, Tamil Nadu",
    duration: "Jan 2024 – Mar 2024",
    description: [
      "Developed backend features using Python and Django while contributing to web application development.",
      "Implemented database operations, business logic, and REST API functionalities.",
      "Collaborated with the development team to maintain and enhance existing application modules.",
      "Gained practical experience in backend architecture, debugging, and software development best practices.",
    ],
  },
  {
    title: "Python Programming Intern",
    company: "Srishti Innovations",
    parentCompany: "Technopark",
    location: "Trivandrum, Kerala, India",
    duration: "Jul 2023",
    description: [
      "Strengthened Python programming skills by developing solutions for real-world programming challenges.",
      "Applied core programming concepts, data structures, and file handling techniques in practical assignments.",
      "Improved problem-solving and debugging capabilities through hands-on development exercises.",
      "Built a strong foundation in Python application development and coding best practices.",
    ],
  },
  {
    title: "In-Plant Training",
    company: "iTrobes Technologies Pvt. Ltd.",
    location: "Marthandam, Tamil Nadu",
    duration: "Jul 2022",
    description: [
      "Gained practical exposure to software development processes and industry-standard IT workflows.",
      "Learned the complete software development lifecycle, from project planning to implementation and deployment.",
      "Observed real-world development practices, team collaboration, and project management methodologies.",
      "Developed a foundational understanding of enterprise software development environments.",
    ],
  },
];
