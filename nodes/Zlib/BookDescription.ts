/* eslint-disable n8n-nodes-base/node-param-default-wrong-for-limit */
import type { INodeProperties } from 'n8n-workflow';

export const bookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		default: 'search',
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search book',
			},
			{
				name: 'Download',
				value: 'download',
				action: 'Download book',
			},
		],
		displayOptions: {
			show: {
				resource: ['book'],
			},
		},
	},
];

const currentYear = new Date().getFullYear();

export const bookFields: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'string',
		default: '',
		placeholder: 'Harry Potter',
		description: 'The search query to find books',
		required: true,
		displayOptions: {
			show: {
				resource: ['book'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		description: 'The page number of the search results to retrieve',
		typeOptions: {
			minValue: 1,
			numberPrecision: 0,
		},
		displayOptions: {
			show: {
				resource: ['book'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 10,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
			maxValue: 50,
			numberPrecision: 0,
		},
		displayOptions: {
			show: {
				resource: ['book'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Exact Matching',
		name: 'exactMatch',
		type: 'boolean',
		default: false,
		description: 'Whether to search for an exact match of the search query',
		displayOptions: {
			show: {
				resource: ['book'],
				operation: ['search'],
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['book'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'Extensions',
				name: 'extensions',
				type: 'multiOptions',
				description: 'File extensions to filter the search results by',
				default: [],
				options: [
					{
						name: 'AZW',
						value: 'AZW',
					},
					{
						name: 'AZW3',
						value: 'AZW3',
					},
					{
						name: 'DJV',
						value: 'DJV',
					},
					{
						name: 'DJVU',
						value: 'DJVU',
					},
					{
						name: 'EPUB',
						value: 'EPUB',
					},
					{
						name: 'FB2',
						value: 'FB2',
					},
					{
						name: 'LIT',
						value: 'LIT',
					},
					{
						name: 'MOBI',
						value: 'MOBI',
					},
					{
						name: 'PDF',
						value: 'PDF',
					},
					{
						name: 'RTF',
						value: 'RTF',
					},
					{
						name: 'TXT',
						value: 'TXT',
					},
				],
			},
			{
				displayName: 'Type of Content',
				name: 'types',
				type: 'multiOptions',
				description: 'File types to filter the search results by',
				default: [],
				options: [
					{
						name: 'Articles',
						value: 'article',
					},
					{
						name: 'Books',
						value: 'book',
					},
				],
			},
			{
				displayName: 'Year From',
				name: 'yearFrom',
				type: 'number',
				default: 2000,
				typeOptions: {
					minValue: 1800,
					maxValue: currentYear,
					numberPrecision: 0,
				},
				description: 'The year to filter the search results from',
			},
			{
				displayName: 'Year To',
				name: 'yearTo',
				type: 'number',
				default: currentYear,
				typeOptions: {
					minValue: 1800,
					maxValue: currentYear,
					numberPrecision: 0,
				},
				description: 'The year to filter the search results to',
			},
		],
	},
	{
		displayName: 'Book ID',
		name: 'bookId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['book'],
				operation: ['download'],
			},
		},
	},
	{
		displayName: 'Book Hash ID',
		name: 'bookHashId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['book'],
				operation: ['download'],
			},
		},
	},
];
