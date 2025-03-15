import React from 'react'

const Gallery = () => {
  return (
    <div className='w-[90%] m-auto' >
      <p className="text-2xl bg-[orange] px-4 py-2 text-white inline-block hero-title rounded-[50px] shadow-md mb-6 mx-auto md:ml-0">
      Gallery
    </p>
    <p className='text-4xl'>Visit Our Customers Tour Gallery</p>

    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4">
  <img
    src="/tour-images/gallery-01.jpg"
    alt="Gallery Image 1"
    className="rounded-lg object-cover h-[200px] w-full hover:scale-105 transition-transform duration-300 shadow-md"
  />
  <img
    src="/tour-images/gallery-02.jpg"
    alt="Gallery Image 2"
    className="rounded-lg object-cover h-[200px] w-full hover:scale-105 transition-transform duration-300 shadow-md"
  />
  <img
    src="/tour-images/gallery-03.jpg"
    alt="Gallery Image 3"
    className="rounded-lg object-cover h-[200px] w-full hover:scale-105 transition-transform duration-300 shadow-md"
  />
  <img
    src="/tour-images/gallery-04.jpg"
    alt="Gallery Image 4"
    className="rounded-lg object-cover h-[200px] w-full hover:scale-105 transition-transform duration-300 shadow-md"
  />
  <img
    src="/tour-images/gallery-05.jpg"
    alt="Gallery Image 5"
    className="rounded-lg object-cover h-[200px] w-full hover:scale-105 transition-transform duration-300 shadow-md"
  />
  <img
    src="/tour-images/gallery-06.jpg"
    alt="Gallery Image 6"
    className="rounded-lg object-cover h-[200px] w-full hover:scale-105 transition-transform duration-300 shadow-md"
  />
  <img
    src="/tour-images/gallery-07.jpg"
    alt="Gallery Image 7"
    className="rounded-lg object-cover h-[200px] w-full hover:scale-105 transition-transform duration-300 shadow-md"
  />
</div>

    </div>
  )
}

export default Gallery
