"use client";

import { useRouter } from "next/navigation";
import { GoLocation } from "react-icons/go";
import { AiFillStar } from "react-icons/ai";

type Tour = {
  _id: string;
  images: string;
  location: string;
  rating: number;
  price: number;
};

type Props = {
  data: Tour;
};

export const Card = ({ data }: Props) => {
  const router = useRouter();

  const redirectToTourData = () => {
    router.push(`/tourDetail/${data._id}`);
  };

  return (
    <div>
      {/* Image */}
      <div className="relative">
        <img
          onClick={redirectToTourData}
          className="h-full w-full object-cover cursor-pointer"
          src={data.images}
          alt="Featured Tour"
        />

        {/* Featured Label */}
        <p className="absolute bottom-0 right-0 bg-orange-500 text-white py-1 px-3 text-sm font-semibold">
          Featured
        </p>
      </div>

      {/* Tour Information */}
      <div className="mt-2 p-2">
        {/* Location & Rating */}
        <div className="flex flex-row justify-between">
          <p className="text-orange-500 flex items-center gap-1">
            <GoLocation />

            {data.location}
          </p>

          <p className="flex items-center gap-1">
            <AiFillStar className="text-orange-500" />

            <span className="text-gray-400">
              {data.rating}
            </span>
          </p>
        </div>

        {/* Price & Book Button */}
        <div className="flex flex-row justify-between items-center mt-3">
          <p>
            <span className="text-orange-500">
              ${data.price}
            </span>

            <span className="text-gray-400 font-semibold text-sm">
              {" "}
              /Per Person
            </span>
          </p>

          <button
            type="button"
            onClick={redirectToTourData}
            className="cursor-pointer text-center font-semibold rounded-3xl bg-orange-500 text-white py-1 px-3 hover:bg-orange-600 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
