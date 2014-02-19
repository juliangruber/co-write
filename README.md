
# co-write

  Write to streams, respecting backpressure.

## yield write(stream, chunk)

  Write `chunk` to `stream` and block until `stream` is writable again.

  Returns false when `stream` ended and you should stop writing to it.

## Installation

```bash
$ npm install co-write
```

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

## License

  MIT

