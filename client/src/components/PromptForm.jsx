const PromptForm = ({ prompt, setPrompt, loading, handlePromptSubmit }) => {
    return (
        <form onSubmit={handlePromptSubmit} className="w-full max-w-xl flex flex-col gap-4 mb-8">
            <input
                className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                placeholder="Enter a topic or prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
            />
            <button
                className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
                type="submit"
                disabled={loading || !prompt.trim()}
            >
                {loading ? 'Generating...' : 'Generate Questions'}
            </button>
        </form>
    );
};

export default PromptForm;