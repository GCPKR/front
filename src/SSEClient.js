export default class SSEClient {
  constructor(maxData = 100) {
    this.maxData = maxData;
    this.stream = null;
    this.listeners = [];
  }

  open() {
    this.stream = new EventSource(`http://13.124.119.241/sse?limit=${this.maxData}`);

    this.stream.onopen = () =>  console.log('open');
    this.stream.onerror = (event) => console.error(event);

    this.listeners.forEach((e) => {
      this.stream.addEventListener(e.eventName, event => e.listener(e.eventName, JSON.parse(event.data)));
    });

    window.addEventListener('beforeunload', () => this.close());
  }

  close() {
    if (this.stream) {
      this.stream.close();
      console.log('close');
    }
  }

  addEventListener(eventName, listener) {
    this.listeners.push({ eventName, listener });
  }

}
