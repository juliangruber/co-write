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
    highWaterMark: 0 // no queuing
  });
  writable._write = function(chunk, _, done){
    setTimeout(function(){
      done();
      writable.writable = false;
    }, 10);
  };

  t.assert(yield write(writable, 'foo'), 'writable');
  t.assert(!(yield write(writable, 'bar')), 'ended');
});

test('listener cleanup', function*(t){
  var writable = new Writable();
  writable._write = function(_, _, done){ done() };
  var before = listeners();
  yield write(writable, 'foo');
  t.deepEqual(listeners(), before);

  function listeners(){
    return {
      error: writable.listeners('error'),
      drain: writable.listeners('drain'),
      finish: writable.listeners('finish')
    };
  }
});

