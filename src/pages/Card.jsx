const Card = () => {
    return (
      <div className="flex-1 rounded-2xl bg-light-text-color flex flex-col items-start justify-start pt-[43px] px-[25px] pb-[35px] box-border gap-[46px] min-w-[299px] max-w-full text-left text-mid text-darkslateblue-100 font-quicksand mq450:gap-[23px]">
        <div className="self-stretch flex flex-col items-start justify-start gap-[24px] text-2xl">
          <h3 className="m-0 self-stretch relative text-inherit leading-[21px] uppercase font-semibold font-inherit mq450:text-mid mq450:leading-[17px]">
            User Registration and Profile Creation
          </h3>
          <div className="self-stretch relative text-base leading-[21px] uppercase text-dimgray-200">
            <p className="m-0">
              Users (medical sales reps and doctors) register on the platform by
              providing necessary information.
            </p>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-between gap-[20px]">
          <div className="relative leading-[34px] uppercase font-semibold inline-block min-w-[109px] whitespace-nowrap">
            Learn more
          </div>
          <div className="flex flex-col items-start justify-start pt-2.5 px-0 pb-0">
            <img
              className="w-[22.7px] h-[13.3px] relative object-contain"
              loading="lazy"
              alt=""
              src="/pointer.svg"
            />
          </div>
        </div>
        <div className="self-stretch h-0 relative leading-[21px] uppercase text-black hidden">
          <p className="m-0">
            Users (medical sales reps and doctors) register on the platform by
            providing necessary information.
          </p>
        </div>
      </div>
    );
  };
  
  export default Card;
  