import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, MapPin, X, Loader } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showChatForm, setShowChatForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    mobileNumber: '',
    email: '',
    purpose: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Google Apps Script Web App URL (user will need to update this)
  const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobileNumber = (mobile: string): boolean => {
    const mobileRegex = /^[0-9]{10}$/;
    const cleanMobile = mobile.replace(/\D/g, '');
    return cleanMobile.length === 10;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!validateMobileNumber(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const dataToSubmit = {
        ...formData,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      // no-cors mode doesn't allow us to check response, so we assume success
      setSubmitMessage({
        type: 'success',
        text: 'Thanks! Your message has been sent. I\'ll get back to you soon!',
      });

      // Reset form
      setFormData({
        name: '',
        companyName: '',
        mobileNumber: '',
        email: '',
        purpose: '',
        message: '',
      });

      // Close form after 3 seconds
      setTimeout(() => {
        setShowChatForm(false);
        setSubmitMessage(null);
      }, 3000);
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Failed to send message. Please try again or contact me directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeChatForm = () => {
    setShowChatForm(false);
    setSubmitMessage(null);
    setErrors({});
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.fromTo(
        contentRef.current?.children || [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const socialLinks = [
    {
      label: 'WhatsApp',
      href: 'https://wa.me/919626863389',
      bgColor: 'bg-green-600 hover:bg-green-500',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      label: 'Email',
      href: 'mailto:akashrm.mail@gmail.com',
      bgColor: 'bg-red-600 hover:bg-red-500',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/akash-rm',
      bgColor: 'bg-blue-600 hover:bg-blue-500',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      label: 'GitHub',
      href: 'https://github.com/akash-BuildHub',
      bgColor: 'bg-gray-700 hover:bg-gray-600',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-24 md:py-32 relative">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="section-title">Contact</h2>

        <div
          ref={contentRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {/* Personal Message */}
          <div className="bg-[#0a0a12]/80 border border-border/50 rounded-xl p-8 transition-all duration-300">
            <h3 className="text-xl font-bold gradient-text mb-4">Akash's Portfolio</h3>
            <p className="text-foreground/80 leading-relaxed">
              Thanks for exploring my little corner of the web.<br></br>
              This portfolio is just the trailer, the real story begins when we connect.
            </p>
          </div>

          {/* Contact Info */}
          <div className="bg-[#0a0a12]/80 border border-border/50 rounded-xl p-8 transition-all duration-300">
            <h3 className="text-xl font-bold gradient-text mb-6">Reach Out</h3>
            <div className="space-y-4 selectable">
              <div className="flex items-center gap-4 text-foreground/80 hover:text-foreground transition-colors">
                <Phone className="w-5 h-5 text-primary" />
                <span>+91 96268 63389</span>
              </div>
              <div className="flex items-center gap-4 text-foreground/80 hover:text-foreground transition-colors">
                <Mail className="w-5 h-5 text-primary" />
                <span>akashtechcore@gmail.com</span>
              </div>
              <div className="flex items-center gap-4 text-foreground/80 hover:text-foreground transition-colors">
                <MapPin className="w-5 h-5 text-primary" />
                <span>India</span>
              </div>
            </div>
          </div>

          {/* Social Links - Colored circular icons */}
          <div className="bg-[#0a0a12]/80 border border-border/50 rounded-xl p-8 transition-all duration-300">
            <h3 className="text-xl font-bold gradient-text mb-6">Catch Me Online</h3>
            <div className="flex justify-center gap-4 mb-8">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-full ${social.bgColor} flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer`}
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            {/* Let's Talk Button */}
            <button
              onClick={() => setShowChatForm(!showChatForm)}
              className="w-full px-6 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {showChatForm ? 'Close' : "Let's Talk"}
            </button>
          </div>
        </div>

        {/* Chat Form Section - Styled as Card Like About Section */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-out mt-12 ${
            showChatForm ? 'max-h-[950px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#0a0a12]/80 border border-border/50 rounded-xl p-8 md:p-12 transition-all duration-500">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">Drop a Message</h3>
                <button
                  onClick={closeChatForm}
                  className="text-foreground/60 hover:text-foreground transition-colors p-1"
                  aria-label="Close form"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Left Column */}
                    <div className="space-y-5">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground/80 mb-2">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          className={`w-full px-4 py-3 bg-background/50 border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                            errors.name ? 'border-red-500 focus:border-red-500' : 'border-border/50'
                          }`}
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground/80 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className={`w-full px-4 py-3 bg-background/50 border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                            errors.email ? 'border-red-500 focus:border-red-500' : 'border-border/50'
                          }`}
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground/80 mb-2">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          placeholder="10-digit number"
                          className={`w-full px-4 py-3 bg-background/50 border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                            errors.mobileNumber ? 'border-red-500 focus:border-red-500' : 'border-border/50'
                          }`}
                        />
                        {errors.mobileNumber && <p className="text-red-400 text-xs mt-1.5">{errors.mobileNumber}</p>}
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground/80 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Your company (optional)"
                          className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                      {/* Purpose */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground/80 mb-2">
                          Purpose
                        </label>
                        <select
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#0a0a12] text-foreground">Select a purpose…</option>
                          <option value="Project Inquiry" className="bg-[#0a0a12] text-foreground">Project Inquiry</option>
                          <option value="Job Opportunity" className="bg-[#0a0a12] text-foreground">Job Opportunity</option>
                          <option value="Collaboration" className="bg-[#0a0a12] text-foreground">Collaboration</option>
                          <option value="General Inquiry" className="bg-[#0a0a12] text-foreground">General Inquiry</option>
                        </select>
                      </div>

                      {/* Message */}
                      <div className="md:row-span-3">
                        <label className="block text-sm font-semibold text-foreground/80 mb-2">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell me what's on your mind…"
                          rows={8}
                          className="w-full px-4 py-3 bg-background/50 border border-border/50 rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Message */}
                  {submitMessage && (
                    <div
                      className={`mb-6 p-4 rounded-lg text-sm font-medium border transition-all ${
                        submitMessage.type === 'success'
                          ? 'bg-green-500/20 text-green-300 border-green-500/40'
                          : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}
                    >
                      {submitMessage.text}
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default Contact;