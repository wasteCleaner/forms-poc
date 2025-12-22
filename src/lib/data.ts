import { type Game, GamePlatform, AgeRating } from './types';

export const AVAILABLE_GAMES: Game[] = [
	{ id: 'g1', title: 'Cyberpunk 2077', platform: GamePlatform.PC, ageRating: AgeRating.M },
	{
		id: 'g2',
		title: 'The Legend of Zelda: BOTW',
		platform: GamePlatform.Switch,
		ageRating: AgeRating.E10
	},
	{ id: 'g3', title: 'Elden Ring', platform: GamePlatform.PlayStation, ageRating: AgeRating.M },
	{ id: 'g4', title: 'Halo Infinite', platform: GamePlatform.Xbox, ageRating: AgeRating.T },
	{ id: 'g5', title: 'Stardew Valley', platform: GamePlatform.PC, ageRating: AgeRating.E }
];

export const MOCK_USER_ID = 'user_123';
