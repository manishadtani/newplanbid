export function parseFiltersFromURL(searchParams) {

  const parseLocationFromURL = () => {
    const entityTypes = searchParams.getAll("entity_type").join(',').split(',').filter(Boolean);
    const states = searchParams.getAll("state").join(',').split(',').filter(Boolean);
    const local = searchParams.getAll("local").join(',').split(',').filter(Boolean);

    return {
      federal: entityTypes.includes('Federal'),
      states: states,
      local: local
    };
  };


  const filters = {
    status: searchParams.get("status") || "",
    location: parseLocationFromURL(),
    NAICSCode: searchParams.getAll("NAICSCode"),
    UNSPSCCode: searchParams.getAll("UNSPSCCode"),
    solicitationType: searchParams.getAll("solicitationType"),
    keyword: {
      include: searchParams.getAll("keywordInclude"),
      exclude: searchParams.getAll("keywordExclude"),
    },
    publishedDate: {
      type: searchParams.get("publishedType") || "",
      within: searchParams.get("publishedWithin") || "",
      date: searchParams.get("publishedDate") || "",
      from: searchParams.get("publishedFrom") || "",
      to: searchParams.get("publishedTo") || "",
      after: searchParams.get("publishedAfter") || "",
      before: searchParams.get("publishedBefore") || "",
    },
    closingDate: {
      type: searchParams.get("closingType") || "",
      within: searchParams.get("closingWithin") || "",
      date: searchParams.get("closingDate") || "",
      from: searchParams.get("closingFrom") || "",
      to: searchParams.get("closingTo") || "",
      after: searchParams.get("closingAfter") || "",
      before: searchParams.get("closingBefore") || "",
    },
  };

  return filters;
}
