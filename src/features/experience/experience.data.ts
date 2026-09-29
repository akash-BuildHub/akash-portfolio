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
    parentCompany: "iQue Ventures",
    location: "Bengaluru, Karnataka, India",
    duration: "Feb 2026 – Present",
    description: [
      "Developed real-time video analytics solutions with person detection and multi-object tracking using optimized GPU inference on live RTSP camera streams.",
      "Built an end-to-end facial recognition attendance system, including AI pipelines, FastAPI backend, PostgreSQL database, and a React + TypeScript dashboard.",
      "Enhanced facial recognition accuracy through embedding validation, threshold optimization, and advanced tracking techniques.",
      "Deployed and maintained low-latency live video streaming solutions using WebRTC and MSE/fMP4 for multiple concurrent camera feeds.",
    ],
  },
  {
    title: "AI Developer",
    company: "Owlytics",
    parentCompany: "iQue Ventures",
    location: "Bengaluru, Karnataka, India",
    duration: "Jul 2025 – Jan 2026",
    description: [
      "Designed and developed deep learning models for computer vision tasks, including object detection and recognition.",
      "Built scalable machine learning pipelines for data preprocessing, model training, evaluation, and deployment.",
      "Integrated AI models into production-ready backend services and RESTful APIs for real-world applications.",
      "Collaborated with cross-functional teams to deliver AI-powered solutions aligned with business and product requirements.",
    ],
  },
  {
    title: "Research Analyst",
    company: "RPinnacle Publication",
    parentCompany: "Resbee Info Technologies Pvt Ltd",
    location: "Tamil Nadu, India",
    duration: "Aug 2024 – Mar 2025",
    description: [
      "Conducted data analysis and evaluated machine learning models to compare performance across multiple algorithms.",
      "Prepared comprehensive technical documentation and research reports for AI, machine learning, and data science projects.",
      "Interpreted model performance, identified limitations, and recommended improvements based on analytical findings.",
      "Contributed to research-driven publications by documenting methodologies, experimental results, and technical insights.",
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
    title: "Python Intern",
    company: "Srishti Innovative",
    parentCompany: "Techno Park",
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
    title: "Inplant Training",
    company: "iTrobes Solutions LLC",
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
