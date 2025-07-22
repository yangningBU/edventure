import { LEVELS } from '../constants.js';

const LevelTabs = ({ level, setLevel, loading }) => {
	return (
		<div className="flex space-x-2 mb-6">
			{LEVELS.map((lvl) => {
				return (
					<button
						key={lvl}
						className={`px-4 py-2 rounded-t font-semibold transition-colors duration-200 ${level === lvl ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500'} bg-gray-100`}
						onClick={() => setLevel(lvl)}
						disabled={loading}
					>
						{lvl.charAt(0).toUpperCase() + lvl.slice(1)}
					</button>
				)
			})}
		</div>
	);
};

export default LevelTabs;