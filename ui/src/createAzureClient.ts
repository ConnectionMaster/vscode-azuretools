/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ServiceClient } from '@azure/core-http';
import { Environment } from '@azure/ms-rest-azure-env';
import * as vscode from "vscode";
import * as types from '../index';
import { appendExtensionUserAgent } from "./extensionUserAgent";

export function createAzureClient<T>(
    clientInfo: { credentials: types.AzExtServiceClientCredentials; subscriptionId: string; environment: Environment; },
    clientType: new (credentials: types.AzExtServiceClientCredentials, subscriptionId: string, options?: types.IMinimumServiceClientOptions) => T): T {
    return new clientType(clientInfo.credentials, clientInfo.subscriptionId, {
        acceptLanguage: vscode.env.language,
        baseUri: clientInfo.environment.resourceManagerEndpointUrl,
        userAgent: appendExtensionUserAgent
    });
}

export function createAzureSubscriptionClient<T>(
    clientInfo: { credentials: types.AzExtServiceClientCredentials; environment: Environment; },
    clientType: new (credentials: types.AzExtServiceClientCredentials, options?: types.IMinimumServiceClientOptions) => T): T {
    return new clientType(clientInfo.credentials, {
        acceptLanguage: vscode.env.language,
        baseUri: clientInfo.environment.resourceManagerEndpointUrl,
        userAgent: appendExtensionUserAgent
    });
}

export async function createGenericClient(clientInfo?: types.AzExtServiceClientCredentials | { credentials: types.AzExtServiceClientCredentials; environment: Environment; }): Promise<ServiceClient> {
    let credentials: types.AzExtServiceClientCredentials | undefined;
    let baseUri: string | undefined;
    if (clientInfo && 'credentials' in clientInfo) {
        credentials = clientInfo.credentials;
        baseUri = clientInfo.environment.resourceManagerEndpointUrl;
    } else {
        credentials = clientInfo;
    }

    const gsc: typeof import('./GenericServiceClient') = await import('./GenericServiceClient');

    return new gsc.GenericServiceClient(credentials, <types.IMinimumServiceClientOptions>{
        baseUri,
        userAgent: appendExtensionUserAgent
    });
}
