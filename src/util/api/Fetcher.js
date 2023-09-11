import axios from 'axios';
import safe from '../safe';
import createErrorResponse from './createErrorResponse';
import createSuccessResponse from './createSuccessResponse';

class Fetcher
{
  constructor(fetch){
    this._fetch = fetch;
    this._promise = this._token = null;
  }

  then(callback){
    const promise = this._createRequest().then(callback);
    if (promise !== this._promise) {
      this._promise = promise;
    }
    return this;
  }

  safeThen(callback, catcher){
    return this.then(safe(callback, catcher));
  }

  catch(callback){
    const promise = this._createRequest().catch(callback);
    if (promise !== this._promise) {
      this._promise = promise;
    }
    return this;
  }

  safeCatch(callback, catcher){
    return this.catch(safe(callback, catcher));
  }

  finally(callback){
    const promise = this._createRequest().finally(callback);
    if (promise !== this._promise) {
      this._promise = promise;
    }
    return this;
  }

  safeFinally(callback, catcher){
    return this.finally(safe(callback, catcher));
  }

  cancel(message){
    this._token && this._token.cancel(message);
    this._clearRequest();
    return this;
  }

  _createRequest(){
    if (this._promise) {
      return this._promise;
    }
    this._token = axios.CancelToken.source();
    this._promise = new Promise(async (resolve, reject) => {
      try {
        var response = await this._fetch(this._token.token);
      } catch (e) {
        this._clearRequest();
        axios.isCancel(e) || reject(createErrorResponse(e));
        return;
      }
      this._clearRequest();
      resolve(createSuccessResponse(response));
    });
    return this._promise;
  }

  _clearRequest(){
    this._promise = this._token = null;
    return this;
  }
}

export default Fetcher;