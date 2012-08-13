var open = require("../")
  , WriteStream = require('./support/write-stream')
  , fs = require("fs");

describe('open-uri',function(){

  describe('ftp',function(){

    var uri = 'ftp://ftp.sunet.se/pub/Internet-documents/rfc/rfc100.txt'
      , size = 62473;

    it('should GET a text file from ftp',function(done){
      open(uri,function(err,rfc){
        rfc.should.be.a('string')
        rfc.should.have.length(size)
        done(err)
      })
    })

    it('should attempt to get a non-existing text file from ftp',function(done){
      open("ftp://ftp.sunet.se/im-not-here.txt",function(err,rfc){
        err.should.exist
        done()
      })
    })

    it('should stream a text file from ftp',function(done){
      open(uri,new WriteStream(done))
    })

    it('should stream a text file from ftp to a file',function(done){
      var path = "/tmp/rfc-"+Date.now()+".html";
      var file = fs.createWriteStream(path)
      open(uri,file)
      file.on('close',function(){
        fs.statSync(path).should.have.property('size',size)
        done();
      })
    })

  })

})