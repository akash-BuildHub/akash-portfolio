// Site-wide details shared by the SEO tags, navbar and contact section.
export const SITE = {
  name: "Akash",
  jobTitle: "AI Developer",
  title: "Akash - Portfolio ✯",
  description:
    "Akash portfolio showcasing AI development, Python projects, web solutions, and real-world engineering work.",
  keywords: "Akash, AI Developer, Python Developer, Portfolio, React, Machine Learning",
  /** Social preview image and JSON-LD photo, relative to the site origin. */
  image: "/akash_profile.jpeg",
  resumePath: "/akash_resume.pdf",
} as const;

export const CONTACT = {
  email: "akashrm.mail@gmail.com",
  phoneDisplay: "+91 96268 63389",
  whatsappUrl: "https://wa.me/919626863389",
  location: "India",
  linkedinUrl: "https://www.linkedin.com/in/akash-rm",
  githubUrl: "https://github.com/akash-BuildHub",
} as const;
