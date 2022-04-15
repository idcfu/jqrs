if (!window.PointerEvent) {
  class PointerEvent extends MouseEvent {}

  window.PointerEvent = PointerEvent as any;
}

if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = function (): void {};
}
