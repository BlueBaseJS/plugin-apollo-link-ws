import { ApolloLink, split } from '@apollo/client';
import { BlueBase, createPlugin, merge } from '@bluebase/core';

import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

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
			value: async (link: ApolloLink, _ctx: any, BB: BlueBase) => {
				const wsLinkOptions = BB.Configs.getValue('plugin.apollo.wsLinkOptions');

				const options: any = await BB.Filters.run(
					'plugin.apollo.wsLinkOptions',
					merge(
						{
							options: {
								reconnect: true,
							},
						},
						wsLinkOptions
					)
				);

				// Create a WebSocket link:
				const wsLink = await BB.Filters.run('plugin.apollo.wsLink', new WebSocketLink(options));

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
