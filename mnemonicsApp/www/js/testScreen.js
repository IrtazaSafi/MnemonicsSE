/**
 * Created by rellg on 2/26/2017.
 */
(function(){

  var settings = angular.module('mnemonics.testScreen', ['ngCordova','mnemonics.comService','ngAnimate']);


  settings.controller('testScreenController', function ($scope, $http, $state, comService, $rootScope) {
    //comService.getWords();

    $scope.goBack = function(){
      $state.go('mainDeckPage');
    };

    $scope.knowWord = function(){
      //console.log('know word pressed');
      $scope.hideHints();
      $scope.currentWord = comService.getRandomWord();
      $scope.setFirstMnemonic();
    };

    $scope.dontKnowWord = function(){
      //console.log('dont know word pressed');
      $scope.hideHints();
      $scope.currentWord = comService.getRandomWord();
      $scope.setFirstMnemonic();

    };

    $scope.voteUp = function(){
      //console.log('vote up pressed');
      comService.upVoteMnemonic($scope.currentMnemonic);
      $scope.currentMnemonic.rating++;

    };

    $scope.voteDown = function(){
      //console.log('vote down pressed');
      comService.downVoteMnemonic($scope.currentMnemonic);
      $scope.currentMnemonic.rating--;
    };

    $scope.mnemonicLeft = function(){
      //console.log('mnemonic left pressed');
      $scope.setPrevMnemonic();
    };

    $scope.mnemonicRight = function(){
      //console.log('mnemonic right pressed');
      $scope.setNextMnemonic();
    };

    $scope.suggestMnemonic = function(){
      $state.currentWordId=$scope.word_id;
      $state.go('enterMnemonicForm');
    };

    $scope.handleShowDefinition = function(){
      $scope.showDefinition = true;
    };

    $scope.handleShowMnemonic = function(){
      $scope.showMnemonic = true;
    };

    $scope.hideHints = function(){
      $scope.showDefinition=false;
      $scope.showMnemonic=false;
    };

    $scope.setFirstMnemonic = function(){
      $scope.currentMnemonic = comService.getFirstMnemonic($scope.currentWord.word_id);
    };

    $scope.setNextMnemonic = function(){
      $scope.currentMnemonic = comService.getNextMnemonic($scope.currentWord.word_id);
    };

    $scope.setPrevMnemonic = function(){
      $scope.currentMnemonic = comService.getPrevMnemonic($scope.currentWord.word_id);
    };

    $scope.currentWord = comService.getRandomWord();

    try {
      $scope.currentMnemonic = comService.getMnemonic($scope.currentWord.word_id, $scope.mnemonicIndex);
    }
    catch (e){console.log("error getting mnemonic for word")}

    $rootScope.$on('ts', function(){
      setTimeout(function() {
        $scope.setFirstMnemonic();
        $scope.$apply();
        console.log('ts picked up by test screen');
      },600);


    });


  });
})();
