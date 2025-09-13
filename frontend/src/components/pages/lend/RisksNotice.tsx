import { Heading } from "@diffuse/ui-kit";
import { useTranslations } from "next-intl";

export function RisksNotice() {
  const t = useTranslations("lend");
  const risks = t.raw("risks") as { title: string; description: string }[];

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
