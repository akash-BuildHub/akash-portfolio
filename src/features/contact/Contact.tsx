import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, Mail, MapPin, Loader } from 'lucide-react';
import { prefersReducedMotion } from '@/lib/motion';
import { CONTACT } from '@/config/site';
import { submitContactForm, type ContactFormData } from '@/services/contact';
import { purposeOptions, socialLinks } from './contact.data';
import { validateContactForm } from './validation';

gsap.registerPlugin(ScrollTrigger);

const EMPTY_FORM: ContactFormData = {
  name: '',
  companyName: '',
  mobileNumber: '',
  email: '',
  purpose: '',
  message: '',
};

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors = validateContactForm(formData);
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
      await submitContactForm(formData);

      setSubmitMessage({
        type: 'success',
        text: 'Thanks! Your message has been sent. I\'ll get back to you soon!',
      });

      // Reset form
      setFormData(EMPTY_FORM);

      // Clear the success message after a few seconds
      setTimeout(() => {
        setSubmitMessage(null);
      }, 4000);
    } catch {
      setSubmitMessage({
        type: 'error',
        text: 'Failed to send message. Please try again or contact me directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (prefersReducedMotion()) return;

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

  const inputClass = (hasError?: boolean) =>
    `w-full border-0 border-b bg-transparent px-0 py-2 text-sm tracking-[0.08em] text-foreground placeholder-foreground/35 transition-colors focus:outline-none focus:ring-0 ${
      hasError ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-primary'
    }`;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden py-20 sm:py-24 md:py-32"
    >
      {/* Decorative gold cross accents */}
      <span aria-hidden="true" className="pointer-events-none absolute right-[5%] top-[12%] hidden text-4xl font-light text-primary/80 md:block">+</span>
      <span aria-hidden="true" className="pointer-events-none absolute right-[5%] bottom-[12%] hidden text-4xl font-light text-primary/70 md:block">+</span>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div ref={contentRef} className="mx-auto w-full max-w-6xl">
          {/* Heading */}
          <h2 className="text-4xl font-extrabold uppercase leading-[0.95] tracking-[0.04em] text-white sm:text-5xl md:text-6xl">
            Contact<span className="text-primary">.</span>
          </h2>

          {/* Form + contact information */}
          <div className="mt-12 grid grid-cols-1 gap-14 sm:mt-14 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4 lg:order-2 lg:border-l lg:border-border/60 lg:pl-10">
              <div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="NAME *"
                  autoComplete="name"
                  aria-label="Name"
                  aria-invalid={Boolean(errors.name)}
                  className={inputClass(Boolean(errors.name))}
                />
                {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
              </div>

              <div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="EMAIL *"
                  autoComplete="email"
                  aria-label="Email"
                  aria-invalid={Boolean(errors.email)}
                  className={inputClass(Boolean(errors.email))}
                />
                {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
              </div>

              <div>
                <input
                  id="mobileNumber"
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="PHONE *"
                  autoComplete="tel"
                  aria-label="Phone"
                  aria-invalid={Boolean(errors.mobileNumber)}
                  className={inputClass(Boolean(errors.mobileNumber))}
                />
                {errors.mobileNumber && <p className="mt-1.5 text-xs text-red-400">{errors.mobileNumber}</p>}
              </div>

              <div>
                <input
                  id="companyName"
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="COMPANY (OPTIONAL)"
                  autoComplete="organization"
                  aria-label="Company name"
                  className={inputClass(false)}
                />
              </div>

              <div>
                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  aria-label="Purpose"
                  className={`${inputClass(false)} cursor-pointer appearance-none ${formData.purpose ? 'text-foreground' : 'text-foreground/35'}`}
                >
                  <option value="" className="bg-[#1b1b1d] text-foreground">PURPOSE</option>
                  {purposeOptions.map((option) => (
                    <option key={option} value={option} className="bg-[#1b1b1d] text-foreground">{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="YOUR MESSAGE"
                  rows={3}
                  aria-label="Message"
                  className="w-full resize-none border-0 border-b border-border bg-transparent px-0 py-2 text-sm tracking-[0.08em] text-foreground placeholder-foreground/35 transition-colors focus:border-primary focus:outline-none focus:ring-0"
                />
              </div>

              {submitMessage && (
                <div
                  className={`p-4 text-sm font-medium ${
                    submitMessage.type === 'success' ? 'text-primary' : 'text-red-400'
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {submitMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 bg-primary px-9 py-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  'Send'
                )}
              </button>
            </form>

            {/* Contact information */}
            <div className="flex flex-col justify-center lg:order-1">
              <div className="mb-10">
                <div className="mb-3 flex items-center gap-4">
                  <span className="h-px w-12 bg-primary" />
                  <span className="text-[0.7rem] font-medium uppercase tracking-[0.4em] text-foreground/55">
                    Akash&apos;s Portfolio
                  </span>
                </div>
                <p className="text-sm leading-[1.9] tracking-wide text-foreground/65">
                  Thanks for exploring my little corner of the web. This portfolio is just the trailer, the real story begins when we connect.
                </p>
              </div>

              <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/85">
                Reach Out
              </h3>
              <div className="space-y-5 no-select">
                <div className="flex items-start gap-4">
                  <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="allow-copy text-sm tracking-wide text-foreground/70">{CONTACT.phoneDisplay}</span>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="allow-copy break-all text-sm tracking-wide text-foreground/70">{CONTACT.email}</span>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm tracking-wide text-foreground/70">{CONTACT.location}</span>
                </div>
              </div>

              <h3 className="mb-5 mt-10 text-xs font-semibold uppercase tracking-[0.3em] text-foreground/85">
                Catch Me Online
              </h3>
              <div className="flex items-center gap-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="text-foreground/55 transition-colors duration-300 hover:text-primary"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <path d={social.iconPath} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
