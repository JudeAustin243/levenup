"use client";

import Link from "next/link";
import { FaqSectionWithCategories } from "@/components/ui/faq-with-categories";
import ShaderBackground from "@/components/ui/shader-background";
import { TestimonialSection } from "@/components/ui/testimonials";
import { motion } from "motion/react";
import {
  Brain,
  Hexagon,
  Target,
  ClipboardList,
  BarChart3,
  Timer,
  BookOpen,
  Divide,
  Cog,
  Puzzle,
} from "lucide-react";

// ─── ANIMATION PRESETS ──────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

// ─── SUBJECTS ───────────────────────────────────────────────
const subjects = [
  { name: "Maths", icon: Divide, color: "text-red-600 bg-red-50", description: "Arithmetic, algebra, geometry, and word problems" },
  { name: "English", icon: BookOpen, color: "text-blue-600 bg-blue-50", description: "Comprehension, grammar, vocabulary, and spelling" },
  { name: "Verbal Reasoning", icon: Cog, color: "text-green-600 bg-green-50", description: "Analogies, codes, sequences, and word patterns" },
  { name: "Non-Verbal Reasoning", icon: Puzzle, color: "text-orange-500 bg-orange-50", description: "Shapes, rotations, reflections, and spatial logic" },
];

// ─── FEATURES / BENEFITS ────────────────────────────────────
const features = [
  { title: "AI-Powered Study Plans", desc: "Personalised weekly schedules that adapt as your child improves — no more guessing what to practise next.", icon: Brain },
  { title: "Hexagon Skills Profile", desc: "A visual radar chart across 6 competency areas so you can see progress at a glance.", icon: Hexagon },
  { title: "Adaptive Difficulty", desc: "Questions get harder as your child improves and easier when they struggle — always the right challenge.", icon: Target },
  { title: "Diagnostic Assessment", desc: "A 40-question baseline test that identifies exactly where to focus from day one.", icon: ClipboardList },
  { title: "Parent Dashboard", desc: "Weekly reports, accuracy trends, and topic breakdowns — know how your child is doing without hovering.", icon: BarChart3 },
  { title: "Timed Practice", desc: "Countdown timers that simulate real exam conditions so test day feels familiar.", icon: Timer },
];

// ─── HOW IT WORKS ───────────────────────────────────────────
const steps = [
  { num: 1, title: "Take the diagnostic", desc: "A 40-question assessment pinpoints your child's strengths and gaps across all four subjects." },
  { num: 2, title: "Get a personalised plan", desc: "Our AI builds a weekly study schedule targeting the areas that need the most attention." },
  { num: 3, title: "Practise daily, track progress", desc: "20 minutes a day with adaptive questions. Watch the hexagon skills profile grow week by week." },
];

// ─── TESTIMONIALS ───────────────────────────────────────────
const testimonials = [
  {
    id: 1,
    quote:
      "The adaptive questions kept my daughter challenged without overwhelming her. She went from struggling with verbal reasoning to scoring in the top 10%.",
    name: "Sarah T.",
    role: "Parent, Year 5",
    imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    quote:
      "We could see exactly which areas needed work. The AI study plan adjusted every week — it felt like having a tutor who actually knew our child.",
    name: "David C.",
    role: "Parent, Year 4",
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    quote:
      "I actually enjoy doing the NVR questions now! The shapes are like puzzles. I do 20 minutes every day after school.",
    name: "Amara O.",
    role: "Student, Year 5",
    imageSrc: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&auto=format&fit=crop&q=80",
  },
];

// ─── SCHOOLS ────────────────────────────────────────────────
const schools = [
  { src: "/schools/st olaves.png", alt: "St Olave's Grammar School", h: "h-28 md:h-36" },
  { src: "/schools/Wilson's-School-Badge.png", alt: "Wilson's School", h: "h-16 md:h-24" },
  { src: "/schools/SPS-logo-full-colour-centred-removebg-preview.png", alt: "St Paul's School", h: "h-16 md:h-24" },
  { src: "/schools/alleyns_school_logo-removebg-preview.png", alt: "Alleyn's School", h: "h-28 md:h-36" },
  { src: "/schools/Brighton-College-Logo.png", alt: "Brighton College", h: "h-16 md:h-24" },
  { src: "/schools/Westminster-School-logo-600dpi-removebg-preview.png", alt: "Westminster School", h: "h-16 md:h-24" },
];

// ─── FAQ ────────────────────────────────────────────────────
const faqItems = [
  {
    question: "How much does LevenUp cost compared to a tutor?",
    answer: "Private 11+ tutors charge an average of \u00a360 per month for a single subject. LevenUp costs just \u00a340/month and covers all four core subjects \u2014 Maths, English, Verbal Reasoning, and Non-Verbal Reasoning \u2014 with unlimited practice, AI-driven personalisation, and detailed progress tracking. That\u2019s less than the price of one tutoring session for a full month of comprehensive preparation.",
  },
  {
    question: "What makes LevenUp different from other 11+ platforms?",
    answer: "Most platforms give every child the same static question bank. LevenUp uses AI to adapt in real-time: it identifies your child\u2019s weak areas through a diagnostic assessment, builds a personalised study plan, and adjusts question difficulty as they improve. The hexagon skills profile gives you a visual snapshot of progress across six competency areas \u2014 something no other platform offers.",
  },
  {
    question: "Which exam boards does LevenUp cover?",
    answer: "LevenUp covers GL Assessment, CEM, and ISEB formats. Our question bank is designed to match the style, difficulty, and timing of real 11+ papers so your child is fully prepared regardless of which exam board their target school uses.",
  },
  {
    question: "How does the adaptive difficulty work?",
    answer: "When your child answers questions, our AI engine tracks accuracy, speed, and topic performance. If they\u2019re finding a topic too easy, it increases the difficulty. If they\u2019re struggling, it dials it back and provides more practice at the right level. This keeps your child in the optimal learning zone \u2014 always challenged but never overwhelmed.",
  },
  {
    question: "Is LevenUp suitable for Year 4 and Year 5 students?",
    answer: "Absolutely. Most families start in Year 4 to build a strong foundation. The diagnostic assessment sets a personalised baseline regardless of starting level, and the AI study plan adjusts weekly. Starting earlier means more time for steady, stress-free preparation rather than last-minute cramming.",
  },
  {
    question: "Can I track my child\u2019s progress?",
    answer: "Yes. The parent dashboard shows detailed analytics including questions completed, accuracy by subject and topic, weekly progress trends, and the hexagon skills profile. You\u2019ll know exactly where your child is excelling and where they need more focus \u2014 without having to sit next to them during every session.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white overflow-x-hidden">
      {/* ─── NAVIGATION ─────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">11+</span>
            </div>
            <span className="font-bold text-xl text-gray-900">LevenUp</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-5 py-2.5 rounded-full border border-gray-200"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-colors"
            >
              Sign Up For Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO (Shader Background, Centered, Full Viewport) ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ShaderBackground />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 text-center py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block bg-white/10 backdrop-blur-sm text-indigo-200 text-base font-medium px-6 py-2.5 rounded-full mb-10 border border-white/20"
          >
            AI-powered 11+ preparation
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.05] mb-10"
          >
            The smartest way to{" "}
            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              prepare for the 11+
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl text-indigo-100/80 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Adaptive questions, personalised study plans, and real-time
            progress tracking across all four subjects. Like having a
            private tutor — available 24/7.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-white text-indigo-700 px-10 py-4.5 rounded-full font-semibold text-lg hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/examples"
              className="inline-flex items-center justify-center text-white font-medium text-lg px-10 py-4.5 rounded-full hover:bg-white/10 transition-colors border border-white/20"
            >
              See Example Questions &rarr;
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── SCHOOL LOGOS TRUST STRIP ───────────────────────── */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <motion.p
            {...fadeUp}
            className="text-center text-gray-400 text-base font-medium tracking-wide uppercase mb-10"
          >
            Families preparing for
          </motion.p>
          <div className="grid grid-cols-3 md:grid-cols-6 items-center gap-y-10 gap-x-8 md:gap-x-14">
            {schools.map((school, i) => (
              <motion.div
                key={school.alt}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-center"
              >
                <img
                  src={school.src}
                  alt={school.alt}
                  className={`${school.h} w-auto max-w-full object-contain`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (3 Steps) ─────────────────────────── */}
      <section className="bg-gray-50 py-28">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <motion.h2
            {...fadeUp}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-5"
          >
            How LevenUp works
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="text-gray-500 text-center mb-20 text-xl max-w-3xl mx-auto"
          >
            From diagnostic to daily practice in three simple steps
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 relative">
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+30px)] right-[calc(16.67%+30px)] h-0.5 border-t-2 border-dashed border-gray-300" />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="text-center relative"
              >
                <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-6 relative z-10">
                  {step.num}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-lg text-gray-500 max-w-sm mx-auto leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SUBJECT COVERAGE ───────────────────────────────── */}
      <section className="bg-white py-28">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <motion.h2
            {...fadeUp}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-5"
          >
            Complete 11+ subject coverage
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="text-gray-500 text-center mb-16 max-w-3xl mx-auto text-xl"
          >
            Aligned with GL Assessment, CEM, and ISEB exam formats
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {subjects.map((subject, i) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow"
              >
                <div className={`w-14 h-14 ${subject.color} rounded-xl flex items-center justify-center mb-5`}>
                  <subject.icon className="w-8 h-8" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{subject.name}</h3>
                <p className="text-base text-gray-500 leading-relaxed">{subject.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CORE BENEFITS ──────────────────────────────────── */}
      <section className="bg-gray-50 py-28">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <motion.h2
            {...fadeUp}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-5"
          >
            More than just a question bank
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="text-gray-500 text-center mb-16 max-w-3xl mx-auto text-xl"
          >
            Every feature is designed to make preparation smarter, not harder
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-5"
                >
                  <div className="shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-indigo-600" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{f.title}</h3>
                    <p className="text-base text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────── */}
      <TestimonialSection
        title="Trusted by families across the UK"
        subtitle="Hear from parents and students who've used LevenUp"
        testimonials={testimonials}
      />

      {/* ─── FAQ (Two-Column Layout) ────────────────────────── */}
      <FaqSectionWithCategories
        title="Frequently Asked Questions"
        description="Everything you need to know about LevenUp"
        className="bg-gray-50"
        items={faqItems}
      />

      {/* ─── FINAL CTA ──────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-16 py-28 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Start your child&apos;s 11+ preparation today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-indigo-100 mb-10 text-xl max-w-2xl mx-auto"
          >
            Join thousands of families preparing smarter with AI-powered revision.
            Free to start — no card required.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link
              href="/signup"
              className="inline-block bg-white text-indigo-700 px-10 py-4 rounded-full font-semibold text-lg hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/pricing"
              className="text-indigo-200 font-medium text-lg hover:text-white transition-colors"
            >
              View pricing &rarr;
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="w-full max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">11+</span>
              </div>
              <span className="font-bold text-white">LevenUp</span>
            </div>
            <p className="text-sm">
              AI-powered 11+ exam preparation platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
