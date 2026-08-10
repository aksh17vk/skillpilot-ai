import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion-primitives";

const faqs = [
  {
    q: "Is SkillPilot AI free to start?",
    a: "Yes. The Pilot plan includes resume analysis, ATS scoring and one active roadmap — no card required.",
  },
  {
    q: "How accurate is the ATS score?",
    a: "We model parsing behaviour across the most common applicant tracking systems and benchmark against real job descriptions, reaching around 95% agreement in our internal evaluations.",
  },
  {
    q: "What file formats can I upload?",
    a: "PDF and DOCX up to 10 MB. We extract structure, sections, dates, skills and impact statements.",
  },
  {
    q: "Do the roadmaps adapt to my target role?",
    a: "Every roadmap is generated from the gap between your resume and the specific job description you paste, then re-planned as you complete assessments.",
  },
  {
    q: "Is my resume data private?",
    a: "Your documents are yours. They are used only to generate your analysis and can be deleted permanently from Settings at any time.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-28 px-5 py-20">
      <Reveal className="text-center">
        <span className="text-xs font-medium tracking-[0.2em] text-accent uppercase">FAQ</span>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Questions, <span className="text-gradient">answered</span>
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`i${i}`}
              className="surface-card border-b-0 px-5 data-[state=open]:border-primary/50"
            >
              <AccordionTrigger className="text-left text-base hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </section>
  );
}
