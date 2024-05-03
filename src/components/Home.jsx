import { React, useState, useEffect, useRef } from 'react';
import Header from './Header';
import Footer from './Footer';
import Marquee from 'react-fast-marquee';
import img1 from '../assets/img/ipca.png';
import img2 from '../assets/img/bayer.png';
import img3 from '../assets/img/lupin.png';
import img4 from '../assets/img/franco.png';
import backgroundImage from '../assets/img/main.jpg';
import w1 from '../assets/img/w1.png'
import w2 from '../assets/img/w2.png'
import wcm from '../assets/img/Group.jpg'
import left from '../assets/img/arrow-left.png'
import right from '../assets/img/arrow-right.png'
import marketing from '../assets/img/marketing.png'
import femaledoc from '../assets/img/female-doctor.png'
import onphone from '../assets/img/on_phone.png'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './style/Home.css'
import { NavLink } from 'react-router-dom';

const Home = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log(`Subscribing ${email}...`);
    // Add your subscription logic here
    setEmail('');
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3.4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };
  return (
    <div className="relative">
      <Header />
      <div className="relative" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Top Section */}
        <div className="flex relative flex-col items-start px-20 pt-20 pb-5 w-full max-md:px-5 max-md:max-w-full" >
          <div className="mt-48 text-6xl font-semibold tracking-wider text-indigo-800 leading-[58px] max-md:mt-10 max-md:max-w-full max-md:text-4xl max-md:leading-10">
            Virtual Visits, Demo products : <br />Meet Your Doctors Online!
          </div>
          <div className="mt-20 text-2xl font-medium leading-9 text-zinc-500 max-md:mt-10 max-md:max-w-full">
            Our platform connects medical sales representatives with doctors <br /> for virtual product presentations remotely.
          </div>
          <button className="flex gap-2.5 justify-center items-center px-4 py-6 mt-10 text-base font-bold text-center text-white uppercase bg-indigo-800 tracking-[2px] max-md:mt-10">
            <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
            <NavLink to="/signup" className="flex-auto self-stretch">Get Started</NavLink>
            <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center px-20 py-12 w-full bg-slate-50 max-md:px-5 max-md:max-w-full">
        <div className="text-4xl font-bold leading-7 text-indigo-800">
          What <span className="text-indigo-800">We Do?</span>
        </div>
        <div className="mt-9 w-full max-w-[1253px] max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow justify-center px-10 py-9 w-full bg-[#F7E9EB] max-md:px-5 max-md:mt-10 max-md:max-w-full">
                <div className="max-md:max-w-full">
                  <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                    <div className="flex flex-col w-[72%] max-md:ml-0 max-md:w-full">
                      <div className="mt-3 text-4xl font-semibold leading-10 text-indigo-800 max-md:mt-10">
                        HEALTHCARE
                        <br />
                        PROFESSIONAL
                      </div>
                    </div>
                    <div className="flex flex-col ml-5 w-[28%] max-md:ml-0 max-md:w-full">
                      <img
                        loading="lazy"
                        srcSet={w1}
                        className="shrink-0 max-w-full aspect-square w-[132px] max-md:mt-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3.5 text-base leading-5 text-zinc-500 max-md:max-w-full">
                  Our one-on-one virtual doctor consultations
                  <br />
                  give you the freedom and flexibility to
                  <br />
                  access expert medical advice at your
                  <br />
                  fingertips
                </div>
                <button className="flex gap-0.5 justify-center self-start px-5 py-3.5 mt-12 text-sm font-medium leading-5 text-indigo-800 border border-indigo-800 border-solid max-md:px-5 max-md:mt-10">
                  <div className="grow my-auto">Register Now</div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/e95b5401bbc073fb293ada4aad809ecadc6202fd77aebedc576925d98a1c1bd1?"
                    className="shrink-0 aspect-[1.05] w-[19px]"
                  />
                </button>
              </div>
            </div>
            <div class="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <div class="flex flex-col grow justify-center px-10 py-9 w-full bg-[#EEE7F6] max-md:px-5 max-md:mt-10 max-md:max-w-full">
                <div class="max-md:max-w-full">
                  <div class="flex gap-5 max-md:flex-col max-md:gap-0">
                    <div class="flex flex-col w-[72%] max-md:ml-0 max-md:w-full">
                      <div class="mt-3 text-4xl font-semibold leading-10 text-indigo-800 max-md:mt-10">
                        HEALTHCARE
                        <br />
                        PROFESSIONAL
                      </div>
                    </div>
                    <div class="flex flex-col ml-5 w-[28%] max-md:ml-0 max-md:w-full">
                      <img
                        loading="lazy"
                        srcSet={w2}
                        class="shrink-0 max-w-full aspect-square w-[132px] max-md:mt-10"
                      />
                    </div>
                  </div>
                </div>
                <div class="mt-3.5 text-base leading-5 text-zinc-500 max-md:max-w-full">
                  Our one-on-one virtual doctor consultations
                  <br />
                  give you the freedom and flexibility to
                  <br />
                  access expert medical advice at your
                  <br />
                  fingertips
                </div>
                <button class="flex gap-0.5 justify-center self-start px-5 py-3.5 mt-12 text-sm font-medium leading-5 text-indigo-800 border border-indigo-800 border-solid max-md:px-5 max-md:mt-10">
                  <div class="grow my-auto">Book an Online Consultation</div>
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/e95b5401bbc073fb293ada4aad809ecadc6202fd77aebedc576925d98a1c1bd1?"
                    class="shrink-0 aspect-[1.05] w-[19px]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center px-16 pt-16 pb-5 w-full bg-white max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col w-full max-w-[1188px] max-md:max-w-full">
          <div className="self-center text-4xl font-semibold leading-10 text-center text-indigo-800">
            Why choose Medivirt{" "}
          </div>
          <div className="mt-14 max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-2/4 max-md:ml-0 max-md:w-full">
                <img
                  loading="lazy"
                  srcSet={wcm}
                  className="w-full aspect-[1.02] max-md:mt-10 max-md:max-w-full"
                />
              </div>
              <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow mt-2 max-md:mt-10 max-md:max-w-full">
                  <div className="pt-10 pb-2 mt-7 border-t border-solid border-slate-200 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                      <div className="flex flex-col w-[19%] max-md:ml-0 max-md:w-full">
                        <div className="text-8xl text-violet-100 leading-[99.91px] max-md:mt-10 max-md:text-4xl">
                          01
                        </div>
                      </div>
                      <div className="flex flex-col ml-5 w-[81%] max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col grow max-md:mt-10 max-md:max-w-full">
                          <div className="text-2xl font-medium tracking-tight leading-7 text-zinc-500 max-md:max-w-full">
                            Virtual Meetings
                          </div>
                          <div className="mt-2 text-base leading-5 text-slate-500 max-md:max-w-full">
                            Dedicated spaces for interactive presentations and discussions between healthcare professionals and companies.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-10 pb-2 mt-7 border-t border-solid border-slate-200 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                      <div className="flex flex-col w-[19%] max-md:ml-0 max-md:w-full">
                        <div className="text-8xl text-violet-100 leading-[99.91px] max-md:mt-10 max-md:text-4xl">
                          02
                        </div>
                      </div>
                      <div className="flex flex-col ml-5 w-[81%] max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col grow max-md:mt-10 max-md:max-w-full">
                          <div className="text-2xl font-medium tracking-tight leading-7 text-zinc-500 max-md:max-w-full">
                            Healthcare Innovations
                          </div>
                          <div className="mt-2 text-base leading-5 text-slate-500 max-md:max-w-full">
                            Doctors often struggle to stay updated with the latest
                            healthcare innovations due to time constraints and
                            limited access to information.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-11 mt-6 border-t border-solid border-slate-200 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                      <div className="flex flex-col w-[19%] max-md:ml-0 max-md:w-full">
                        <div className="text-8xl text-violet-100 leading-[99.99px] max-md:mt-10 max-md:text-4xl">
                          03
                        </div>
                      </div>
                      <div className="flex flex-col ml-5 w-[81%] max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col grow mt-1 max-md:mt-10 max-md:max-w-full">
                          <div className="text-2xl font-medium tracking-tight leading-7 text-zinc-500 max-md:max-w-full">
                            Flex Medical Reps
                          </div>
                          <div className="mt-1 text-base leading-5 text-slate-500 max-md:max-w-full">
                            Flex reps enable optimized allocation of resources,
                            ensuring cost-effectiveness & can cover wider
                            geographic regions, expanding market reach and
                            penetration.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-11 mt-6 border-t border-solid border-slate-200 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                      <div className="flex flex-col w-[19%] max-md:ml-0 max-md:w-full">
                        <div className="text-8xl text-violet-100 leading-[99.99px] max-md:mt-10 max-md:text-4xl">
                          04
                        </div>
                      </div>
                      <div className="flex flex-col ml-5 w-[81%] max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col grow max-md:mt-10 max-md:max-w-full">
                          <div className="text-2xl font-medium tracking-tight leading-7 text-zinc-500 max-md:max-w-full">
                            Single Point Distribution
                          </div>
                          <div className="mt-1 text-base leading-5 text-slate-500 max-md:max-w-full">
                            We're also eager to assist with distribution efforts.
                            We can extend our support in various distribution
                            channels, leveraging our network and expertise to
                            ensure your products reach their intended markets
                            effectively and efficiently.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center px-5 pt-9 w-full bg-red-50 max-md:max-w-full">
        <div className="text-4xl font-semibold text-indigo-800">
          Simplified Process
        </div>
        <div className="mt-7 text-lg text-center text-indigo-800 uppercase max-md:max-w-full">
          Tailored Process for Healthcare Companies and professionals
        </div>
        <div className="flex flex-col self-stretch px-20 mt-6 w-full max-md:px-5 max-md:max-w-full">
          <Slider {...settings}>
            <div className="ml-5" style={{ marginRight: '20px' }}>
              <div className="flex grow gap-2.5 px-7 py-12 w-full font-semibold text-indigo-800 uppercase bg-white rounded-3xl max-md:px-5 max-md:mt-8">
                <div className="flex flex-col">
                  <div className="text-xl leading-5">Scheduling Meetings</div>
                  <div className="mt-14 text-base leading-5 text-zinc-500 max-md:mt-10">
                    Medical sales reps initiate meeting requests, specifying
                    preferred dates and times.
                    <br />
                  </div>
                  <div className="mt-20 text-lg leading-8 max-md:mt-10">
                    Learn more
                  </div>
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1be6014d039f9aa1761f4b32d1fa07a6231828074f9e482813d4f7d74b2d0beb?"
                  className="shrink-0 self-end mt-48 border-2 border-solid aspect-[1.67] border-zinc-800 stroke-[2.38px] stroke-zinc-800 w-[25px] max-md:mt-10"
                />
              </div>
            </div>
            <div className="ml-5" style={{ marginRight: '20px' }}>
              <div className="flex grow gap-2.5 px-7 py-12 w-full font-semibold text-indigo-800 uppercase bg-white rounded-3xl max-md:px-5 max-md:mt-8">
                <div className="flex flex-col">
                  <div className="text-xl leading-5">Scheduling Meetings</div>
                  <div className="mt-14 text-base leading-5 text-zinc-500 max-md:mt-10">
                    Medical sales reps initiate meeting requests, specifying
                    preferred dates and times.
                    <br />
                  </div>
                  <div className="mt-20 text-lg leading-8 max-md:mt-10">
                    Learn more
                  </div>
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1be6014d039f9aa1761f4b32d1fa07a6231828074f9e482813d4f7d74b2d0beb?"
                  className="shrink-0 self-end mt-48 border-2 border-solid aspect-[1.67] border-zinc-800 stroke-[2.38px] stroke-zinc-800 w-[25px] max-md:mt-10"
                />
              </div>
            </div>
            <div className="ml-5" style={{ marginRight: '20px' }}>
              <div className="flex grow gap-2.5 px-7 py-12 w-full font-semibold text-indigo-800 uppercase bg-white rounded-3xl max-md:px-5 max-md:mt-8">
                <div className="flex flex-col">
                  <div className="text-xl leading-5">Scheduling Meetings</div>
                  <div className="mt-14 text-base leading-5 text-zinc-500 max-md:mt-10">
                    Medical sales reps initiate meeting requests, specifying
                    preferred dates and times.
                    <br />
                  </div>
                  <div className="mt-20 text-lg leading-8 max-md:mt-10">
                    Learn more
                  </div>
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1be6014d039f9aa1761f4b32d1fa07a6231828074f9e482813d4f7d74b2d0beb?"
                  className="shrink-0 self-end mt-48 border-2 border-solid aspect-[1.67] border-zinc-800 stroke-[2.38px] stroke-zinc-800 w-[25px] max-md:mt-10"
                />
              </div>
            </div>
            <div className="ml-5" style={{ marginRight: '20px' }}>
              <div className="flex grow gap-2.5 px-7 py-12 w-full font-semibold text-indigo-800 uppercase bg-white rounded-3xl max-md:px-5 max-md:mt-8">
                <div className="flex flex-col">
                  <div className="text-xl leading-5">Scheduling Meetings</div>
                  <div className="mt-14 text-base leading-5 text-zinc-500 max-md:mt-10">
                    Medical sales reps initiate meeting requests, specifying
                    preferred dates and times.
                    <br />
                  </div>
                  <div className="mt-20 text-lg leading-8 max-md:mt-10">
                    Learn more
                  </div>
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1be6014d039f9aa1761f4b32d1fa07a6231828074f9e482813d4f7d74b2d0beb?"
                  className="shrink-0 self-end mt-48 border-2 border-solid aspect-[1.67] border-zinc-800 stroke-[2.38px] stroke-zinc-800 w-[25px] max-md:mt-10"
                />
              </div>
            </div>
            <div className="ml-5" style={{ marginRight: '20px' }}>
              <div className="flex grow gap-2.5 px-7 py-12 w-full font-semibold text-indigo-800 uppercase bg-white rounded-3xl max-md:px-5 max-md:mt-8">
                <div className="flex flex-col">
                  <div className="text-xl leading-5">Scheduling Meetings</div>
                  <div className="mt-14 text-base leading-5 text-zinc-500 max-md:mt-10">
                    Medical sales reps initiate meeting requests, specifying
                    preferred dates and times.
                    <br />
                  </div>
                  <div className="mt-20 text-lg leading-8 max-md:mt-10">
                    Learn more
                  </div>
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1be6014d039f9aa1761f4b32d1fa07a6231828074f9e482813d4f7d74b2d0beb?"
                  className="shrink-0 self-end mt-48 border-2 border-solid aspect-[1.67] border-zinc-800 stroke-[2.38px] stroke-zinc-800 w-[25px] max-md:mt-10"
                />
              </div>
            </div>
            <div className="ml-5" style={{ marginRight: '20px' }}>
              <div className="flex grow gap-2.5 px-7 py-12 w-full font-semibold text-indigo-800 uppercase bg-white rounded-3xl max-md:px-5 max-md:mt-8">
                <div className="flex flex-col">
                  <div className="text-xl leading-5">Scheduling Meetings</div>
                  <div className="mt-14 text-base leading-5 text-zinc-500 max-md:mt-10">
                    Medical sales reps initiate meeting requests, specifying
                    preferred dates and times.
                    <br />
                  </div>
                  <div className="mt-20 text-lg leading-8 max-md:mt-10">
                    Learn more
                  </div>
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1be6014d039f9aa1761f4b32d1fa07a6231828074f9e482813d4f7d74b2d0beb?"
                  className="shrink-0 self-end mt-48 border-2 border-solid aspect-[1.67] border-zinc-800 stroke-[2.38px] stroke-zinc-800 w-[25px] max-md:mt-10"
                />
              </div>
            </div>
            <div className="ml-5" style={{ marginRight: '20px' }}>
              <div className="flex grow gap-2.5 px-7 py-12 w-full font-semibold text-indigo-800 uppercase bg-white rounded-3xl max-md:px-5 max-md:mt-8">
                <div className="flex flex-col">
                  <div className="text-xl leading-5">Scheduling Meetings</div>
                  <div className="mt-14 text-base leading-5 text-zinc-500 max-md:mt-10">
                    Medical sales reps initiate meeting requests, specifying
                    preferred dates and times.
                    <br />
                  </div>
                  <div className="mt-20 text-lg leading-8 max-md:mt-10">
                    Learn more
                  </div>
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1be6014d039f9aa1761f4b32d1fa07a6231828074f9e482813d4f7d74b2d0beb?"
                  className="shrink-0 self-end mt-48 border-2 border-solid aspect-[1.67] border-zinc-800 stroke-[2.38px] stroke-zinc-800 w-[25px] max-md:mt-10"
                />
              </div>
            </div>
            {/* Add more cards here */}
          </Slider>
          <div className="flex z-10 gap-6 justify-between self-end mt-7 mr-44 max-w-full w-[544px] max-md:flex-wrap max-md:mr-2.5">
            <div>
              <button>
                <img src={left} alt="Previous" />
              </button>
              <button>
                <img src={right} alt="Next" />
              </button>
            </div>
          </div>
          <div className="flex gap-5 justify-between items-start mt-6 w-full max-md:flex-wrap max-md:pr-5 max-md:max-w-full">
            <div className="flex gap-5 justify-center items-center self-start px-4 py-6 text-base font-bold text-center text-white uppercase bg-indigo-800 tracking-[2px]">
              <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
              <div className="flex-auto self-stretch">learn more</div>
              <div className="shrink-0 self-stretch my-auto h-px border-t border-white border-solid w-[18px]" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center px-16 py-16 w-full bg-white max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col w-full max-w-[1232px] max-md:max-w-full">
          <div className="self-center text-4xl font-semibold tracking-wider leading-10 text-center text-indigo-800 capitalize">
            Explore Medivirt
          </div>
          <div className="mt-12 max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              {/* Card 1 */}
              <div className="card relative overflow-hidden flex flex-col grow justify-center text-lg font-medium text-center text-white whitespace-nowrap aspect-[0.81] max-md:mt-10 bg-black bg-opacity-20">
                <img loading="lazy" src={marketing} className="object-cover absolute inset-0 w-full h-full" />
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <div className="text-white text-4xl">New Features</div>
                </div>
                {/* Hover Container */}
                <div className="hover-overlay absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 opacity-0 transition-opacity duration-300 pointer-events-none transform translate-y-full flex justify-center items-center">
                  <ul className="list-none ">
                    <li>Dedicated spaces for interactive presentations and discussions between healthcare professionals and companies.​</li>
                    <li>Features enabling live product demonstrations, Q&A sessions, and real-time engagement</li>
                    <li>Mechanisms for collecting and analyzing feedback from participants to enhance user experience and product offerings</li>
                    <li>User-friendly tools for scheduling and managing virtual meetings, ensuring efficient time management.​</li>
                  </ul>
                </div>
              </div>
              {/* Card 2 */}
              <div className="card relative overflow-hidden flex flex-col grow justify-center text-lg font-medium text-center text-white whitespace-nowrap aspect-[0.8] max-md:mt-10 ">
                <img loading="lazy" src={femaledoc} className="object-cover absolute inset-0 w-full h-full" />
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <div className="text-white text-4xl">Explore Doctors</div>
                </div>
                {/* Hover Container */}
                <div className="hover-overlay absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 opacity-0 transition-opacity duration-300 pointer-events-none transform translate-y-full flex justify-center items-center">
                  <ul className="list-none">
                    <li>Doctors receive meeting requests from medical sales reps through the platform.​</li>
                    <li>They can review meeting details, including the product being presented and the agenda.​</li>
                    <li>They can adjust their availability based on their schedule and workload.​Doctors join virtual meetings at the scheduled time through the platform</li>
                    <li>They actively engage in discussions with the medical sales rep, asking questions and providing feedback.​</li>
                    <li>Companies foster ongoing engagement, providing educational resources to support doctors and drive sales growth.​</li>
                  </ul>
                </div>
              </div>
              {/* Card 3 */}
              <div className="card relative overflow-hidden flex flex-col grow justify-center text-lg font-medium text-center text-white whitespace-nowrap aspect-[0.81] max-md:mt-10 ">
                <img loading="lazy" src={onphone} className="object-cover absolute inset-0 w-full h-full bg-black bg-opacity-20" />
                <div className="absolute inset-0 flex flex-col justify-center items-center">
                  <div className="text-white text-4xl">Explore Doctors</div>
                </div>
                {/* Hover Container */}
                <div className="hover-overlay absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 opacity-0 transition-opacity duration-300 pointer-events-none transform translate-y-full flex justify-center items-center">
                  <ul className="list-none">
                    <li>Reach a wider audience of doctors and healthcare professionals, increasing your market reach and engagement.​</li>
                    <li>Save time and resources by conducting virtual presentations, eliminating the need for travel and logistics.​</li>
                    <li> Gather valuable insights and feedback from doctors, helping to improve your products and strategies.​</li>
                    <li>Utilize valuable feedback and insights gathered from your presentations to refine your sales strategies and drive product adoption.​</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee with Images */}
      <div className="flex flex-col items-center px-16 pt-7 pb-12 w-full text-4xl mt-10 font-semibold text-center text-indigo-800 bg-white max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col max-w-full w-[905px]">
          <div className="self-center">Our Partners</div>
          <div className="marquee-container mt-10">
            <Marquee>
              <div className="marquee-item">
                <img src={img1} alt="" className="marquee-image" />
              </div>
              <div className="marquee-item">
                <img src={img2} alt="" className="marquee-image" />
              </div>
              <div className="marquee-item">
                <img src={img3} alt="" className="marquee-image" />
              </div>
              <div className="marquee-item">
                <img src={img4} alt="" className="marquee-image" />
              </div>
            </Marquee>
          </div>
        </div>
      </div>
      <Footer />
    </div >
  );
};



export default Home;