import React from 'react'
import Hero from '../../Components/Hero'
import Services from '../../Components/Services'
import TourSection from '../../Components/TourSection'
import Experience from '../../Components/Experience'
import Gallery from '../../Components/Gallery'
import Testimonial from '../../Components/Testimonial'
import Contect from '../../Components/Contect'
import Banner from '../../Components/Banner'

const Home = () => {
  return (
    <div className='m-auto flex flex-col gap-8'>
      <Hero/>
      <Services/>
      <TourSection/>
      <Experience/>
      <Gallery/>
      <Testimonial/>
      <Contect/>
      <Banner/>
    </div>
  )
}

export default Home
