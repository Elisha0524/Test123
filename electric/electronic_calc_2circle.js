'use strict';

function BrmDistribution(vm) {
	var temp = []
	var profile = {Brm:[], x:[], y:[]}
	var T, H, Nx, Ny, dx, dy
	var x = [];
	var y = [];
	T = parseFloat(vm.T)
	H = parseFloat(vm.yReal)
	
	Nx = 25
	Ny = 5
	
	dx = 2 * T / (Nx - 1)
	dy = H / (Ny - 1)
	
	x[0] = -T;
	y[0] = 0;
	
	for(var i=1;i<=Nx-1;i++){
		x.push(x[i-1] + dx)
	}
	for(var i=1;i<=Ny-1;i++) {
		y.push(y[i-1] + dy)
	}
		
	for(var j=0;j<=Ny-1;j++){
		for(var i=0;i<=Nx-1;i++){
			temp.push(Brm(vm, x[i], y[j]).Brm)
		}
		profile.Brm.push(temp)
		temp = []
	}
	
	profile.x = x;
	profile.y = y;
	return profile
}

function Brm(vm, x, y) {
	var temp, permeability, p;
	var param = {};
	x = parseFloat(x);
	y = parseFloat(y);
	temp = magneticModel(vm, x, y);
	param.permeability = 4*Math.PI*0.0000001;
	param.frequency = vm.frequency;
	param.relativePermeability = vm.permeabilityR;
	param.shieldThickness = vm.thickness;
	param.conductivity = vm.conductivity
	param.skinDepth = 1/Math.sqrt(Math.PI*param.frequency*param.conductivity*param.permeability*param.relativePermeability)
	param.skinDepthRatio = param.shieldThickness/param.skinDepth;
	param.conductorSpacing = vm.conductorSpace;
	param.kup = 3/vm.yReal;
	param.wup = param.kup*param.relativePermeability*param.skinDepth;
	
	if (vm.selectShield) {
		p = imsub(imexp(immul(complexMerge(1,1), param.skinDepthRatio)), imexp(immul(complexMerge(1,1), -param.skinDepthRatio)))
		p = imdiv(1,p);
	} else {
		p = 2;
	}
	temp.Bx = 0;
	temp.By = 0;
	if (vm.selectShield) {
		if (param.wup > 1) {
			p = immul(8 * Math.sqrt(6) * param.conductorSpacing / (param.relativePermeability * param.skinDepth), p)
			for (var k=0;k<=vm.i.length-1; k++) {

					temp.Bx = imsub(temp.Bx,immul(immul(p,vm.i[k]*Math.sin(temp.phi[k])/temp.R[k]),
										complexMerge(Math.cos(phaseAngle(vm.theta[k])/180*Math.PI),Math.sin(phaseAngle(vm.theta[k])/180*Math.PI))))
										
					temp.By = imsum(temp.By,immul(immul(p,vm.i[k]*Math.cos(temp.phi[k])/temp.R[k]),
										complexMerge(Math.cos(phaseAngle(vm.theta[k])/180*Math.PI),Math.sin(phaseAngle(vm.theta[k])/180*Math.PI))))
			}
		} else {
			p = immul(8 * Math.sqrt(6) * param.conductorSpacing * (param.relativePermeability * param.skinDepth), p)
			for (var k=0;k<=vm.i.length-1; k++) {
					
					temp.Bx = imsub(temp.Bx,immul(immul(p,vm.i[k]*Math.sin(temp.phi[k])/Math.pow(temp.R[k],3)),
										complexMerge(Math.cos(phaseAngle(vm.theta[k])/180*Math.PI),Math.sin(phaseAngle(vm.theta[k])/180*Math.PI))))
								
					temp.By = imsum(temp.By,immul(immul(p,vm.i[k]*Math.cos(temp.phi[k])/Math.pow(temp.R[k],3)),
										complexMerge(Math.cos(phaseAngle(vm.theta[k])/180*Math.PI),Math.sin(phaseAngle(vm.theta[k])/180*Math.PI))))
			}
		}
	} else {
		for (var k=0;k<=vm.i.length-1; k++) {
				
				temp.Bx = imsub(temp.Bx,immul(immul(p,vm.i[k]*Math.sin(temp.phi[k])/temp.R[k]),
									complexMerge(Math.cos(phaseAngle(vm.theta[k])/180*Math.PI),Math.sin(phaseAngle(vm.theta[k])/180*Math.PI))))
									
				temp.By = imsum(temp.By,immul(immul(p,vm.i[k]*Math.cos(temp.phi[k])/temp.R[k],3),
									complexMerge(Math.cos(phaseAngle(vm.theta[k])/180*Math.PI),Math.sin(phaseAngle(vm.theta[k])/180*Math.PI))))
		}
	}
	temp.Brm = Math.sqrt(Math.pow(complexSperate(temp.Bx)[0],2) + Math.pow(complexSperate(temp.Bx)[1],2) +
										   Math.pow(complexSperate(temp.By)[0],2) + Math.pow(complexSperate(temp.By)[1],2));
	return temp
}

function magneticModel(vm, x, y) {
	var temp = {R:[], phi:[]}
	temp.x = x;
	temp.y = y;
	console.log(vm)
	if (vm.selectModel) {
		temp.R[0] = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		temp.R[1] = Math.sqrt(Math.pow(x, 2) + Math.pow((y + vm.d[0]), 2))
		temp.R[2] = Math.sqrt(Math.pow(x, 2) + Math.pow((y + vm.d[0] + vm.d[1]), 2))
		temp.R[3] = Math.sqrt(Math.pow((x + vm.w[0]), 2) + Math.pow(y, 2));
		temp.R[4] = Math.sqrt(Math.pow((x + vm.w[1]), 2) + Math.pow((y + vm.d[0]), 2));
		temp.R[5] = Math.sqrt(Math.pow((x + vm.w[2]), 2) + Math.pow((y + vm.d[0] + vm.d[1]), 2));	
	} else {
		temp.R[0] = Math.sqrt(Math.pow(x, 2) + Math.pow((y + vm.d[0] + vm.d[1]), 2));
		temp.R[1] = Math.sqrt(Math.pow(x, 2) + Math.pow((y + vm.d[1]), 2))
		temp.R[2] = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
		temp.R[3] = Math.sqrt(Math.pow((x + vm.w[0]), 2) + Math.pow((y + vm.d[0] + vm.d[1]), 2));
		temp.R[4] = Math.sqrt(Math.pow((x + vm.w[1]), 2) + Math.pow((y + vm.d[1]), 2));
		temp.R[5] = Math.sqrt(Math.pow((x + vm.w[2]), 2) + Math.pow(y, 2));
	}
	temp.phi[0] = Math.acos(x / temp.R[0])
	temp.phi[1] = Math.acos(x / temp.R[1])
	temp.phi[2] = Math.acos(x / temp.R[2])
	temp.phi[3] = Math.acos((x + vm.w[0]) / temp.R[3])
	temp.phi[4] = Math.acos((x + vm.w[1]) / temp.R[4])
	temp.phi[5] = Math.acos((x + vm.w[2]) / temp.R[5])
	
	return temp;
}

function phaseAngle(angle) {
    if (angle == "R") {return 120}
    else if (angle == "S") {return 0}
    else if (angle == "T") {return -120}
    else {return "Please Input R or S or T"}
}




