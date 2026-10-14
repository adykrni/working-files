function VisibleCard() {
  return (
    <div className="flex h-[47px] w-[110.5px] shrink-0 flex-col items-center justify-center rounded-[5px] border-[0.64px] border-solid border-[#bdbdbd] bg-[#fcfcfc] p-[13px]">
      <p className="text-center font-radio text-[7px] font-normal leading-[1.4] text-[#171717]">
        Filling the Form UI
        <br />
        (which takes about 5-7 mins)
      </p>
    </div>
  );
}

function HiddenCard({ children }: { children: string }) {
  return (
    <div className="flex h-[47px] w-[95.77px] shrink-0 items-center justify-center rounded-[5px] bg-[#aeb9d0] p-[13px]">
      <p className="whitespace-nowrap font-radio text-[8px] font-normal leading-[15.3px] text-[#171717]">
        {children}
      </p>
    </div>
  );
}

export function ProblemFlow() {
  return (
    <div className="w-full min-w-0 max-w-[700px] overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch]">
      <div
        className="relative h-[243px] w-[700px] bg-white"
        aria-label="One access request took about 30 to 45 minutes — only about 5 minutes were spent filling the form"
      >
        <p className="absolute left-[111px] top-[42px] w-[479px] text-center font-radio text-[14px] font-bold leading-6 text-black">
          One access request took ~30-45mins, only 5 of them were for filling the form.
        </p>

        <div className="absolute left-[69px] top-[82px] flex w-[561px] flex-col gap-[3px] rounded-[6.4px] bg-[#eceff5] p-[13px]">
          <div className="relative h-4 w-full">
            <p className="absolute left-0 top-0 font-radio text-[7px] font-bold leading-[15.3px] text-black">
              THE VISIBLE TASK
            </p>
            <p className="absolute left-[133px] top-0 font-radio text-[7px] font-bold leading-[15.3px] text-black">
              THE HIDDEN TASK
            </p>
          </div>

          <div className="flex items-center gap-[23px]">
            <VisibleCard />
            <div className="flex h-[47px] items-center gap-[6.4px]">
              <HiddenCard>ServiceNow</HiddenCard>
              <HiddenCard>Slack, Emails</HiddenCard>
              <HiddenCard>SAP</HiddenCard>
              <HiddenCard>A colleague</HiddenCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
