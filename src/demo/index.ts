const importAll = function (requireContext: __WebpackModuleApi.RequireContext): void {
  requireContext.keys().forEach(requireContext);
};

importAll(require.context('.', true, /\.(scss|ts)$/));
