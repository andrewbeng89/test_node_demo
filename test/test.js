var app = require('../app'), http = require('http'), request = require('supertest'), assert = require('assert');

describe('GET /index.html', function(){
  it('get index.html', function(done){
    request(app)
      .get('/index.html')
      .expect(200, done);
  });
});