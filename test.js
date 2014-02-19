var write = require('./');
var Writable = require('stream').Writable;
var test = require('gap');

test('write', function*(t){
  var lastChunk;

  var writable = new Writable({
    highWaterMark: 0 // force immediate backpressure
  });

  writable._write = function(chunk, _, done){
    setTimeout(function(){
      lastChunk = chunk.toString();
      done();
    }, 10);
  };

  yield write(writable, 'foo');
  t.equal(lastChunk, 'foo');
  yield write(writable, 'bar');
  t.equal(lastChunk, 'bar');
});

test('error', function*(t){
  var writable = new Writable();
  writable._write = function(chunk, _, done){
    done(new Error);
  };

  var threw = false;

  try {
    yield write(writable, '*ducks*');
  } catch (err) {
    threw = true;
  }

  t.assert(threw);
});

test('end', function*(t){
  var writable = new Writable({
    highWaterMark: 0 // force immediate backpressure
  });

  writable._write = function(chunk, _, done){
    setTimeout(function(){
      done();
      writable.end();
    }, 10);
  };

  t.assert(yield write(writable, 'foo'));
  t.assert(!(yield write(writable, 'bar')));
});

