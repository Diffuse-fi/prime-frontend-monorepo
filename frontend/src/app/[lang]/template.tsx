import { ConnectionStatusTracker } from "@/components/misc/ConnectionStatusTracker";
import { ValidateClientEnvHelper } from "@/components/misc/ValidateClientEnvHelper";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ValidateClientEnvHelper />
      <ConnectionStatusTracker />
      {children}
    </>
  );
}
