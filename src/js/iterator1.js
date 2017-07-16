var myObject = {a:22, b:33};

//yes, you are right?
Object.defineProperty(myObject, Symbol.iterator,{
  enumerable: false,
  writable:false,
  configurable:true,
  value:function(){
    var o = this;
    var idx = 0;
    var ks = Object.keys(o);
    return {
      next: function(){
          value: o[ks[idx++]],
          done: (idx > ks.length)
      }
    };
  }
});
