import axios from 'axios';

class SystemActionResource {
  constructor(data) {
    Object.assign(this, data);
  }

  refresh(onProgress) {
    return axios.get(`/rest/latest/actions/status/${encodeURIComponent(this.resourceId)}`)
      .then(response => {
        if (typeof onProgress === 'function') onProgress(response.data);
        return Object.assign(this, response.data);
      })
      .catch(error => {
        return Object.assign(this, {
          finished: true,
          results: {
            failed: true,
            messages: [],
            exception: { message: error.message }
          }
        });
      });
  }

  refreshUntilFinished(timeout, onProgress) {
    if (this.finished) return Promise.resolve(this);
    return setTimeout(() => {
      return this.refresh(onProgress);
    }, timeout || 1000).then(() => {
      return this.refreshUntilFinished(timeout, onProgress);
    });
  }
}

class SystemActions {
  static trigger(name, content) {
    return axios.put(`/rest/latest/actions/trigger/${encodeURIComponent(name)}`, content)
      .then(response => {
        return new SystemActionResource(response.data);
      });
  }
}

export default SystemActions;