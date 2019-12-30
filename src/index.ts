import { ApolloLink, split } from 'apollo-link';
import { BlueBase, createPlugin, merge } from '@bluebase/core';

import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

export default createPlugin({
	description: 'Adds a WebSocket link to Apollo Client',
	key: '@bluebase/plugin-apollo-link-ws',
	name: 'Apollo WebSocket Link',
	version: '1.0.0',

	defaultConfigs: {
		'plugin.apollo.wsLinkOptions': {},
	},

	filters: {
		'plugin.apollo.link': {
			key: 'apollo-link-ws',
			value: (link: ApolloLink, _ctx: any, BB: BlueBase) => {
				const wsLinkOptions = BB.Configs.getValue('plugin.apollo.wsLinkOptions');

				const options: any = merge(
					{
						options: {
							reconnect: true,
						},
					},
					wsLinkOptions
				);

				// Create a WebSocket link:
				const wsLink = new WebSocketLink(options);

				// using the ability to split links, you can send data to each link
				// depending on what kind of operation is being sent
				return split(
					// split based on operation type
					({ query }) => {
						const definition = getMainDefinition(query);
						return (
							definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
						);
					},
					wsLink,
					link
				);
			},
		},
	},
});
