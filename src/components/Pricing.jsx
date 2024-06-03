import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sliderimg from '../assets/img/Slider-img.jpg'

const Pricing = () => {
  const handleSubmit = () => {
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Construct mailto link
    const mailtoLink = `mailto:meet@medivirt.com?subject=Inquiry&body=Name: ${name}%0D%0AEmail: ${email}%0D%0AMessage: ${message}`;

    // Redirect user to mail client
    window.location.href = mailtoLink;
  };

  return (
    <>
      <Header />
      <div
        className="relative mt-[40px]"
        style={{
          backgroundImage: `url(${Sliderimg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '170px', // Set the height of the banner 
        }}
      >
        <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-[#3d52a1] text-[3rem] font-bold font-sans">
        PRICING & PLANS
        </h2>
      </div>
      <section className="bg-white py-5">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="mt-10 text-4xl font-semibold text-center capitalize leading-[54px] text-black max-md:mt-10 max-md:max-w-full">
            Choose your package and get started - <br />
            it's that easy!
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:mt-[4rem] mb-6 max-w-8xl mx-auto">
            {/* Pricing plan cards */}
            <div className="flex flex-col border px-10 py-12 mt-4 text-base bg-white rounded-xl shadow-sm max-w-[329px] text-black">
              <div className="text-4xl font-bold font-[K2D] text-indigo-500">STARTUP</div>
              <div className="mt-4 leading-5 capitalize">
                FOR EARLY STARTUPS - <br/><p className='font-bold'>5 CREDITS</p>
              </div>
              <div className="mt-[1rem] text-4xl font-bold font-[K2D] leading-10 text-indigo-400">
                Rs. 1999/-
              </div>
              <div className="flex gap-0.5 mt-11 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a8ad9021fae7e51cedcbe04535fac7a9921c6dcc92c70a937280f40018d688f3?"
                  className="shrink-0 self-start aspect-[0.9] w-[18px]"
                />
                <div>Each credit is valid for 15 minutes</div>
              </div>
              <div className="flex gap-0.5 mt-6 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a8ad9021fae7e51cedcbe04535fac7a9921c6dcc92c70a937280f40018d688f3?"
                  className="shrink-0 self-start aspect-[0.9] w-[18px]"
                />
                <div>validity is 3 months and 1 domestic cities</div>
              </div>
              <div className="flex gap-0.5 mt-6 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto my-auto">100 % refundable</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">support 24X7</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 self-start aspect-[0.9] w-[18px]"
                />
                <div>recommendation slip from doctor</div>
              </div>
              <div className="flex gap-0.5 mt-6 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">no recording available</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">only domestic</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">setup fee : rs. 3999/- </div>
              </div>
              <div className="flex flex-col  mt-[3.8rem] ml-3 text-lg font-semibold text-center text-white capitalize bg-indigo-800">
                <button className="text-center px-12 py-3.5 bg-indigo-400 hover:bg-indigo-500 transition-all duration-300 ease-in-out">
                  Buy Now
                </button>
              </div>
            </div>
            <div className="flex flex-col border mt-4 px-10 py-12 text-base bg-white rounded-xl shadow-sm max-w-[329px] ">
              <div className="text-4xl font-bold font-[K2D]  text-indigo-500">STANDARD</div>
              <div className="mt-4 leading-5 capitalize">
              FOR ESTABLISHED STARTUPS - <p className='font-bold'>15 CREDITS</p>
              </div>
              <div className="mt-4 text-4xl font-bold font-[K2D]  leading-10 text-indigo-400">
                Rs. 4499/-
              </div>
              <div className="flex gap-0.5 mt-11 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a8ad9021fae7e51cedcbe04535fac7a9921c6dcc92c70a937280f40018d688f3?"
                  className="shrink-0 self-start aspect-[0.9] w-[18px]"
                />
                <div>Each credit is valid for 15 minutes</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a8ad9021fae7e51cedcbe04535fac7a9921c6dcc92c70a937280f40018d688f3?"
                  className="shrink-0 self-start aspect-[0.9] w-[18px]"
                />
                <div>Validity is 12 months and 3 cities</div>
              </div>
              <div className="flex gap-0.5 mt-6 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto my-auto">100 % refundable</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">support 24X7</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 self-start aspect-[0.9] w-[18px]"
                />
                <div>Recommendation slip from doctor.</div>
              </div>
              <div className="flex gap-0.5 mt-6 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">Recording available.</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">Only Domestic </div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">setup fee : rs. 2999/- </div>
              </div>
              <div className="flex flex-col  mt-[3.9rem] ml-3 text-lg font-semibold text-center text-white capitalize bg-indigo-800">
                <button className="text-center px-12 py-3.5 bg-indigo-400 hover:bg-indigo-500 transition-all duration-300 ease-in-out">
                  Buy Now
                </button>
              </div>
            </div>
            <div className="flex flex-col border px-10 py-12 text-base bg-[#F9EDEF] rounded-xl shadow-sm max-w-[329px] mb-[2rem]"> {/* Add custom class and margin-top */}
              <div className="text-4xl font-bold font-[K2D]  text-indigo-500">ECONOMY</div>
              <div className="mt-4 leading-5 capitalize">
              FOR ESTABLISED COMPANIES - <p className='font-bold'>25 CREDITS</p>
              </div>
              <div className="mt-4 text-4xl font-bold font-[K2D]  leading-10 text-indigo-400">
              Rs. 6999/-
              </div>
              <div className="flex gap-0.5 mt-11 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a8ad9021fae7e51cedcbe04535fac7a9921c6dcc92c70a937280f40018d688f3?"
                  className="shrink-0 self-start aspect-[0.9] w-[18px]"
                />
                <div>Each credit is valid for 15 minutes</div>
              </div>
              <div className="flex gap-0.5 mt-6 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a8ad9021fae7e51cedcbe04535fac7a9921c6dcc92c70a937280f40018d688f3?"
                  className="shrink-0 self-start aspect-[0.9] w-[18px]"
                />
                <div>Validity is unlimited and all domestic cities.</div>
              </div>
              <div className="flex gap-0.5 mt-6 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto my-auto">100 % refundable</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">Support 24X7</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 self-start aspect-[0.9] w-[18px]"
                />
                <div>Recommendation slip from doctor</div>
              </div>
              <div className="flex gap-0.5 mt-6 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">Recording available</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">Only Domestic </div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">setup fee : rs. 1999/- </div>
              </div>
              <div className="flex flex-col  mt-[3.9rem] ml-3 text-lg font-semibold text-center text-white capitalize bg-indigo-800">
                <button className="text-center px-12 py-3.5 bg-indigo-400 hover:bg-indigo-500 transition-all duration-300 ease-in-out">
                  Buy Now
                </button>
              </div>
            </div>
            <div className="flex flex-col border  px-10 py-12 mt-4 text-base bg-white rounded-xl shadow-sm max-w-[329px] ">
              <div className="text-4xl font-bold font-[K2D]  text-indigo-500">ADVANCE</div>
              <div className="mt-4 leading-5 capitalize">
              FOR ESTABLISED COMPANIES - <p className='font-bold'>40 CREDITS</p>
              </div>
              <div className="mt-4 text-4xl font-bold font-[K2D]  leading-10 text-indigo-400">
                Rs. 9999/-
              </div>
              <div className="flex gap-0.5 mt-11 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a8ad9021fae7e51cedcbe04535fac7a9921c6dcc92c70a937280f40018d688f3?"
                  className="shrink-0 self-start aspect-[0.9] w-[18px]"
                />
                <div>Each credit is valid for 15 minutes</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/a8ad9021fae7e51cedcbe04535fac7a9921c6dcc92c70a937280f40018d688f3?"
                  className="shrink-0 self-start aspect-[0.9] w-[18px]"
                />
                <div>Validity is unlimited and all domestic cities</div>
              </div>
              <div className="flex gap-0.5 mt-6 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto my-auto">100 % refundable</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">Support 24X7</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 self-start aspect-[0.9] w-[18px]"
                />
                <div>Recommendation slip from doctor</div>
              </div>
              <div className="flex gap-0.5 mt-6 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto"> Recording available</div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">Only Domestic </div>
              </div>
              <div className="flex gap-0.5 mt-5 capitalize">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b598b7ae22dae37d5a9b4f3178e203023cd8cb8a8b980b0f542c420f7629a8ac?"
                  className="shrink-0 aspect-[0.9] w-[18px]"
                />
                <div className="flex-auto">setup fee : rs. 999/- </div>
              </div>
              <div className="flex flex-col  mt-[3.9rem] ml-3 text-lg font-semibold text-center text-white capitalize bg-indigo-800">
                <button className="text-center px-12 py-3.5 bg-indigo-400 hover:bg-indigo-500 transition-all duration-300 ease-in-out">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/*Custom*/}
        <div className="flex flex-col m-5 justify-center items-center md:flex-row md:gap-5">
          <div className="flex flex-col border border-gray-200 shadow-lg md:flex-row md:gap-6">
            <div className="flex flex-col mt-6 w-full md:w-[60%]">
              <div className="flex flex-col grow px-6 py-1 md:ml-0">
                <div className="text-4xl leading-9 text-zinc-500">
                  Find the pricing plan that suits
                  <br />
                  your needs.
                </div>
                <div className="flex flex-col px-16 py-7 mt-20 text-white bg-[#3D52A1]">
                  <div className="mt-16 text-4xl leading-9 uppercase">
                    Flexible options
                    <br />
                    ensure cost-efficient
                    <br />
                    operations
                  </div>
                  <div className="mt-5 mb-12 text-base leading-6">
                    Uncover the ideal pricing plan to supercharge your <br />
                    sales journey with medivirt. Tailored to your<br />
                    needs, our flexible options ensure cost-efficient <br /> operations
                    without compromising on performance.<br/> For more information email us at : <p className=' font-bold'>meet@medivirt.com </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-0 md:ml-5 w-full mt-6 md:w-6/12">
              <div className="flex flex-col grow px-5 py-1 text-base font-semibold leading-5 text-zinc-500">
                <div className="self-center font-bold text-center text-indigo-800 uppercase tracking-[2.24px]">
                  Let's Talk
                </div>
                <div className="self-center mt-5 text-4xl text-center leading-[54px]">
                  How can we help you?
                </div>
                <div className="mt-8">Your Name</div>
                <input
                  type="text"
                  id="name"
                  className="shrink-0 mt-1 pl-4 bg-white rounded-xl border border-gray-200 border-solid h-[49px]"
                />
                <div className="mt-6">Your Work Email</div>
                <input
                  type="email"
                  id="email"
                  className="shrink-0 mt-1 pl-4 bg-white rounded-xl border border-gray-200 border-solid h-[49px]"
                />
                <div className="mt-6">Your message (optional)</div>
                <textarea
                  id="message"
                  className="shrink-0 pl-4 bg-white rounded-xl border border-gray-200 border-solid h-[238px]"
                ></textarea>
                <div
                  className="justify-center items-center px-16 py-6 mt-4 font-bold text-center text-white uppercase whitespace-nowrap bg-[#3D52A1] hover:bg-indigo-500 tracking-[2px] w-[213px] md:px-5 cursor-pointer transition-all duration-300 ease-in-out"
                  onClick={handleSubmit}
                >
                  SUBMIT
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Pricing;