import { Heading, Text } from "@diffuse/ui-kit";

type RisksNoticeProps = {
  risks: Array<{
    title: string;
    description: string;
  }>;
};

export function RisksNotice({ risks }: RisksNoticeProps) {
  return (
    <ul className="list-none list-inside space-y-2">
      {risks.map((risk, index) => (
        <li key={index}>
          <Heading level={4} className="inline font-semibold">
            {risk.title}
          </Heading>
          <Text className="inline"> - {risk.description}</Text>
        </li>
      ))}
    </ul>
  );
}
