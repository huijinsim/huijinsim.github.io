/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { ExternalLink, Github, Instagram, Mail, ArrowRight } from "lucide-react";
import { RoundTree, SlimTree } from "./TreeGraphics";

const PROJECTS = [
  {
    title: "Eco Digital Archive",
    year: "2024",
    category: "Web / Interaction",
    description: "A digital space exploring the intersection of nature and pixels.",
    image: "https://picsum.photos/seed/forest-1/800/600"
  },
  {
    title: "Organic Motion System",
    year: "2023",
    category: "Motion Graphics",
    description: "Study of fluid transitions in geometric nature-inspired patterns.",
    image: "https://picsum.photos/seed/nature-2/800/600"
  },
  {
    title: "Silent Growth",
    year: "2023",
    category: "Installation",
    description: "Multi-sensory experience using reactive light and sound.",
    image: "https://picsum.photos/seed/growth-3/800/600"
  }
];

export default function PortfolioContent() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-8 flex justify-between items-center z-50 bg-cream/80 backdrop-blur-md">
        <span className="font-serif text-2xl text-forest font-bold tracking-tight">F.S</span>
        <div className="hidden md:flex gap-12 font-medium text-ink/70">
          <a href="#about" className="hover:text-forest transition-colors">About</a>
          <a href="#projects" className="hover:text-forest transition-colors">Works</a>
          <a href="#contact" className="hover:text-forest transition-colors">Contact</a>
        </div>
        <div className="flex gap-4">
          <Mail className="w-5 h-5 cursor-pointer hover:text-forest" />
          <Instagram className="w-5 h-5 cursor-pointer hover:text-forest" />
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row gap-12 items-end"
        >
          <div className="flex-1">
            <h1 className="text-7xl md:text-9xl font-serif leading-[0.9] text-ink mb-8">
              Silent <br />
              <span className="text-forest">Growth.</span>
            </h1>
            <p className="text-xl md:text-2xl font-serif italic text-ink/60 max-w-lg">
              Designing digital landscapes where interactions feel as natural as a forest morning.
            </p>
          </div>
          <div className="w-48 h-64 hidden lg:block opacity-40">
            <SlimTree growth={1} />
          </div>
        </motion.div>
      </header>

      {/* Projects Grid */}
      <section id="projects" className="py-20 px-8 max-w-7xl mx-auto border-t border-ink/10">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl font-serif">Selected Archives</h2>
          <span className="text-sm font-medium tracking-widest text-ink/40 uppercase">Scroll to explore</span>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {PROJECTS.map((project, i) => (
            <motion.div 
              key={i} 
              variants={item}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-ink/5 mb-6">
                <img 
                  src={project.image} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/20 transition-colors pointer-events-none" />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-serif font-semibold">{project.title}</h3>
                  <p className="text-ink/60">{project.category}</p>
                </div>
                <span className="text-ink/40 font-serif italic">{project.year}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-8 bg-forest text-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-20 -left-10 w-64 h-64 opacity-20">
              <RoundTree growth={1} color="#ffffff" />
            </div>
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">
              A Forest <br />in the <span className="italic">Machine.</span>
            </h2>
          </div>
          <div className="text-lg md:text-xl font-serif flex flex-col gap-8 opacity-90 leading-relaxed">
            <p>
              I believe digital experiences should breathe. Just as a forest grows through layered complexity and silent interactions, a great website should reveal itself through patient exploration.
            </p>
            <p>
              My work focuses on organic motion, generative layouts, and the preservation of "human" imperfection within rigid digital frameworks.
            </p>
            <div className="flex gap-8 pt-8">
              <a href="#" className="flex items-center gap-2 group">
                Github <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#" className="flex items-center gap-2 group">
                Resume <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-20 px-8 max-w-7xl mx-auto text-center">
        <div className="mb-12">
          <p className="text-xl font-serif text-ink/60 mb-4 italic">Available for organic collaborations</p>
          <a href="mailto:hello@forestsoul.com" className="text-5xl md:text-7xl font-serif hover:text-forest transition-colors">
            hello@forestsoul.com
          </a>
        </div>
        <div className="flex justify-center gap-12 pt-12 border-t border-ink/10">
          <a href="#" className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase hover:text-forest">
            Twitter 
          </a>
          <a href="#" className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase hover:text-forest">
            LinkedIn
          </a>
          <a href="#" className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase hover:text-forest">
            Are.na
          </a>
        </div>
      </footer>
    </div>
  );
}
