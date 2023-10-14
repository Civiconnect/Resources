/**
 * This hook can be used to fetch a collection of items from Strapi.
 * @param {string} pluralApiId - The pluralized API ID of the collection (e.g. "articles" for "Article").
 * @param {object} options - An object containing optional parameters.
 * @param {string} options.initialFilter - A filter string (https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication) to be applied to the collection.
 * @param {string} options.initialSort - A sort string (https://docs.strapi.io/dev-docs/api/rest/sort-pagination#sorting) to be applied to the collection.
 * @param {number} options.pageSize - The number of items per page to be returned.
 * @returns {object} - An object containing the collection, loading state, filter, sort, and page.
 */

import { useState, useEffect } from "react";

const useStrapiCollection = (pluralApiId, options) => {
	// defaults
	const initialFilter = options?.initialFilter;
	const initialSort = options?.initialSort;
	const pageSize = options?.pageSize || 25;

	// collection data
	const [collection, setCollection] = useState([]);

	// loading state
	const [loading, setLoading] = useState(true);

	// filtering, sorting, and pagination
	const [filter, setFilter] = useState(initialFilter || "");
	const [sort, setSort] = useState(initialSort || "");
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(null);

	function nextPage() {
		setPage(page + 1);
		fetchCollection();
	}

	// Fetch data from Strapi API (initially and whenever the filter changes)
	async function fetchCollection() {
		setLoading(true);
		// Build URL
		const endpoint = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pluralApiId}?${
			filter && `filters${filter}`
		}${
			sort && `&sort=${sort}`
		}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`;
		const res = await fetch(endpoint);
		if (!res.ok) {
			switch (res.status) {
				case 403:
					throw new Error(`Access forbidden at ${endpoint}`);
					break;
				case 404:
					throw new Error(
						`Could not find collection "${pluralApiId}" at ${endpoint}`
					);
					break;
				case 500:
					throw new Error(`Internal server error at ${endpoint}`);
					break;
				default:
					throw new Error(`${res.status}: ${res.statusText}`);
			}
		}
		const data = await res.json();

		// put "id" inside "attributes" for each item, return as "collection"
		const collection = data.data.map((item) => {
			return {
				id: item.id,
				...item.attributes,
			};
		});

		// set page count
		setPageCount(data.meta.pagination.pageCount);

		setCollection(collection);
		setLoading(false);
	}

	// Fetch data from Strapi API (initially and whenever the filter changes)
	useEffect(() => {
		fetchCollection();
	}, [filter, sort, page]);

	// Return values to be used by the component
	return {
		collection, // array of items
		loading, // loading state
		filter, // filter string (https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication)
		setFilter, // function to set filter string
		sort, // sort string (https://docs.strapi.io/dev-docs/api/rest/sort-pagination#sorting)
		setSort, // function to set sort string
		page, // page number
		setPage, // function to set page number
		pageCount, // total number of pages
	};
};

export default useStrapiCollection;
