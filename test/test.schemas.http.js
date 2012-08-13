var open = require("../lib/open-uri")
  , echo = require('./support/echo-server')
  , fs = require("fs");

describe('open-uri',function(){
  describe('http',function(){

    it('should GET a website',function(done){
      open("http://google.com",function(err,google){
        google.should.be.a('string')
        google.should.not.be.empty
        done(err);
      })
    })

    it('should GET a website with an addressable.URI object',function(done){
      var url = require('addressable').parse("http://google.com");
      open(url,function(err,google){
        google.should.be.a('string')
        google.should.not.be.empty
        done(err);
      })
    })

    it('should GET a website with a node.js built-in URL object',function(done){
      var url = require("url").parse("http://google.com");
      open(url,function(err,google){
        google.should.be.a('string')
        google.should.not.be.empty
        done(err);
      })
    })

    it('should GET an encrypted website',function(done){
      open("https://github.com",function(err,github){
        github.should.be.a('string')
        github.should.not.be.empty
        done(err);
      })
    })

    it('should GET a website with auth',function(done){
      open("http://user:pass@google.com",function(err,google){
        google.should.be.a('string')
        google.should.not.be.empty
        done(err);
      })
    })

    it('should GET an encrypted website with auth',function(done){
      open("https://user:pass@encrypted.google.com",function(err,google){
        google.should.be.a('string')
        google.should.not.be.empty
        done(err);
      })
    })

    it('should POST a string to a website',function(done){
      echo(function(server,port){
        open("http://localhost:"+port,{method:"POST",body:"abc"},function(err,dump,res){
          res.should.have.status(200)
          res.should.have.header('content-type','text/plain')
          dump.should.be.a('string')
          dump.should.equal('abc')
          done(err);
        })
      })
    })

    it('should POST a buffer to a website',function(done){
      echo(function(server,port){
        var opts = {
          method: "POST",
          body: new Buffer([1,2,3,4]),
          headers: {"Content-Type":"application/octet-stream"}
        }
        open("http://localhost:"+port,opts,function(err,dump,res){
          res.should.have.status(200)
          res.should.have.header('content-type','application/octet-stream')
          Buffer.isBuffer(dump).should.be.true
          dump.should.have.length(4)
          done(err)
        })
      })
    })

    it('should PUT a form to a website',function(done){
      echo(function(server,port){
        var opts = {
          method: "PUT",
          body:"a=1&b=2&c=3",
          headers: {"Content-Type":"application/x-www-form-urlencoded"}
        }
        open("http://localhost:"+port,opts,function(err,dump,res){
          res.should.have.status(200)
          res.should.have.header('content-type','application/x-www-form-urlencoded')
          dump.should.be.a('object')
          dump.should.eql({a:'1',b:'2',c:'3'})
          done(err)
        })
      })
    })

    it('should POST some JSON to a website',function(done){
      echo(function(server,port){
        var opts = {
          method: "POST",
          body:'{"a":1,"b":2,"c":3}',
          headers: {"Content-Type":"application/json"}
        }
        open("http://localhost:"+port,opts,function(err,dump,res){
          res.should.have.status(200)
          res.should.be.json
          dump.should.be.a('object')
          dump.should.eql({a:1,b:2,c:3})
          done(err)
        })
      })
    })

    it('should POST stream text as body to a website',function(done){
      echo(function(server,port){
        var file = fs.createReadStream("README.md");
        open("http://localhost:"+port,{method:"POST",body:file},function(err,dump,res){
          res.should.have.status(200)
          res.should.have.header('content-type','text/plain')
          dump.should.be.a('string')
          dump.should.eql(fs.readFileSync("README.md","utf8"))
          done(err)
        })
      })
    })

    it('should GET Stream an encrypted website to a file',function(done){
      var path = "/tmp/goog-"+Date.now()+".html";
      var file = fs.createWriteStream(path)
      open("https://encrypted.google.com/search?q=open+uri",file);
      file.on('close',function(){
        (function(){fs.statSync(path)}).should.not.throw
        done();
      })
    })

    // TODO must find another link that does this...
    // it('should GET a redirect with a relative Location',function(done){
    //   open("http://golang.org/cmd/5a",function(err,go,res){
    //     res.should.have.status(200)
    //     res.should.have.header('content-type','text/html')
    //     assert.includes(go,'<title>Command 5a - The Go Programming Language</title>')
    //     done(err)
    //   })
    // })

    // TODO must find another link that does this...
    // it('should GET a redirect without following',function(done){
    //   open("http://golang.org/cmd/5a",{follow:false},function(err,go,res){
    //     res.should.have.status(301)
    //     // assert.includes(go,'Moved Permanently')
    //     done(err);
    //   })
    // })

  })
})