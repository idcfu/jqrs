const importAll = function (requireContext: __WebpackModuleApi.RequireContext): void {
  requireContext.keys().forEach(requireContext);
};

importAll(require.context('.', true, /^(?!.*(?:test.ts$)).*\.(scss|ts)$/));

$('.jqrs').jqrs({
  min: 0,
  max: 3,
  step: 1,
  from: 0,
  hasScale: true,
});
