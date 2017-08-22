export default class SSEClient {
  constructor(maxData = 100) {
    this.maxData = maxData;
    this.stream = null;
    this.listeners = [];
  }

  open() {
    this.stream = new EventSource(`http://13.124.119.241/sse?limit=${this.maxData}`);

    this.stream.onopen = () => this.listeners.forEach(listener => listener('open'));
    this.stream.onerror = (event) => this.listeners.forEach(listener => listener('error', event));
    this.stream.onmessage = (event) => this.listeners.forEach(listener => listener('message', event.data));

    window.addEventListener('beforeunload', () => this.close());
  }

  close() {
    if (this.stream) {
      this.stream.close();
      this.listeners.forEach(listener => listener('close'))
    }
  }

  addEventListener(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener);
    }
  }

}
