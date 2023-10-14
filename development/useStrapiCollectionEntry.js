import { useState, useEffect } from "react";

const useStrapiCollectionEntry = (pluralApiId, entryId) => {

    if (!pluralApiId) {
        // throw error if no pluralApiId is provided
        throw new Error("useStrapiCollectionEntry requires a pluralApiId");
    }

	if (!entryId) {
		// throw error if no entryId is provided
		throw new Error("useStrapiCollectionEntry requires an entryId");
	}

	// collection data
	const [entry, setEntry] = useState(null);

	// Fetch data from Strapi API (initially and whenever the filter changes)
	async function fetchCollectionEntry() {
		// Build URL
		const endpoint = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pluralApiId}/${entryId}?populate=*`;
		const res = await fetch(endpoint);
		if (!res.ok) {
            switch (res.status) {
                case 403:
                    throw new Error(`Access forbidden at ${endpoint}`);
                case 404:
                    throw new Error(`Could not find item with ID "${entryId}" on collection "${pluralApiId}" at ${endpoint}`);
                case 500:
                    throw new Error(`Internal server error at ${endpoint}`);
                default:
                    throw new Error(`${res.status}: ${res.statusText}`);
            }
        }
		const data = await res.json();

        const entry = {
            id: data.data.id,
            ...data.data.attributes
        };

		setEntry(entry);
	}

	// Fetch data from Strapi API (initially and whenever the filter changes)
	useEffect(() => {
        fetchCollectionEntry();
    }, [entryId]);
        

	// Return values to be used by the component
	return entry;
};

export default useStrapiCollectionEntry;
