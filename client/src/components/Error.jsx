const Error = ({ error }) => {
  return error ? <div className="text-red-600 mb-4">{error}</div> : null;
};

export default Error;