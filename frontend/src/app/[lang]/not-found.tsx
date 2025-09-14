import { AppLink } from "@/components/misc/AppLink";

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <AppLink href="/">Return Home</AppLink>
    </div>
  );
}
