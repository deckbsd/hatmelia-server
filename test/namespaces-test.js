var assert = require('assert');
const LinksNameSpace = new(require('../src/ionamespaces/linksNamespace'));

describe('Links', function() {
  describe('#checkIfValidParameterWithNullValue', function() {
    it('should throw invalid-parameter when the value is not correct', function() {
      assert.throws(function() {
        LinksNameSpace.checkIfValidParameter(null);
      }, 'invalid-parameter');
    });
  });

  describe('#checkIfValidParameterWithEmptyValue', function() {
    it('should throw invalid-parameter when the value is empty', function() {
      assert.throws(function() {
        LinksNameSpace.checkIfValidParameter('');
      }, 'invalid-parameter');
    });
  });

  describe('#checkIfValidParameterWithEmptyNotAString', function() {
    it('should throw invalid-parameter when the value is not a string', function() {
      assert.throws(function() {
        LinksNameSpace.checkIfValidParameter(666);
      }, 'invalid-parameter');
    });
  });

  describe('#checkIfValidParameterWithEmptyNotAString', function() {
    it('should not throw invalid-parameter when the value is a string', function() {
      assert.doesNotThrow(function() {
        LinksNameSpace.checkIfValidParameter("http://test.com");
      }, 'invalid-parameter');
    });
  });

  describe('#createUrlWithNotACorrectProtocol', function() {
    it('should throw protocol-not-supported when the value doesn t start with http or https', function() {
      assert.throws(function() {
        LinksNameSpace.createUrl("www.newave.be");
      }, 'protocol-not-supported');
    });
  });

  describe('#createUrlWithACorrectProtocol', function() {
    it('should not throw protocol-not-supported when the value start with http or https', function() {
      assert.doesNotThrow(function() {
        LinksNameSpace.createUrl("http://newave.be");
      }, 'protocol-not-supported');
    });
  });

  describe('#createUrlWithACorrectProtocolReturnUrlObject', function() {
    it('should return a url object', function() {
      var url = LinksNameSpace.createUrl("http://newave.be");
      assert.ok(url.href === "http://newave.be/");
    });
  });
});