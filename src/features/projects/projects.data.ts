import { Camera, Hospital, Radar, ScanFace, ScanText, Smile, Trophy, Vote } from 'lucide-react';

export interface Project {
  title: string;
  year?: string;
  description: string;
  features: string[];
  icon: React.ElementType;
  /** Card cover; without one the card shows placeholder art built from `icon`. */
  image?: string;
  link?: string;
  demoImages?: string[];
}

export const projects: Project[] = [
  {
    title: 'AI-Powered HRMS & Facial Recognition Attendance Platform',
    year: '2026',
    description:
      'AI-powered workforce platform integrating facial recognition, automated attendance, payroll-related workflows, and HR/admin dashboards. Powered by GPU face recognition (InsightFace + ONNX Runtime CUDA) and live multi-camera WebRTC streaming.',
    features: ['InsightFace', 'ONNX Runtime (CUDA)', 'FastAPI', 'WebRTC'],
    icon: ScanFace,
    image: '/project_demo/AI_attendance_system/cover.webp',
    demoImages: [
      '/project_demo/AI_attendance_system/1.jpeg',
      '/project_demo/AI_attendance_system/2.png',
      '/project_demo/AI_attendance_system/3.png',
      '/project_demo/AI_attendance_system/4.png',
      '/project_demo/AI_attendance_system/5.png',
      '/project_demo/AI_attendance_system/6.png',
    ],
  },
  {
    title: 'AI Election Prediction',
    year: '2026',
    description:
      'A data-driven election forecasting system that leverages machine learning models on historical voting data, demographic indicators, and sentiment signals to predict constituency-level outcomes with confidence scoring and interactive visual analytics.',
    features: ['Machine Learning', 'Forecasting', 'Data Analytics'],
    icon: Vote,
    image: '/project_demo/AI_election_prediction/cover.webp',
    link: 'https://owlytics-election-prediction.vercel.app/',
  },
  {
    title: 'AI Cricket Shot Classification & Batting Analysis System',
    year: '2026',
    description:
      'Cricket shot classifier built on a CNN-LSTM architecture with MobileNetV2 for video-based action recognition. Designed preprocessing and feature-engineering pipelines plus backend APIs for confidence scoring and performance tiering.',
    features: ['CNN-LSTM', 'MobileNetV2', 'FastAPI', 'Action Recognition'],
    icon: Trophy,
    image: '/project_demo/AI_cricket_batting/cover.webp',
    link: 'https://ai-batting-classifier.vercel.app/',
  },
  {
    title: 'AI Real-Time Person Detection & Tracking System',
    year: '2026',
    description:
      'Real-time person detection and multi-object tracking pipeline using YOLO, processing RTSP streams with optimized inference. Implements frame-wise analytics and unique person counting.',
    features: ['YOLO', 'Multi-Object Tracking', 'RTSP', 'Python'],
    icon: Radar,
  },
  {
    title: 'Emotion Recognition',
    year: '2026',
    description:
      'An AI-powered emotion recognition system that uses deep learning and computer vision to detect facial expressions in real time and classify emotions such as happiness, sadness, anger, and surprise, enabling intelligent sentiment analysis and human-computer interaction.',
    features: ['Deep Learning', 'Computer Vision', 'Emotion Detection'],
    icon: Smile,
    image: '/project_demo/emotion_recognition/cover.webp',
    link: 'https://emotion-recognition-two.vercel.app/',
  },
  {
    title: 'Vision Snap — Computer Vision Dataset Tool',
    year: '2025',
    description:
      'Dataset-generation tool built in React with webcam capture, video frame extraction, and automated dataset packaging workflows for computer vision.',
    features: ['React', 'Webcam Capture', 'Dataset Automation'],
    icon: Camera,
    image: '/project_demo/vision_snap/cover.webp',
    link: 'https://vision-snap-two.vercel.app/',
  },
  {
    title: 'ALL IN ONE — OCR Web Application',
    year: '2025',
    description:
      'JavaScript OCR web app with a modular architecture and responsive UI for structured, multi-page text and image extraction from documents, PDFs, and uploads.',
    features: ['JavaScript', 'OCR', 'Modular Architecture'],
    icon: ScanText,
    image: '/project_demo/all_in_one_ocr/cover.webp',
    link: 'https://allinone-snowy.vercel.app/',
  },
  {
    title: 'Hospital Management System with Brain Tumor Detection',
    year: '2024',
    description:
      'Django-based hospital management system with authentication workflows and integrated deep-learning brain tumor detection and medical reporting.',
    features: ['Django', 'Deep Learning', 'Medical Imaging'],
    icon: Hospital,
  },
];
