'use client'

import s from './landing.module.css'
import { Navbar } from './_landing/Navbar'
import { Hero } from './_landing/Hero'
import { BentoFeatures } from './_landing/BentoFeatures'
import { HowItWorks } from './_landing/HowItWorks'
import { PricingSection } from './_landing/PricingSection'
import { FAQ } from './_landing/FAQ'
import { FinalCTA } from './_landing/FinalCTA'
import { Footer } from './_landing/Footer'

export default function Home() {
  return (
    <div className={s.nexo}>
      <Navbar />
      <main>
        <Hero />
        <BentoFeatures />
        <HowItWorks />
        <PricingSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
