'use strict';

describe('Controller: PostCtrl', function () {

  // load the controller's module
  beforeEach(module('cmsApp'));

  var PostCtrl,
    scope,
    Post,
    DRAFT_URL,
    PUBLISH_URL,
    PostBuilder = {},
    githubMock = {
    get: jasmine.createSpy().and.callFake(function () {
      return {
        done: jasmine.createSpy()
      };
    })
  };

  beforeEach(inject(function ($rootScope, $controller, _Post_, _DRAFT_URL_, _PUBLISH_URL_) {
    scope = $rootScope.$new();
    Post = _Post_;
    DRAFT_URL = _DRAFT_URL_;
    PUBLISH_URL = _PUBLISH_URL_;
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

  describe('removeTag', function(){

    it('should call deleteTag', function(){
      scope.post = PostBuilder.buildAndLoadJekyllData();
      spyOn(scope.post, 'deleteTag');
      scope.tagsPersonalizadas = ['newtag'];
      scope.removeTag(0);

      expect(scope.post.deleteTag).toHaveBeenCalledWith('newtag');
    });

    it('should delete tag', function(){
      scope.post = PostBuilder.buildAndLoadJekyllData();
      scope.tag ='newtag';
      scope.processTag();
      expect(scope.tagsPersonalizadas.length).toBe(1);
      scope.removeTag(0);
      expect(scope.tagsPersonalizadas.length).toBe(0);
    });
  });

  describe('save/publish a post', function() {

    it('should save a post in draft', function() {
      scope.post = PostBuilder.buildAndLoadJekyllData();
      spyOn(scope, 'save');
      var url = DRAFT_URL + scope.post.name;
      scope.draft(scope.post);
      expect(scope.save).toHaveBeenCalledWith(scope.post, url);
    });

    it('should publish a post', function() {
      scope.post = PostBuilder.buildAndLoadJekyllData();
      spyOn(scope, 'save');
      var url = PUBLISH_URL + scope.post.name;
      scope.publish(scope.post);
      expect(scope.save).toHaveBeenCalledWith(scope.post, url);
    });
  });


  describe('post status', function(){

    it('should be RASCUNHO when post is draft', function(){
      /*jshint camelcase: false */
      scope.post = PostBuilder.buildAndLoadJekyllData();
      scope.post.html_url = 'https://laskjdfl;sjdfl;ksja;lkfjsa/_drafts/l;sadjfl;sakjdflj';
      expect(scope.postStatus()).toBe('RASCUNHO');
    });

    it('should be PUBLICADO when post is published', function(){
      /*jshint camelcase: false */
      scope.post = PostBuilder.buildAndLoadJekyllData();
      scope.post.html_url = 'https://laskjdfl;sjdfl;ksja;lkfjsa/_posts/l;sadjfl;sakjdflj';
      expect(scope.postStatus()).toBe('PUBLICADO');
    });

    it('should be empty when post is not published and not draft', function(){
      /*jshint camelcase: false */
      scope.post = PostBuilder.buildAndLoadJekyllData();
      scope.post.html_url = 'https://laskjdfl;sjdfl;ksja;lkfjsa/_xxxxx/l;sadjfl;sakjdflj';
      expect(scope.postStatus()).toBe('');
    });
  });

  describe('should save a new post', function() {

    beforeEach(inject(function () {
      spyOn(scope,'getTime').and.returnValue(new Date(2001,11,29,12,0));
    }));

    it('add year, month and day in file name', function() {

      var post = {
        title: 'Olha lá o avião'
      };
      var fileName = scope.prepareNameFile(post);

      expect(fileName).toMatch(/2001-12-29/);
    });

    it('add title post to be file name', function() {
      var post = {
        title: 'Olha lá o avião'
      };
      var fileName = scope.prepareNameFile(post);

      expect(fileName).toMatch(/olha-l-o-avio/);
    });

    it('should return the same file name when i have one', function() {
      var post = {
        title: 'Olha lá o avião',
        name: '2014-10-10-algo-aqui'
      };
      var fileName = scope.prepareNameFile(post);

      expect(fileName).toMatch('2014-10-10-algo-aqui');
    });
  });
});
