import EventEmitter from 'eventemitter3';

class Request extends EventEmitter
{
  constructor(path, request, options){
    super();
    this._path = path;
    this._request = request;
    this._options = options;
  }

  getPath(){
    return this._path;
  }

  getRequest(){
    return this._request;
  }

  getOptions(){
    return this._options;
  }
}

export default Request;