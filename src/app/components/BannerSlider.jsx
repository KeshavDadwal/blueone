// components/ScrollPin.js
"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import bannerbg from "@/app/assests/image/home_slide1.svg"
import WordBg from "@/app/assests/image/word_circle.svg"


gsap.registerPlugin(ScrollTrigger);

const BannerSlider = () => {
  useEffect(() => {
    const pinElements = document.querySelectorAll(".pin");

    pinElements.forEach((pinElement, index) => {
      if (index < 4) {
        ScrollTrigger.create({
          trigger: pinElement,
          start: "top",
          end: index === 4 ? "+=100%" : "+=300%",
          pin: true,
          scrub: 1, 
          markers: false,
        });
      }
    });

    return () => {
      // Cleanup ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="home_slider w-full overflow-hidden">
      <div className="w-[85%] flex flex-col justify-center mx-auto mb-5">
      {/* Pinned Sections */}
      
    <div className="pin h-full bg-[#FFF9ED] rounded-lg shadow-lg border-2">
      <div className="flex items-center h-full banner-bg z-111 slide_1"
      style={{ backgroundImage: `url(${bannerbg.src})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', }}
      >
        <div className="section-1-design item">
          <div className="w-full">
            <h3 className="text-[20px] font-medium lg:text-2xl">
              Books have the power to{" "}
              <span className="bg-yellow-400 rounded-md pl-1 font-ibm">
                transform lives
              </span>
              .
            </h3>
          </div>
          <div className="w-full mt-20 ">
            <i>
              <p className="font-normal text-black">
                How do <span className="border_line_3 font-normal font-ibm">we</span> invoke, experience, share and celebrate this power?
              </p>
            </i>
          </div>
        </div>
      </div>
    </div>

      <div className="pin h-full bg-[#FFFFFF] rounded-lg shadow-lg border-2 flex items-center">
        <div className="section-2-design item">
          <div className="w-full lg:w-[70%] mx-auto">
            <h3 className="mb-6 text-[20px] font-medium lg:leading-extra-loose lg:text-2xl text-black">
              Ours is the land of <i>dharma.</i> <br/>
              We are a civilization with rich literary and cultural heritage, <br/>
              but also with countless,
              conflicting narratives.
            </h3>
          </div>
          <div className="w-full lg:w-[70%] mx-auto">
            <i>
              <p className="text-sm leading-medium-loose lg:text-2xl text-black">
                How do we educate and re-educate our youth to discover this heritage, <br/>
                but also build something which is beyond and{" "}
                <em className="bg-yellow-400 rounded-md">
                  <span className="copy_line1 font-ibm">free</span> from any narrative
                </em>
                … <br/>
                a space where all narratives get subsumed and where thinking<br/>
                becomes completely liberated from all influences that hold back?
              </p>
            </i>
          </div>
          <div className="w-full lg:w-[70%] mx-auto">
            <i>
              <p className="text-[20px] leading-medium-loose lg:text-2xl text-black">
                Could there be <span className="leading-medium-loose border_line_2 font-ibm">a platform</span> compelling and powerful enough<br/>
                 to
                catch the{" "}
                <em className="bg-yellow-400 rounded-md">
                  imagination of 
                </em> <span className="copy_line2 font-ibm">the young</span><br/>
                without politicizing or polluting the mind,<br/> keeping it<em className="bg-yellow-400 rounded-md pb-1">&nbsp;pure&nbsp;</em>through
                debate and through rationality?
              </p>
            </i>
          </div>
          <div className="w-full lg:w-[70%] mx-auto">
            <i>
              <p className="text-black">
                How do we produce and promote<em className="bg-yellow-400 rounded-md pb-1">&nbsp;conscious literature?&nbsp;</em>
              </p>
            </i>
          </div>
          {/* Add more unique elements for Section 2 */}
        </div>
      </div>

      <div className="pin h-full bg-[#FFF9ED] rounded-lg shadow-lg border-2 flex items-center">
        <div className="section-3-design item">
          <div className="w-full lg:w-[44%] mx-auto ">
            <i>
              <p className="text-2xl leading-medium-loose font-light pt-6 text-black">
                How do we bring<em className="bg-yellow-400 rounded-md pb-1">&nbsp;depth/dharma</em> in
                political life, culture, business, warfare, education,
                evolution, and relationships through stories, and through the
                written word?
              </p>
            </i>
          </div>
          <div className="w-full lg:w-[44%] mx-auto">
            <i>
              <p className="leading-medium-loose text-2xl font-light pt-6 text-black">
                How do we bring out not just these stories,
                <br />
                but also{" "}
                <em className="bg-yellow-400 rounded-md">
                  the people behind them?
                </em>
              </p>
            </i>
          </div>
          <div className="w-full lg:w-[44%] mx-auto">
            <i>
              <h6 className="text-lg font-normal pt-6 leading-loose text-black">
                How do we celebrate the written <span className="word_bg font-ibm"
                style={{ backgroundImage: `url(${WordBg.src})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', padding: '10px 10px 10px 0px', position: 'relative' }}
                >world?</span>
              </h6>
            </i>
          </div>
          <div className="w-full lg:w-[44%] mx-auto">
            <i>
              <p className="text-2xl font-light pt-6 leading-medium-loose text-black">
                How do we invoke the power of the Ink?
              </p>
            </i>
          </div>
          <div className="w-full mt-10">
            <h4 className="text-black">A <span className="border_line_4 font-ibm">high caliber</span> <span className="border_line_3 font-ibm">Publishing house. &nbsp;</span></h4>
          </div>
        </div>
      </div>
      

      {/* Regular Scrollable Sections */}
      <div className="pin content h-full bg-[#FFFFFF] rounded-lg shadow-lg border-2 flex items-center">
        <div className="section-4-design item">
          <div className="w-full lg:w-[50%] mx-auto">
            <i>
              <p className="leading-medium-loose font-normal text-black">
                BluOne Ink is a drop in an ocean that is to be filled — <br/>
                an ocean that brings together thinkers, scholars, writers, <br/>
                philosophers, critics, artists and readers, to write and speak to posterity.
              </p>
            </i>
          </div>
          <div className="w-full lg:w-[44%] mx-auto mt-5 pt-2 text-black">
            <i>
              <p className="">BluOne Ink is an evolution of a revolution.</p>
            </i>
          </div>
          <div className="w-full lg:w-[44%] mx-auto mt-5 pt-2 text-black">
            <i>
              <p className="">Everything else is an operational nuance.</p>
            </i>
          </div>
        </div>
      </div>

      <style jsx>{`
        .pin,
        .content {
          padding: 20px;
          text-align: center;
          font-size: 24px;
          height:85vh;
          margin-bottom:20px;
        }
      `}</style>
      </div>
    </div>
  );
};

export default BannerSlider;
