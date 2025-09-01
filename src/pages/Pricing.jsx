import React from 'react'
import PricingHero from '../sections/pricing/PricingHero'
import Billing from '../sections/pricing/Billing'
import Faq from '../sections/pricing/Faq'

function Pricing() {
  return (
    <div className='pricing-page'>
        <PricingHero />
        <Billing />
        {/* <Faq /> */}
    </div>
  )
}

export default Pricing