import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "@testing-library/jest-dom";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"] });

// Explicitly force tracking on in tests to allow testing of analytics events
process.env.NEXT_PUBLIC_ENABLE_TRACKING = "true";

afterEach(() => cleanup());
