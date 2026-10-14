import Image from "next/image";

function Arrow({ size }: { size: number }) {
  return (
    <div className="relative shrink-0 overflow-hidden" style={{ width: size, height: size }}>
      <Image
        src="/icons/loryn-arrow-right.svg"
        alt=""
        width={size}
        height={size}
        className="size-full"
        aria-hidden
      />
    </div>
  );
}

function Card({
  children,
  width,
  align = "center",
}: {
  children: React.ReactNode;
  width: number;
  align?: "center" | "start";
}) {
  return (
    <div
      className={`flex h-[40px] shrink-0 flex-col rounded-[3.5px] border-[0.36px] border-solid border-[#bdbdbd] bg-[#fcfcfc] p-[7px] ${
        align === "center" ? "items-center justify-center" : "items-start"
      }`}
      style={{ width }}
    >
      {children}
    </div>
  );
}

function CardText({ children, nowrap = false }: { children: React.ReactNode; nowrap?: boolean }) {
  return (
    <p
      className={`w-full font-radio text-[7px] font-normal leading-[1.4] text-[#171717] ${
        nowrap ? "whitespace-nowrap" : ""
      }`}
    >
      {children}
    </p>
  );
}

export function UseCaseFlow() {
  return (
    <div className="w-full min-w-0 max-w-[700px] overflow-x-auto overflow-y-hidden [-webkit-overflow-scrolling:touch]">
      <div
        className="relative h-[300px] w-[700px] bg-white"
        aria-label="SAP access request use case — before versus with Loryn"
      >
        <div className="absolute left-[93px] top-[51px] flex flex-col items-start justify-center gap-[7px] rounded-[3.5px] bg-[#eceff5] p-[7px]">
          <p className="font-radio text-[8px] font-bold leading-[8.5px] text-black">BEFORE</p>
          <div className="flex items-center gap-[13px]">
            <Card width={120}>
              <CardText nowrap>User needs access to SAP systems.</CardText>
            </Card>
            <Arrow size={6.43} />
            <Card width={100}>
              <CardText>Users arrive at the company&apos;s employee center and navigate to the form</CardText>
            </Card>
            <Arrow size={6.43} />
            <Card width={100}>
              <CardText>Traditional form with multiple fields needs to be filled in by the user</CardText>
            </Card>
            <Arrow size={6.43} />
            <Card width={100} align="start">
              <CardText>
                User fills the forms, and submits the request which lives in the employee center.
              </CardText>
            </Card>
          </div>
        </div>

        <div className="absolute left-[355px] top-[142px] rotate-90">
          <Arrow size={8.57} />
        </div>

        <div className="absolute left-5 top-[174px] flex flex-col items-start justify-center gap-3 rounded-[3.5px] bg-[#eceff5] p-[7px]">
          <p className="font-radio text-[8px] font-bold leading-[8.5px] text-black">WITH LORYN</p>
          <div className="flex items-center gap-3">
            <Card width={120}>
              <div className="flex w-full items-center gap-[4px]">
                <div className="min-w-0 rounded-tl-[5px] rounded-tr-[0.7px] rounded-br-[5px] rounded-bl-[5px] bg-[#f5f5f5] px-[3.5px] py-[3.5px]">
                  <p className="whitespace-nowrap font-radio text-[7px] font-normal leading-[1.4] text-[#171717]">
                    I need access to SAP system
                  </p>
                </div>
                <div className="relative size-[8.57px] shrink-0 overflow-hidden">
                  <Image
                    src="/icons/loryn-circle-user.svg"
                    alt=""
                    width={9}
                    height={9}
                    className="size-full"
                    aria-hidden
                  />
                </div>
              </div>
            </Card>
            <Arrow size={6.43} />
            <Card width={100}>
              <CardText>Loryn pulls data from the ServiceNow / SAP database</CardText>
            </Card>
            <Arrow size={6.43} />
            <Card width={100}>
              <CardText>
                Chat + Form Panel side by side
                <br />
                Form arrives prefilled
              </CardText>
            </Card>
            <Arrow size={6.43} />
            <Card width={100}>
              <CardText>
                Every prefilled field stays editable (User reviews, corrects, submits)
              </CardText>
            </Card>
            <Arrow size={6.43} />
            <Card width={100} align="start">
              <CardText>Confirmation links back to ServiceNow/SAP — system of record</CardText>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
