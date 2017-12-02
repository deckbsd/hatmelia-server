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

  describe('#buildLinkWithSlash', function() {
    it('should a correct html link', function() {
      let from = { href: 'http://dckapps.azurewebsites.net'}
      let path = '/path'
      let link = htmlService.buildLink(from, path).href
      assert.ok(link === 'http://dckapps.azurewebsites.net/path');
    });
  });

  describe('#buildLinkWithoutSlash', function() {
    it('should a correct html link', function() {
      let from = { href: 'http://dckapps.azurewebsites.net'}
      let path = 'path'
      let link = htmlService.buildLink(from, path).href
      assert.ok(link === 'http://dckapps.azurewebsites.net/path');
    });
  });

  describe('#buildLinkWithDot', function() {
    it('should a correct html link', function() {
      let from = { href: 'http://dckapps.azurewebsites.net'}
      let path = './path'
      let link = htmlService.buildLink(from, path).href
      assert.ok(link === 'http://dckapps.azurewebsites.net/path');
    });
  });

  describe('#buildLinkWithTwoDots', function() {
    it('should a correct html link', function() {
      let from = { href: 'http://dckapps.azurewebsites.net/1'}
      let path = '../path'
      let link = htmlService.buildLink(from, path).href
      assert.ok(link === 'http://dckapps.azurewebsites.net/path');
    });
  });

  describe('#buildLinkFromLoopLink', function() {
    it('should return nothing', function() {
      let from = { href: 'http://dckapps.azurewebsites.net/'}
      let path = '#loop'
      let link = htmlService.buildLink(from, path)
      assert.ok(link === undefined);
    });
  });

  describe('#buildLinkWithSlashOnly', function() {
    it('should return nothing', function() {
      let from = { href: 'http://dckapps.azurewebsites.net/'}
      let path = '/'
      let link = htmlService.buildLink(from, path)
      assert.ok(link === undefined);
    });
  });

  describe('#buildLinkFromUndefined', function() {
    it('should return nothing', function() {
      let from = { href: 'http://dckapps.azurewebsites.net/'}
      let path = undefined
      let link = htmlService.buildLink(from, path)
      assert.ok(link === undefined);
    });
  });

  describe('#buildLinkFromEmpty', function() {
    it('should return nothing', function() {
      let from = { href: 'http://dckapps.azurewebsites.net/'}
      let path = ''
      let link = htmlService.buildLink(from, path)
      assert.ok(link === undefined);
    });
  });

  describe('#buildLinkFromNull', function() {
    it('should return nothing', function() {
      let from = { href: 'http://dckapps.azurewebsites.net/'}
      let path = null
      let link = htmlService.buildLink(from, path)
      assert.ok(link === undefined);
    });
  });

  describe('#buildAddressFromWWW', function() {
    it('should a correct address', function() {
      let from = { href: 'http://dckapps.azurewebsites.net'}
      let path = 'www.hatmelia.com'
      let link = htmlService.buildLink(from, path).href
      assert.ok(link === 'www.hatmelia.com');
    });
  });

  describe('#buildAddressFromDoubleSlashes', function() {
    it('should a correct address', function() {
      let from = { href: 'http://dckapps.azurewebsites.net'}
      let path = '//www.hatmelia.com'
      let link = htmlService.buildLink(from, path).href
      assert.ok(link === 'http://www.hatmelia.com/');
    });
  });

  describe('#buildFromHttp', function() {
    it('should a correct address', function() {
      let from = { href: 'http://dckapps.azurewebsites.net'}
      let path = '//http://www.hatmelia.com'
      let link = htmlService.buildLink(from, path).href
      assert.ok(link === 'http://www.hatmelia.com/');
    });
  });

});