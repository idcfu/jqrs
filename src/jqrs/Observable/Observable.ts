class Observable {
  private observers: Function[] = [];

  public attach(observer: Function): void {
    this.observers.push(observer);
  }

  public detach(observer: Function): void {
    this.observers.filter((currentObserver) => currentObserver !== observer);
  }

  public notify(): void {
    this.observers.forEach((observer) => observer());
  }
}

export default Observable;
