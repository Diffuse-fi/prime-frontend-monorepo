import isNil from "lodash/isNil";
import omitBy from "lodash/omitBy";
import { useSearchParams } from "next/navigation";
import qs from "qs";
import { useMemo } from "react";

import { usePathname, useRouter } from "../localization/navigation";

export function useQueryWriter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryObj = useMemo(() => qs.parse(searchParams.toString()), [searchParams]);

  function setQuery(next: Record<string, unknown>, opts?: { replace?: boolean }) {
    const merged = { ...queryObj, ...next };

    const cleanedMerged = cleanUpObj(merged);

    const q = qs.stringify(cleanedMerged, {
      addQueryPrefix: true,
      arrayFormat: "comma",
      encodeValuesOnly: true,
      sort: (a, b) => a.localeCompare(b),
    });

    const url = `${pathname}${q}`;
    if (opts?.replace) {
      router.replace(url, { scroll: false });
    } else {
      router.push(url, { scroll: false });
    }
  }

  return { queryObj, searchParams, setQuery };
}

function cleanUpObj(query: Record<string, unknown>) {
  return omitBy(query, isNil);
}
