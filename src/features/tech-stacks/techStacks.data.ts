import {
  Activity,
  BarChart3,
  Boxes,
  Cable,
  CalendarCheck,
  Cctv,
  Cog,
  FileVideo,
  Film,
  Gauge,
  GraduationCap,
  Handshake,
  IdCard,
  Images,
  Infinity as InfinityIcon,
  KeyRound,
  LayoutDashboard,
  Network,
  Radar,
  Radio,
  ScanFace,
  ScanSearch,
  Server,
  Users,
  Webhook,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

export interface TechItem {
  name: string;
  logo?: string;
  icon?: LucideIcon;
}

interface TechCategory {
  title: string;
  items: TechItem[];
}

const devicon = (slug: string, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`;
const simple = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

export const categories: TechCategory[] = [
  {
    title: 'AI & Computer Vision',
    items: [
      { name: 'Machine Learning', logo: '/icons/machine_learning.png' },
      { name: 'Deep Learning', logo: '/icons/deep_learning.png' },
      { name: 'Computer Vision', logo: '/icons/computer_vision.png' },
      { name: 'Image Classification', icon: Images },
      { name: 'Object Detection', icon: ScanSearch },
      { name: 'Face Detection & Recognition', icon: ScanFace },
      { name: 'Multi-Object Tracking (MOT)', icon: Radar },
      { name: 'Action Recognition', icon: Activity },
      { name: 'Model Optimization', icon: Gauge },
    ],
  },
  {
    title: 'AI/ML Frameworks & Libraries',
    items: [
      { name: 'PyTorch', logo: devicon('pytorch') },
      { name: 'TensorFlow', logo: devicon('tensorflow') },
      { name: 'Keras', logo: devicon('keras') },
      { name: 'OpenCV', logo: devicon('opencv') },
      { name: 'YOLO', logo: `${simple('ultralytics')}/white` },
      { name: 'InsightFace (SCRFD, ArcFace)', icon: ScanFace },
      { name: 'ONNX Runtime (GPU / CUDA)', logo: simple('onnx') },
      { name: 'NumPy', logo: devicon('numpy') },
      { name: 'Pillow', icon: Images },
    ],
  },
  {
    title: 'Languages',
    items: [
      { name: 'HTML5', logo: devicon('html5') },
      { name: 'CSS3', logo: devicon('css3') },
      { name: 'JavaScript (ES2022)', logo: devicon('javascript') },
      { name: 'TypeScript', logo: devicon('typescript') },
      { name: 'SQL', logo: devicon('azuresqldatabase') },
      { name: 'Python', logo: devicon('python') },
    ],
  },
  {
    title: 'Backend',
    items: [
      { name: 'FastAPI', logo: devicon('fastapi') },
      { name: 'Flask', logo: devicon('flask') },
      { name: 'Pydantic', logo: simple('pydantic') },
      { name: 'SQLAlchemy (ORM)', logo: devicon('sqlalchemy') },
      { name: 'Uvicorn (ASGI)', icon: Server },
      { name: 'RESTful API Design', icon: Webhook },
      { name: 'WebSocket APIs', icon: Cable },
      { name: 'JWT Auth', logo: `${simple('jsonwebtokens')}/white` },
      { name: 'bcrypt', icon: KeyRound },
    ],
  },
  {
    title: 'Video & Streaming',
    items: [
      { name: 'RTSP', icon: Radio },
      { name: 'ONVIF', icon: Cctv },
      { name: 'WebRTC (aiortc)', logo: `${simple('webrtc')}/white` },
      { name: 'PyAV / FFmpeg', logo: simple('ffmpeg') },
      { name: 'NVDEC / libx264', logo: simple('nvidia') },
      { name: 'MJPEG', icon: Film },
      { name: 'MSE / fMP4', icon: FileVideo },
      { name: 'Live Multi-Camera Pipelines', icon: Network },
    ],
  },
  {
    title: 'Frontend',
    items: [
      { name: 'React 19', logo: devicon('react') },
      { name: 'TypeScript', logo: devicon('typescript') },
      { name: 'Vite', logo: devicon('vitejs') },
      { name: 'Tailwind CSS', logo: devicon('tailwindcss') },
      { name: 'TanStack Router', logo: `${simple('tanstack')}/white` },
      { name: 'TanStack Query', logo: simple('reactquery') },
      { name: 'React Hook Form', logo: simple('reacthookform') },
      { name: 'Zod', logo: simple('zod') },
      { name: 'Radix UI', logo: `${simple('radixui')}/white` },
      { name: 'Recharts', icon: BarChart3 },
    ],
  },
  {
    title: 'Databases & Cloud',
    items: [
      { name: 'PostgreSQL', logo: devicon('postgresql') },
      { name: 'SQLite', logo: devicon('sqlite') },
      { name: 'Supabase', logo: '/icons/supabase.png' },
      { name: 'AWS EC2', logo: '/icons/cloud_EC2.png' },
      { name: 'Railway', logo: devicon('railway') },
      { name: 'Cloudflare', logo: devicon('cloudflare') },
    ],
  },
  {
    title: 'DevOps & Tools',
    items: [
      { name: 'Git', logo: devicon('git') },
      { name: 'GitHub', logo: devicon('github') },
      { name: 'Docker', logo: devicon('docker') },
      { name: 'CI/CD', icon: InfinityIcon },
    ],
  },
  {
    title: 'Business Applications',
    items: [
      { name: 'HRMS', icon: Users },
      { name: 'CRM', icon: Handshake },
      { name: 'ERP', icon: Boxes },
      { name: 'LMS', icon: GraduationCap },
      { name: 'Workflow Automation', icon: Workflow },
      { name: 'Business Process Automation', icon: Cog },
      { name: 'Attendance Management', icon: CalendarCheck },
      { name: 'Employee Management', icon: IdCard },
      { name: 'Dashboards & Analytics', icon: LayoutDashboard },
    ],
  },
];
