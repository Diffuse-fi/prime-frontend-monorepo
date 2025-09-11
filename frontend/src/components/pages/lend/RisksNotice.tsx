import { Heading } from "@diffuse/ui-kit";

type RisksNoticeProps = {
  risks: Array<{
    title: string;
    description: string;
  }>;
};

export function RisksNotice({ risks }: RisksNoticeProps) {
  return (
    <ul className="bg-err-light list-inside list-none space-y-2 rounded-sm p-4">
      {risks.map((risk, index) => (
        <li key={index}>
          <Heading level="4" className="text-err font-semibold">
            {risk.title}
          </Heading>
          <p className="inline">{risk.description}</p>
        </li>
      ))}
    </ul>
  );
}
