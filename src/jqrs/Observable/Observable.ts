class Observable {
  private observers: Function[] = [];

  public attach(observer: Function): void {
    this.observers.push(observer);
  }

  public detach(observer: Function): void {
    this.observers.filter((currentObserver) => currentObserver !== observer);
  }

  public notify(data?: number): void {
    this.observers.forEach((observer) => observer(data));
  }
}

export default Observable;
