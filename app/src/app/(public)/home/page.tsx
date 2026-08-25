"use client"
import { Hero,Services,Tour,Experience,Gallery,Testimonial } from "./components"
import {Banner,Contect} from "@/components"


const Home = () => {
  return (
    <div className='m-auto flex flex-col gap-8 overflow-hidden'>
      <Hero/>
      <Services/>
      <Tour/>
      <Experience/>
      <Gallery/>
      <Testimonial/>
      <Contect/>
      <Banner/>
    </div>
  )
}

export default Home
