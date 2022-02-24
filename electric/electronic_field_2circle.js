(function() {

  'use strict';

	angular.module('myApp',['chart.js', 'ui.bootstrap'])
	.config(['$qProvider', MainConfig])
	.controller('MainController', MainController);
	
	function MainConfig($qProvider) {
		$qProvider.errorOnUnhandledRejections(false);
	}
	
	function MainController($scope, $timeout, $uibModal){
		
		var vm            = this;
		vm.d              = [];
		vm.w              = [];
		vm.i              = [];
		vm.theta          = [];
		vm.eInterp        = eInterp;
		vm.rInterp        = rInterp;
		vm.plotFirst5Rows = plotFirst5Rows;
		vm.plotLast1Rows  = plotLast1Rows;
		vm.BrmFunc        = Brm;
		vm.selectModel    = true;
		vm.selectShield   = true;
		vm.yReal          = yRealChange;
		vm.yRealChange    = yRealChange;
		vm.phaseAngle     = phaseAngle;
		vm.H              = 1.6;
		vm.T              = 1;
		vm.d[0]           = 4.4;
		vm.d[1]           = 4.4;
		vm.w[0]           = 8.5;
		vm.w[1]           = 8.5;
		vm.w[2]           = 8.5;
		vm.i[0]           = 1000;
		vm.i[1]           = 1000;
		vm.i[2]           = 1000;
		vm.i[3]           = 1000;
		vm.i[4]           = 1000;
		vm.i[5]           = 1000;
		vm.theta[0]       = "R";
		vm.theta[1]       = "S";
		vm.theta[2]       = "T";
		vm.theta[3]       = "T";
		vm.theta[4]       = "S";
		vm.theta[5]       = "R";
		vm.frequency      = 60;
		vm.permeabilityR  = 60000;
		vm.conductivity   = 1.725E06;
		vm.thickness			= 0.000356;
		vm.conductorSpace = 0.15;
		vm.observePoint   = 0.01
		
		vm.noted = noted;
		vm.yReal = yRealChange(vm);
		vm.x = BrmDistribution(vm).x;
		vm.y = BrmDistribution(vm).y;
		vm.Brm = BrmDistribution(vm).Brm;

		BrmDistribution(vm)
		
		plotFirst5Rows(vm)
		plotLast1Rows(vm)
		$("#drawing").click(function() {
			$timeout(function () {
				vm.yReal = yRealChange(vm);
				vm.x = BrmDistribution(vm).x;
				vm.y = BrmDistribution(vm).y;
				vm.Brm = BrmDistribution(vm).Brm;
				plotFirst5Rows(vm)
				plotLast1Rows(vm)
			}, 0);
		});
		
		vm.openModal = function() {
			var modalInstance = $uibModal.open({
				templateUrl: "../pop/modal.html",
				controller: function ($scope, $uibModalInstance) {
					$scope.data = vm;
					$scope.ok = function () {
						$uibModalInstance.close();
					};
				
					$scope.cancel = function () {
						$uibModalInstance.dismiss('cancel');
					};					
				}
			}).result.catch(function(res) {
				 if (!(res === 'cancel' || res === 'escape key press')) {
					    throw res;
				 }
				
			});
		}
			
	}

function openModal() {
	var modalInstance = $uibModal.open({
		templateUrl: "../pop/modal.html",
		controller: function ($scope, $uibModalInstance) {
			$scope.ok = function () {
				$uibModalInstance.close();
			};
		
			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};					
		}
	}).result.catch(function(res) {
		 if (!(res === 'cancel' || res === 'escape key press')) {
			    throw res;
		 }
		
	});	
}
	
function eInterp(vm) {
	vm.yReal = yRealChange(vm);
	//console.log(Brm(vm, vm.T, vm.yReal))
	return Brm(vm, vm.T, vm.yReal)
}

function rInterp(vm) {
	vm.yReal = yRealChange(vm);
	return Math.sqrt(Math.pow(vm.T,2) + Math.pow(vm.yReal,2))
}

function plotFirst5Rows(vm){
	var series_5 = []
	var rows_5 = [];
	var x_5 = vm.x;
	var y = vm.y;	
	var Brm = vm.Brm;
	for (var i = 1; i <= y.length - 1; i++){
		if(vm.selectModel) {
			if (i == y.length - 1) {
				series_5.push(['距離線下' + y[i].toFixed(4) + '公尺'])
			} else {	
				series_5.push(['距離線下' + roundX(y[i], 1) + '公尺'])
			}
		} else {
			if (i == y.length - 1) {
				series_5.push(['距離線上' + y[i].toFixed(4) + '公尺'])
			} else {	
				series_5.push(['距離線上' + roundX(y[i], 1) + '公尺'])
			}
		}
		rows_5.push(Brm[i])
	}
	for (var i = 0; i <= x_5.length - 1; i++){
		x_5[i] = roundX(x_5[i], 2);
	}
	vm.series_5 = series_5;
	vm.rows_5 = rows_5;
	vm.x_5 = x_5;
	vm.options_5 = {
		legend:{
			display: true,
			position: 'bottom',
			labels: {fontColor: "#0f0080", fontStyle: 'Bold', fontSize: 18, fontFamily: 'Microsoft JhengHei'},
		},
		elements:{
			line: {fill: false},
			point: {radius: 0}
		},
		scales: {
			yAxes: [{ticks: {fontSize: 18, fontColor: '#000000', fontStyle: 'Bold'}}],
			xAxes: [{ticks: {minTicksLimit: 5, maxTicksLimit: 10, fontSize: 18, fontColor: '#000000', fontStyle: 'Bold'}}]
		}		
	};
	vm.datasetOverride_5 = [
		{borderWidth: 3, backgroundColor: '#00f0e8', borderColor: '#00f0e8'},
		{borderWidth: 3, backgroundColor: '#38f000', borderColor: '#38f000'},
		{borderWidth: 3, backgroundColor: '#0018f0', borderColor: '#0018f0'},
		{borderWidth: 3, backgroundColor: '#140101', borderColor: '#140101'},
		{borderWidth: 3, backgroundColor: '#f00080', borderColor: '#f00080'}
	];
}

function plotLast1Rows(vm) {
	var T, H, Nx, dx
	var x = [];
	var BrmArray = [];
	var rows_last = [];
	T = parseFloat(vm.T)
	H = vm.yReal
	
	Nx = 10
	dx = Math.abs(T) / Nx
	x[0] = 0;
	BrmArray[0] = vm.BrmFunc(vm, x[0], H).Brm
	for(var i = 1; i <= Nx; i++){
		x.push(roundX(x[i-1] + dx, 2))
		BrmArray.push(vm.BrmFunc(vm, x[i], H).Brm)
	}
	rows_last.push(BrmArray)
	vm.rows_last = rows_last
	vm.x_last = x
	if (vm.selectModel) {
		vm.series_last = ['距離線下' + H.toFixed(4) + '公尺']
	} else {
		vm.series_last = ['距離線上' + H.toFixed(4) + '公尺']
	}
	vm.options_last = {
		legend:{
			display: true,
			position: 'bottom',
			labels: {fontColor: '#f00080', fontStyle: 'Bold', fontSize: 18, fontFamily: 'Microsoft JhengHei'},
		},
		elements:{
			line: {fill: false},
			point: {radius: 0}
		},
		scales: {
			yAxes: [{ticks: {fontSize: 18, fontColor: '#000000', fontStyle: 'Bold'}}],
			xAxes: [{ticks: {min: 0, minTicksLimit: 5, maxTicksLimit: 10, fontSize: 18, fontColor: '#000000', fontStyle: 'Bold'}}]
		}
	};
	vm.datasetOverride_last = [
		{
			borderWidth: 3,
			backgroundColor: '#f00080',
			borderColor: '#f00080'
		}
	];
}

function roundX(val, precision) {
  return Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) / Math.pow(10, (precision || 0));
}

function noted() {
	return "相角請輸入R(120度)、S(0度)、T(-120度)。I1、I2、I3為右回路，I4、I5、I6為左回路，相角不能重覆。"
}

function yRealChange(vm) {
	if (vm.selectShield) {
		return vm.H - vm.thickness - vm.observePoint;
	} else {
		return vm.H
	}
}

})();




