// Bu kod, URL'deki arama gibi bir kelimeyi alıp kullanmamıza ve değiştirmemize yarar.
//bu kod sayeinde girilen kelimeyi arayabiliriz.

import { parseAsString, useQueryState } from "nuqs";

export function useSearchParam() {
    return useQueryState(
        "search",
        parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    );
};
