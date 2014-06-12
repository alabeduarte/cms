'use strict';

describe('Controller: PostCtrl', function () {

  // load the controller's module
  beforeEach(module('cmsApp'));

  var PostCtrl,
    scope,
    Post,
    PostBuilder = {},
    githubMock = {
    get: jasmine.createSpy().and.callFake(function () {
      return {
        done: jasmine.createSpy()
      };
    })
  };

  beforeEach(inject(function ($rootScope, $controller, _Post_) {
    scope = $rootScope.$new();
    Post = _Post_;
    $rootScope.posts = [];
    $rootScope.github = githubMock;

    PostCtrl = $controller('PostCtrl', {
      $scope: scope
    });

    PostBuilder =  {
      jekyllData: '---\n' +
        'layout: post\n' +
        'title: \'Post Title\'\n' +
        'created: 1323977240\n' +
        'images: []\n' +
        'video:\n' +
        'tags:\n' +
        'section:\n' +
        'label:\n' +
        '- menu:menuitem\n' +
        '---\n' +
        'post content',
      build: function () {
        return Post.makePost();
      },
      buildAndLoadJekyllData: function () {
        var post = this.build();
        post.loadContentFromJekyllData(this.jekyllData);
        return post;
      }
    };

  }));


  it('should set the menu item of a post', function() {
    scope.post = PostBuilder.buildAndLoadJekyllData();
    spyOn(scope.post, 'setMenuItem');

    scope.$apply(function () {
      scope.menuTag = 'agronegócios';
    });

    expect(scope.post.setMenuItem).toHaveBeenCalledWith('agronegócios');
  });

  it('should set the section of a post', function() {
    scope.post = PostBuilder.buildAndLoadJekyllData();
    spyOn(scope.post, 'setSection');

    scope.$apply(function () {
      scope.section = {label: 'Destaques', value: 'featured-news'};
    });

    expect(scope.post.setSection).toHaveBeenCalledWith(scope.section);
  });

  it('should set the label of a post', function() {
    scope.post = PostBuilder.buildAndLoadJekyllData();
    spyOn(scope.post, 'setLabel');

    scope.$apply(function () {
      scope.label = {label: 'Artigo', value: 'article'};
    });

    expect(scope.post.setLabel).toHaveBeenCalledWith(scope.label);
  });

  describe('processTag', function(){

    it('should call addNewTag', function(){
      scope.post = PostBuilder.buildAndLoadJekyllData();
      spyOn(scope.post, 'addNewTag');
      scope.tag = 'newtag';
      scope.processTag();

      expect(scope.post.addNewTag).toHaveBeenCalledWith('newtag');
    });

    it('should add new tag', function(){
      scope.post = PostBuilder.buildAndLoadJekyllData();
      expect(scope.tagsPersonalizadas.length).toBe(0);
      scope.tag ='newtag';
      scope.processTag();
      expect(scope.tagsPersonalizadas.length).toBe(1);
    });

    it('should not add the same tag twice', function(){
      scope.post = PostBuilder.buildAndLoadJekyllData();
      scope.tagsPersonalizadas = ['newtag'];
      expect(scope.tagsPersonalizadas.length).toBe(1);
      scope.tag ='newtag';
      scope.processTag();
      expect(scope.tagsPersonalizadas.length).toBe(1);
    });
  });
});

