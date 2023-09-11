const EventEmitter = require('eventemitter3');
const hasOwnProperty = {}.hasOwnProperty;

export default (datastore) => {
  const storage = {...datastore};
  const instance = new class extends EventEmitter{
    has(key){
      return hasOwnProperty.call(storage, key);
    }
    get(key, value){
      return this.has(key) ? storage[key] : value;
    }
    insert(key, value, callback){
      if (this.update(key, value, callback)) return true;
      const newValue = storage[key] = value;
      const newEvent = {type: 'insert', key, newValue};
      this.emit(`${newEvent.type}:${key}`, newEvent);
      callback && callback(newEvent);
      return true;
    }
    update(key, value, callback){
      if (!this.has(key)) return false;
      const oldValue = storage[key];
      if (value === oldValue) return false;
      const newValue = storage[key] = value;
      const newEvent = {type: 'update', key, oldValue, newValue};
      this.emit(`${newEvent.type}:${key}`, newEvent);
      callback && callback(newEvent);
      return true;
    }
    delete(key, callback){
      if (!this.has(key)) return false;
      const oldValue = storage[key];
      const newEvent = {type: 'delete', key, oldValue};
      delete storage[key];
      this.emit(`${newEvent.type}:${key}`, newEvent);
      callback && callback(newEvent);
      return true;
    }
  };
  return instance;
};