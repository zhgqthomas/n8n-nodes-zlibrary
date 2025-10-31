import {
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
} from 'n8n-workflow';
import { CREDENTIAL_NAME } from './Constants';

async function zlibApiRequestWithAuthentication(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	options: IHttpRequestOptions,
	clearCookies = false,
) {
	const credentials = await this.getCredentials(CREDENTIAL_NAME);
	options.baseURL = credentials?.baseUrl as string;

	const additionalCredentialOptions = {
		credentialsDecrypted: {
			id: CREDENTIAL_NAME,
			name: CREDENTIAL_NAME,
			type: CREDENTIAL_NAME,
			data: {
				...credentials,
				cookie: clearCookies ? '' : credentials.cookie,
			},
		},
	};

	return this.helpers.httpRequestWithAuthentication.call(
		this,
		CREDENTIAL_NAME,
		options,
		additionalCredentialOptions,
	);
}

export async function zlibApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	options: IHttpRequestOptions,
) {
	return zlibApiRequestWithAuthentication.call(this, options);
}
