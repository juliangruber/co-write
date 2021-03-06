
# co-write

  Write to streams, respecting backpressure.

  [![build status](https://secure.travis-ci.org/juliangruber/co-write.png)](http://travis-ci.org/juliangruber/co-write)

## Example

  Write random numbers to an http response until it ends:

```js
var write = require('co-write');
var co = require('co');
var http = require('http');

http.createServer(function(req, res){
  co(function*(){
    while (true) {
      var open = yield write(res, ''+Math.random());
      if (!open) return;
    }
  })();
}).listen(8000);
```

## yield write(stream, chunk)

  Write `chunk` to `stream` and block until `stream` is writable again.

  Returns false when `stream` ended and you should stop writing to it.

  Throws when `stream` already ended.

## HTTP special casing

  When an HTTP request ended, the HTTP response stays writable, only it's
  underlying socket closes. To stay consistent with other streams' behavior,
  in that case `write()` will throw an error itself.

## Installation

```bash
$ npm install co-write
```

## License

  MIT

