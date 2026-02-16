import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import leftarrow from "@/app/assests/image/leftarrow.svg";
import rightarrow from "@/app/assests/image/rightarrow.svg";
import Image from "next/image";

const NextArrow = ({ onClick }) => {
  return (
    <div
      className="custom-arrow next-arrow absolute right-[-50px] top-1/2 transform -translate-y-1/2 cursor-pointer p-2 z-10"
      onClick={onClick}
    >
      <Image src={rightarrow} width={25} height={25} alt="Next" />
    </div>
  );
};

const PrevArrow = ({ onClick }) => {
  return (
    <div
      className="custom-arrow prev-arrow absolute left-[-50px] top-1/2 transform -translate-y-1/2 cursor-pointer p-2 z-10"
      onClick={onClick}
    >
      <Image src={leftarrow} width={25} height={25} alt="Prev" />
    </div>
  );
};

const SliderBook = ({ testimonials = [] }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 10000,
    adaptiveHeight: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="wrapper bg-[#DDF5FF] w-[80%] mx-auto relative">
      <div className="container mx-auto p-0">
        {testimonials && testimonials.length > 0 ? (
          testimonials.length === 1 ? (
            // Single testimonial, no slider
            <div className="text-center p-8 w-full flex flex-col justify-center items-center min-h-[150px]">
              <p className="text-xl testi-quote md:text-2xl text-gray-700">
                {testimonials[0].quote}
              </p>
              <div className="text-center mt-6">
                <p className="text-xl font-bold text-blue-800">
                  {testimonials[0].name}
                </p>
                <p className="text-sm text-gray-600">
                  {testimonials[0].designation}
                </p>
              </div>
            </div>
          ) : (
            // Multiple testimonials, show slider
            <Slider {...settings}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="text-center p-8 w-full flex flex-col justify-center items-center min-h-[150px]"
                >
                  <p className="text-xl testi-quote md:text-2xl text-gray-700">
                    {testimonial.quote}
                  </p>
                  <div className="text-center mt-6">
                    <i>
                      <p className="text-2xl font-semibold font-ibm text-[#241B6D]">
                        {testimonial.name}
                      </p>
                    </i>
                    <i>
                      <p className="text-lg text-[#241B6D] font-normal">
                        {testimonial.designation}
                      </p>
                    </i>
                  </div>
                </div>
              ))}
            </Slider>
          )
        ) : (
          <p className="text-center text-gray-700">No testimonials available</p>
        )}
      </div>
    </div>
  );
};

export default SliderBook;
