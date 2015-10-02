'use strict';


var should = require('chai').should();

var captor = require('./../src/capture');

describe('captor.capture()', function() {
    it('should return base64 string without error', function(done) {

        var opts = {
            mode: 'base64',
            url: 'http://jips.spatialdevmo.com/visualize?dataset=delhi&topic=Migration%20patterns&analyse1=MYearLeave&viztype=column',
            viewport_width: 2000,
            viewport_height: 1000,
            delay: 2000,
            selector: '#viz-chart-container'
        };

        captor.capture(opts)
            .then(function(results){
                results.should.be.an('object')
                results.should.have.property('base64')
                    .which.is.a('string')
                done();
            },function(err){
                done(err)
            })
    });
});