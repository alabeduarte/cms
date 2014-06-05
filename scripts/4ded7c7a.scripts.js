"use strict";var app=angular.module("cmsApp",["ngRoute"]);app.config(["$routeProvider",function(a){a.when("/auth",{templateUrl:"views/auth.html",controller:"AuthCtrl"}).when("/posts",{templateUrl:"views/posts.html",controller:"PostsCtrl"}).when("/posts/:sha",{templateUrl:"views/post.html",controller:"PostCtrl"}).otherwise({redirectTo:"/auth"})}]),app.config(["$httpProvider",function(a){a.defaults.useXDomain=!0,delete a.defaults.headers.common["X-Requested-With"]}]),angular.module("cmsApp").controller("PostCtrl",["$scope","$rootScope","$routeParams",function(a,b,c){function d(a){return b.posts.filter(function(b){return b.sha===a}).shift(0)}function e(a){return"https://api.github.com/repos/movimento-sem-terra/site-novo/git/blobs/"+a}function f(a){return"/repos/movimento-sem-terra/site-novo/contents/_drafts/"+a}var g=c.sha;a.post=d(g),a.menuTagOptions=["agricultura camponesa","agronegócio","direitos humanos","educação, cultura e comunicação","lutas e mobilizações","solidariedade internacional","meio ambiente","projeto popular","reforma agrária","transgênicos"],a.sectionOptions=[{label:"Destaque",value:"featured-news"},{label:"Debate",value:"debate"},{label:"Capa",value:"cover"},{label:"MST TV",value:"tv"}],a.labelOptions=[{label:"Artigo",value:"articles"},{label:"Entrevista",value:"interviews"},{label:"Reportagens Especiais",value:"special-stories"}],a.menuTag=void 0,a.section=void 0,a.label=void 0,a.tag="",a.imagesHD=void 0,a.$watch("label",function(b){a.post.setLabel(b)}),a.$watch("menuTag",function(b){a.post.setMenuItem(b)}),a.$watch("section",function(b){a.post.setSection(b)}),b.github.get(e(g)).done(function(b){a.post.loadContentFromJekyllData(atob(b.content)),a.$apply()}),a.save=function(c){a.post.setImagesHD(a.uploadImage()),b.github.put(f(c.name),{data:JSON.stringify(c.commitData())}).done(function(){alert("Post salvo com sucesso!")}).fail(function(a){console.log("error data:",a)})},a.uploadImage=function(){var a=new XMLHttpRequest,c=new FormData,d=document.getElementById("imgFile");if(d.files.length>0){var e=d.files[0];return c.append("myfile",e),c.append("token",b.github.access_token),a.open("POST","http://mst-image-service.herokuapp.com/upload",!1),a.send(c),a.response}return""}}]),angular.module("cmsApp").controller("PostsCtrl",["$scope","$rootScope","_","Post",function(a,b,c,d){b.github.get("/repos/movimento-sem-terra/site-novo/contents/_drafts").done(function(e){b.posts=c.map(e,d.makePost),a.$apply()})}]),angular.module("cmsApp").controller("AuthCtrl",["$scope","$rootScope","$location","oauth",function(a,b,c,d){a.authenticate=function(){d.popup("github",function(d,e){return d?alert(d):(b.github=e,c.path("/posts"),void a.$apply())})}}]),angular.module("cmsApp").factory("oauth",function(){var a=window.OAuth;return a.initialize("S2shWzj2Cp87Mg4estazc6DFGQc"),a}),angular.module("cmsApp").directive("ckEditor",function(){return{require:"?ngModel",link:function(a,b,c,d){var e=window.CKEDITOR.replace(b[0]);e.on("instanceReady",function(){e.setData(d.$viewValue)}),e.on("pasteState",function(){a.$apply(function(){d.$setViewValue(e.getData())})}),d.$render=function(){e.setData(d.$modelValue)}}}}),angular.module("cmsApp").factory("_",function(){return window._}),angular.module("cmsApp").service("Post",["_","jsyaml",function(a,b){return{makePost:function(c){var d={};return a.extend(d,c),d.loadContentFromJekyllData=function(a){var c=decodeURIComponent(escape(a)).split("---");d.content={text:c.pop().replace(/^\n/,""),meta:b.load(c.pop())}},d.convertContentToJekyllData=function(){if(!d.content)return"";var a=["---",b.dump(d.content.meta),"---",d.content.text].join("\n");return unescape(encodeURIComponent(a))},d.commitData=function(){return{sha:d.sha,content:btoa(d.convertContentToJekyllData()),message:"commit from cms"}},d.setMenuItem=function(b){d.content&&(d.content.meta.tags=a.filter(d.content.meta.tags,function(a){return!/^menu:/.test(a)}),b&&d.content.meta.tags.push("menu:"+b))},d.setLabel=function(a){return d.content?a?void(d.content.meta.label=a.value):void(d.content.meta.label=""):void 0},d.setSection=function(a){return d.content?a?void(d.content.meta.section=a.value):void(d.content.meta.section=""):void 0},d.setImagesHD=function(a){return d.content?a?void(d.content.meta.images_hd=a):void(d.content.meta.images_hd=""):void 0},d.addNewTag=function(a){d.content.meta.tags&&(a="personalizada:"+a,d.content.meta.tags.push(a))},d}}}]),angular.module("cmsApp").factory("jsyaml",function(){return window.jsyaml});