// const { persistCache } = jest.genMockFromModule('apollo-cache-persist');

// jest.mock('apollo-cache-persist', () => {
// 	return { persistCache: jest.fn() };
// });

import 'cross-fetch/polyfill';

import { BlueBase } from '@bluebase/core';
import BlueBasePluginApollo from '@bluebase/plugin-apollo';
import Plugin from '../index';

// jest.mock('apollo-cache-persist', () => ({ CachePersistor: jest.fn() }));

test('Plugin should be correctly registered', async () => {
	const BB = new BlueBase();

	await BB.boot({ plugins: [BlueBasePluginApollo, Plugin] });
	expect(BB.Plugins.has('@bluebase/plugin-apollo-link-ws')).toBeTruthy();
});
