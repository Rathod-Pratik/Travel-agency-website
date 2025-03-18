import React from 'react'
import Contect from '../../Components/Contect'
import Banner from '../../Components/Banner'

const About = () => {
  return (
    <>
   
   <div className="flex flex-col-reverse md:flex-row gap-8 p-4 m-auto min-h-[65vh] overflow-hidden w-full max-w-[90vw]">
  {/* Text Content Section */}
  <div className="w-full md:w-[45vw] flex flex-col justify-center text-center md:text-left gap-y-4">
    <div className="flex flex-row items-center justify-center md:justify-start">
      <span className="text-2xl mb-4 bg-[orange] px-4 py-2 text-white inline-block hero-title rounded-[50px] shadow-md">
        About Us
      </span>
      <img
        src="/tour-images/world.png"
        className="w-[50px] h-[50px] mb-2 ml-2"
        alt="World Icon"
      />
    </div>
    <p className="text-3xl md:text-4xl font-semibold">
      Traveling Opens The Door To Creating <br />
      <span className="text-[orange]">Memories</span>
    </p>
    <p className="text-gray-700">
      At Easy Travel Agency, we believe that travel is not just about visiting destinations—it's about creating memories that last a lifetime. Our mission is to turn your travel dreams into reality, helping you explore the world with ease, comfort, and excitement.
    </p>
  </div>

  {/* Media Content Section */}
  <div className="w-full md:w-[45%] flex justify-end items-center">
    <img
      src="/public/tour-images/logo1.png"
      alt="A picturesque view of the destination"
      className="object-cover w-[90%] md:w-[75%]"
    />
  </div>
</div>
<Contect/>
<Banner/>
</>
  )
}

export default About
