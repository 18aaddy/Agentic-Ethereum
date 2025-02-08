import react from "react";

export default function Game() {
  return (
    <div className="grow shrink basis-0 flex-col justify-start items-start gap-[13.44px] inline-flex">
      <div className="self-stretch h-[266.81px] bg-[#707070] rounded-[10.56px]" />
      <div className="self-stretch h-[112.39px] flex-col justify-start items-start gap-[18.24px] flex">
        <div className="self-stretch h-[75.16px] flex-col justify-start items-start gap-[8.64px] flex">
          <div className="self-stretch text-[#ffffff] text-[13.44px] font-medium font-['Inter'] leading-none tracking-tight">
            Base Game
          </div>
          <div className="self-stretch h-[49.52px] flex-col justify-start items-start flex">
            <div className="self-stretch text-[#ffffff] text-18 font-semibold font-['Inter'] leading-[23.03px]">
              FINAL FANTASY VII
            </div>
            <div className="justify-center items-center gap-[2.5px] inline-flex">
              <div className="text-[#ffffff] text-18 font-semibold font-['Inter'] leading-[23.03px]">
                REBIRTH
              </div>
              <div className="px-2 py-1 bg-[#d9d9d9]/10 rounded-lg justify-center items-center gap-[2.5px] flex">
                <div className="text-[#ffffff] text-[15.15px] font-normal font-['Inter'] capitalize">
                  ongoing
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch text-[#ffffff] text-base font-medium font-['Inter'] leading-[18.45px] tracking-tight">
          $4,799
        </div>
      </div>
    </div>
  );
}
