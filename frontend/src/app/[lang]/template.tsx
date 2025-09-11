import { ConnectionStatusTracker } from "@/components/misc/ConnectionStatusTracker";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConnectionStatusTracker />
      {children}
    </>
  );
}
