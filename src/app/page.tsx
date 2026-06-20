'use client'

import { useEffect } from 'react'
import s from './landing.module.css'
import { Navbar } from './_landing/Navbar'
import { Hero } from './_landing/Hero'
import { ProofBar } from './_landing/ProofBar'
import { Posicionamento } from './_landing/Posicionamento'
import { BeforeAfter } from './_landing/BeforeAfter'
import { HowItWorks } from './_landing/HowItWorks'
import { BentoFeatures } from './_landing/BentoFeatures'
import { ComparisonTable } from './_landing/ComparisonTable'
import { Testimonials } from './_landing/Testimonials'
import { PricingSection } from './_landing/PricingSection'
import { FAQ } from './_landing/FAQ'
import { FinalCTA } from './_landing/FinalCTA'
import { Footer } from './_landing/Footer'

export default function Home() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-rev]')
    els.forEach((el) => el.classList.add(s.rev))

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = Number(el.dataset.revDelay ?? idx * 60)
            setTimeout(() => {
              el.classList.remove(s.rev)
              el.classList.add(s.revIn)
            }, delay)
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className={s.nexo}>
      <Navbar />
      <main>
        <Hero />
        <ProofBar />
        <Posicionamento />
        <BeforeAfter />
        <HowItWorks />
        <BentoFeatures />
        <ComparisonTable />
        <Testimonials />
        <PricingSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
