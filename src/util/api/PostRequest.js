import Request from './Request';
import Fetcher from './Fetcher';
import Token from './Token';

class PostRequest extends Request
{
  fetch(options = {}){
    return new Fetcher(async (cancelToken) => {
      const {data, params, headers, withToken} = this._options;
      const tokenHeaders = withToken || options.withToken ? await Token.getHeaders() : Object.create(null);
      return this._request.request({
        method: 'post',
        url: this._path,
        data: {...data, ...options.data},
        params: {...params, ...options.params},
        headers: {...headers, ...options.headers, ...tokenHeaders},
        cancelToken
      });
    });
  }
}

export default PostRequest;