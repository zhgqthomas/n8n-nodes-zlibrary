import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';
import { bookFields, bookOperations } from './BookDescription';
import { CREDENTIAL_NAME } from './Constants';
import { zlibApiRequest } from './GenericFunctions';

export class Zlib implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zlib',
		name: 'zlib',
		icon: 'file:../../icons/zlibrary.svg',
		group: ['input'],
		version: [1],
		defaultVersion: 1,
		description: 'Consume Zlib API',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		defaults: {
			name: 'Zlib',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: CREDENTIAL_NAME,
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Book',
						value: 'book',
					},
				],
				default: 'book',
			},
			...bookOperations,
			...bookFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		let responseData;
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				if (resource === 'book') {
					// *********************************************************************
					//                             book
					// *********************************************************************
					if (operation === 'search') {
						// ----------------------------------
						//         book: search
						// ----------------------------------
						const searchQuery = this.getNodeParameter('searchQuery', itemIndex) as string;
						const page = this.getNodeParameter('page', itemIndex) as number;
						const limit = this.getNodeParameter('limit', itemIndex) as number;
						const exactMatch = this.getNodeParameter('exactMatch', itemIndex) as boolean;

						const options = this.getNodeParameter('options', itemIndex, {}) as IDataObject;
						const extensions = (options.extensions as string[]) || undefined;
						const types = (options.types as string[]) || undefined;
						const yearFrom = options.yearFrom as number | undefined;
						const yearTo = options.yearTo as number | undefined;

						const params = new URLSearchParams();
						params.append('message', searchQuery);
						params.append('page', page.toString());
						params.append('limit', limit.toString());

						if (exactMatch) {
							params.append('e', '1');
						}
						if (yearFrom) {
							params.append('yearFrom', yearFrom.toString());
						}
						if (yearTo) {
							params.append('yearTo', yearTo.toString());
						}

						if (extensions?.length) {
							for (const extension of extensions) {
								params.append('extensions[]', extension);
							}
						}

						if (types?.length) {
							for (const type of types) {
								params.append('types[]', type);
							}
						}

						responseData = await zlibApiRequest.call(this, {
							method: 'POST',
							url: '/book/search',
							body: params,
						});

						const executionData = this.helpers.constructExecutionMetaData(
							this.helpers.returnJsonArray(responseData as unknown as IDataObject),
							{ itemData: { item: itemIndex } },
						);
						returnData.push(...executionData);
					} else if (operation === 'download') {
						// ----------------------------------
						//         book: download
						// ----------------------------------
						const bookId = this.getNodeParameter('bookId', itemIndex) as string;
						const bookHashId = this.getNodeParameter('bookHashId', itemIndex) as string;
						const downloadFile = this.getNodeParameter('downloadFile', itemIndex, false) as boolean;

						responseData = await zlibApiRequest.call(this, {
							method: 'GET',
							url: `/book/${bookId}/${bookHashId}/file`,
						});

						if (!downloadFile) {
							// Return download link
							const executionData = this.helpers.constructExecutionMetaData(
								this.helpers.returnJsonArray(responseData as unknown as IDataObject),
								{ itemData: { item: itemIndex } },
							);
							returnData.push(...executionData);
						} else {
							const {
								file: { downloadLink },
							} = responseData;

							if (!downloadLink) {
								throw new NodeApiError(
									this.getNode(),
									{
										message: 'No Download link  for this book',
									},
									{
										itemIndex: itemIndex,
									},
								);
							}

							const binary = await this.helpers.httpRequest.call(this, {
								method: 'GET',
								url: downloadLink,
								encoding: 'arraybuffer',
								json: false,
							});

							const binaryData = await this.helpers.prepareBinaryData(binary);
							const newItem: INodeExecutionData = {
								json: {},
								binary: {
									['data']: binaryData,
								},
								pairedItem: { item: itemIndex },
							};

							returnData.push(newItem);
						}
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: itemIndex,
						},
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, { itemIndex: itemIndex });
			}
		}

		return [returnData];
	}
}
