import { CaseStudyImage } from "@/components/CaseStudyImage";
import { CaseStudyVideo } from "@/components/CaseStudyVideo";
import { BlockBody, BlockHeading } from "@/components/loryn-next/blocks";
import { ProblemFlow } from "@/components/loryn-next/ProblemFlow";

function StoryText({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full max-w-[700px] flex-col gap-[30px]">{children}</div>;
}

function StorySection({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-w-0 max-w-[900px] flex-col items-center gap-[30px]">
      {children}
    </div>
  );
}

export function AgenticWorkflowsStory() {
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-16">
      <StorySection>
        <StoryText>
          <BlockHeading>The reframe: It was never a form problem</BlockHeading>
          <BlockBody>
            The brief arrived in a typical manner — the SAP access request takes 30+ minutes, so build
            a shorter, smarter form. When I looked at where the time actually went, filling in the
            form only ever took about five minutes.
          </BlockBody>
          <BlockBody>
            The other 30+ minutes went into finding the correct information to fill it in —
            employees pinging
            Slack, chasing email threads, and asking colleagues across time zones to work out which
            system, role, or company code they were even supposed to select. The actual target was
            the information hunt, and that changed what we were building. The ticket data showed the
            same problem from the IT side. When someone asks for access, their ticket usually goes
            to the wrong team first. That happens because people don&apos;t know what to ask for. So
            they guess, and IT spends time sorting out the mess.
          </BlockBody>
          <ProblemFlow />
          <BlockBody>
            Making the form shorter would have saved five minutes out of thirty. The real problem
            was everything that happened before the form — finding out what to ask for in the first
            place.
          </BlockBody>
        </StoryText>
      </StorySection>

      <StorySection>
        <StoryText>
          <BlockHeading>What shipped first, and what it taught us</BlockHeading>
          <BlockBody>
            The first release was a pure conversational agent — ask in plain language, the assistant
            handles the rest. I&apos;d argued against that approach from the start and I lost that
            round. It shipped, and user frustration was high.
          </BlockBody>
          <BlockBody>
            I built the alternative as a working prototype in parallel while the conversational
            version went out. The reason turned out to be structural — access requests are
            consequential and auditable, and a chat transcript gives you no way to check at a glance
            what you&apos;re about to input. People couldn&apos;t verify what they were approving.
            That was information no amount of argument in a meeting would have produced — the
            release settled a question we couldn&apos;t settle in the abstract, and it settled it
            against the approach the team had backed.
          </BlockBody>
        </StoryText>
        <CaseStudyVideo
          src="/images/7.mp4"
          ariaLabel="Working prototype of the Chat + Form Panel pattern, built in parallel with the conversational release"
        />
      </StorySection>

      <StorySection>
        <StoryText>
          <BlockHeading>The Form Panel pattern</BlockHeading>
          <BlockBody>
            I built the alternative as a working prototype in parallel while the conversational
            version went out, and this became the second release.
          </BlockBody>
        </StoryText>
        <CaseStudyVideo
          src="/images/5.mp4"
          ariaLabel="SAP access request flow using the Loryn Form Panel beside the chat"
        />
        <StoryText>
          <BlockBody>
            The Form Panel pairs the conversational surface with a structured, editable form beside
            it: chat does the information-hunting, the panel holds the truth the human signs off on.
          </BlockBody>
          <div className="flex w-full flex-col gap-0 text-base font-normal leading-[1.4] text-muted">
            <BlockBody>
              Every prefilled field stays editable, the human submits, and the request lands in
              ServiceNow as the system of record with a confirmation link back to it. Three major
              decisions carried the weight.
            </BlockBody>
            <ul className="list-disc pl-6">
              <li>
                First, prefill but never auto-submit — the agent prepares, the human retains
                authority. That&apos;s deliberate friction, and it&apos;s the difference between
                speed and silent errors in a workflow that gets audited.
              </li>
              <li>
                Second, the panel renders from ServiceNow&apos;s own variable schema, so it became
                easy to scale it across the entire catalog (29 forms).
              </li>
            </ul>
          </div>
        </StoryText>
        <CaseStudyImage
          src="/images/DesignDecision.png"
          alt="Design decisions for the Form Panel — prefill-not-submit, panel beside chat, and honest failure states"
          aspectRatio="3112/2004"
        />
      </StorySection>

      <StorySection>
        <StoryText>
          <BlockHeading>What I&apos;m currently working on</BlockHeading>
          <BlockBody>
            I&apos;m designing the approval experience that lets line managers handle their
            approval queues directly inside Loryn, without switching between systems. The idea is
            that Loryn analyses each request before the manager even opens the ticket / request,
            which means checking compliance, verifying budgets, cross-referencing status, and
            shows a recommendation alongside each item. Managers can approve an individual item,
            or multiple in one clean action. Escalated items are flagged by Loryn beforehand and
            suggest the next action to the manager. Every action Loryn takes on a manager&apos;s
            behalf is logged with a reasoning trail, which can be checked anytime, and is
            reversible within a 12h window.
          </BlockBody>
          <BlockBody>
            The broader vision is to shift the approval experience from passive notification /
            email inbox into an intelligent system, where routine decisions are handled
            automatically under delegation rules, and human judgement is kept for the cases that
            genuinely need it.
          </BlockBody>
        </StoryText>
        <CaseStudyVideo
          src="/images/Dashboard-v1.mp4"
          ariaLabel="Loryn manager approval dashboard — analysing requests and recommending actions"
        />
      </StorySection>

      <StorySection>
        <StoryText>
          <BlockHeading>Impact, and what I&apos;d measure next</BlockHeading>
          <BlockBody>
            The clearest outcome was my design influence — the pattern replaced the shipped
            approach: the product team changed its interaction architecture on the strength of a
            prototype and the user response to the first release.
          </BlockBody>
          <p className="text-base font-bold leading-[1.4] text-muted">
            Loryn now reaches around 11k employees across Europe, North America, AMEA and LATAM. On
            the operational side, monthly IT ticket volume in the six months after the March 2026
            release averaged around 23% lower than in the 5 months before, with the categories we
            designed for.
          </p>
          <BlockBody>
            What&apos;s not working is that about one in six people still give up and ask a human
            agent instead. I think better error messages and clearer confidence signals on the form
            panel fields would fix that. The thing I&apos;d measure next is how often people change
            what the AI filled in. If nobody edits anything, it could mean the AI is always right
            (which is not going to be the case) or it could mean nobody is bothering to check and I
            would look at the rejection rate of the requests. If people aren&apos;t editing and
            nothing gets rejected, the AI is doing well. If people aren&apos;t editing and things
            are getting rejected, they&apos;re just clicking approve without reading.
          </BlockBody>
        </StoryText>
      </StorySection>
    </div>
  );
}
