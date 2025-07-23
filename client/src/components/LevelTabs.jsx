import React from 'react';
import { isRTL, t } from '../i18n.js';
import { LEVELS } from '../constants.js';

const LevelTabs = ({ level, setLevel, loading }) => {
	const levels = isRTL() ? LEVELS.toReversed() : LEVELS;
	return (
		<div className="flex space-x-2 mb-6">
			{levels.map((lvl) => {
				const label = t(`${lvl}Title`);
				return (
					<button
						key={lvl}
						className={`px-4 py-2 rounded-t font-semibold transition-colors duration-200 ${level === lvl ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500'} bg-gray-100`}
						onClick={() => setLevel(lvl)}
						disabled={loading}
					>
						{label}
					</button>
				)
			})}
		</div>
	);
};

export default LevelTabs;