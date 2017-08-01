var assert = require('assert');
const htmlService = new(require('../src/lib/services/htmlService'));

describe('Html', function() {
  describe('#isNotLoopWithValidParameter', function() {
    it('should return true when the path is not an html loop', function() {
      assert.ok(htmlService.isNotLoop('/valid') === true)
    });
  });

  describe('#isNotLoopWithAnchorParameter', function() {
    it('should return false when the path is an anchor', function() {
      assert.ok(htmlService.isNotLoop('#') === false);
    });
  });

  describe('#isNotLoopWithRootParameter', function() {
    it('should return false when the path is an /', function() {
      assert.ok(htmlService.isNotLoop('/') === false);
    });
  });

  describe('#isNotLoopWithEmptyParameter', function() {
    it('should return false when the path is empty /', function() {
      assert.ok(htmlService.isNotLoop('') === false);
    });
  });

  describe('#isNotLoopWithNUllParameter', function() {
    it('should return false when the path is null /', function() {
      assert.ok(htmlService.isNotLoop(null) === false);
    });
  });
  
  describe('#isAnAddressWithHttpParameter', function() {
    it('should return true when the url parameter start with http', function() {
      assert.ok(htmlService.isAnAddress('http://hatmelia.net') === true);
    });
  });

  describe('#isAnAddressWithWwwParameter', function() {
    it('should return true when the url parameter start with www', function() {
      assert.ok(htmlService.isAnAddress('www.hatmelia.net'));
    });
  });

  describe('#isAnAddressWithSlashesParameter', function() {
    it('should return true when the url parameter start with //', function() {
      assert.ok(htmlService.isAnAddress('//www.hatmelia.net') === true);
    });
  });

  describe('#isAnAddressWithSlashParameter', function() {
    it('should return false when the url parameter start with /', function() {
      assert.ok(htmlService.isAnAddress('/www.hatmelia.net') === false);
    });
  });

  describe('#isAnAddressWithPointParameter', function() {
    it('should return false when the url parameter start with a point', function() {
      assert.ok(htmlService.isAnAddress('./path') === false);
    });
  });
  
  describe('#buildAddressWithShlashedUrl', function() {
    it('should return correct url when parameter start with //http', function() {
      const buildedUrl = htmlService.buildAddress('//http://hatmelia.com')
      assert.ok(buildedUrl === 'http://hatmelia.com');
    });
  });

  describe('#buildAddressWithShlashedFollowedByWwwUrl', function() {
    it('should return correct url when parameter start with //www', function() {
      const buildedUrl = htmlService.buildAddress('//www.hatmelia.com')
      assert.ok(buildedUrl === 'http://www.hatmelia.com');
    });
  });

  describe('#buildAddressWithShlashedHttpsUrl', function() {
    it('should return correct url when parameter start with //https', function() {
      const buildedUrl = htmlService.buildAddress('//https://hatmelia.com')
      assert.ok(buildedUrl === 'https://hatmelia.com');
    });
  });

  describe('#isSpecialLinkWithMailLinkParameter', function() {
    it('should return true when the parameter is an email link', function() {
      assert.ok(htmlService.isSpecialLink('mailto:test@hatmelia.rr') === true);
    });
  });

  describe('#isSpecialLinkWithPhoneLinkParameter', function() {
    it('should return true when the parameter is a phone link', function() {
      assert.ok(htmlService.isSpecialLink('tel:55501451') === true);
    });
  });

  describe('#isSpecialLinkWithPathParameter', function() {
    it('should return false when the parameter is an html link', function() {
      assert.ok(htmlService.isSpecialLink('/path') === false);
    });
  });

});