import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
} from 'n8n-workflow';
import { CREDENTIAL_NAME, DEFAULT_HEADER } from '../nodes/Zlib/Constants';

export class ZlibApi implements ICredentialType {
	name = CREDENTIAL_NAME;

	displayName = 'Zlib API';

	icon: Icon = 'file:../icons/zlibrary.svg';

	documentationUrl = 'https://github.com/zhgqthomas/n8n-nodes-zlibrary';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'url',
			type: 'options',
			options: [
				{
					name: 'https://z-library.sk/eapi',
					value: 'https://z-library.sk/eapi',
				},
				{
					name: 'https://zh.z-library.sk/eapi',
					value: 'https://zh.z-library.sk/eapi',
				},
				{
					name: 'Custom URL',
					value: 'custom',
				},
			],
			default: [],
			required: true,
		},
		{
			displayName: 'Custom URL',
			name: 'customUrl',
			type: 'string',
			default: '',
			placeholder: 'https://z-library.sk/eapi',
			displayOptions: {
				show: {
					url: ['custom'],
				},
			},
		},
		{
			displayName: 'URL',
			name: 'baseUrl',
			type: 'hidden',
			default: '={{$self["url"] === "custom" ? $self["customUrl"] : $self["url"]}}',
		},
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName: 'Cookie',
			name: 'cookie',
			type: 'hidden',
			typeOptions: {
				expirable: true,
			},
			default: '',
		},
	];

	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		const params = new URLSearchParams();
		params.append('email', credentials.email as string);
		params.append('password', credentials.password as string);

		const {
			user: { id, remix_userkey },
		} = await this.helpers.httpRequest({
			method: 'POST',
			url: `${credentials.baseUrl}/user/login`,
			headers: {
				...DEFAULT_HEADER,
			},
			body: params,
		});

		const cookie = `remix_userkey=${remix_userkey}; remix_userid=${id}; siteLanguageV2=cn;`;

		return { cookie };
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Cookie: '={{$credentials.cookie}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{ $credentials.baseUrl }}',
			url: '/user/profile',
			method: 'GET',
		},
	};
}
