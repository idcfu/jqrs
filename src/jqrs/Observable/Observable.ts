type EventType = 'calculateTicks'
| 'findClosestTick'
| 'handleAction'
| 'handleDocumentMousemove'
| 'handleProgressClick'
| 'handleTrackClick'
| 'setTip';

class Observable {
  private readonly observers: Record<EventType, Function[]> = {
    calculateTicks: [],
    findClosestTick: [],
    handleAction: [],
    handleDocumentMousemove: [],
    handleProgressClick: [],
    handleTrackClick: [],
    setTip: [],
  };

  public attach(eventType: EventType, observer: Function): void {
    this.observers[eventType].push(observer);
  }

  public detach(eventType: EventType, observerToDetach: Function): void {
    this.observers[eventType].filter((observer) => observer !== observerToDetach);
  }

  public notify(eventType: EventType, data: unknown): void {
    this.observers[eventType].forEach((observer) => observer(data));
  }
}

export default Observable;
