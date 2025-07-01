import React, { useEffect, useState } from "react";
import { apiClient } from "../lib/api-Client";
import {GET_TOUR} from "../Utils/Constant";
import TourCard from "./TourCard";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "./Loading";

const TourSection = () => {
  const [tourData, setTourData] = useState([]);
  const [loading,setLoading]=useState(true)
  useEffect(() => {
    const FetchTour = async () => {
      setLoading(true)
      try {
        const response = await apiClient.get(`${GET_TOUR}`);
        if (response.status === 200) {
          setTourData(response.data.data);
        } 
      } catch (error) {
        const {data,status}=error.response;
        if(data.success==false && status==500){
          toast.error("Server is Down try again after some time")
        }
      }finally{
        setLoading(false)
      }
    };
    FetchTour();
  }, []);

  return (
    <div className="mt-6 w-[95%] mx-auto">
  {/* Section Header */}
  <div className="mb-6">
    <p data-aos="fade-right" className="text-2xl bg-[orange] px-4 py-2 text-white inline-block hero-title rounded-[50px] shadow-md mb-6 mx-auto md:ml-0">
      Explore
    </p>
    <p data-aos="fade-right" className="text-4xl font-bold text-gray-800">
      Our Featured Tours
    </p>
  </div>

  {/* Featured Tours List */}
  {
    loading ==true ? (
     <div className="flex justify-center items-center h-[45vh]">
        <Loading/>
      </div>
    ):(
  <div className="grid grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 sm:self-center">
    {tourData.map((data, index) => (
      <div data-aos="fade-down" key={index} className="w-full sm:w-[300px] rounded-lg shadow-sm">
        <TourCard data={data} />
      </div>
    ))}
  </div>
    )
  }


  {/* View All Tours Link */}
  <div className="text-center">
    <Link
      to="/tour"
      className="inline-block w-[150px] mt-6 cursor-pointer text-center font-semibold rounded-3xl bg-[orange] text-white py-3 px-4 hover:bg-orange-600 transition-transform hover:scale-[1.05]"
    >
      View All Tours
    </Link>
  </div>
</div>

  );
};

export default TourSection;
