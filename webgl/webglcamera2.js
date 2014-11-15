function WebGLCamera(){
    this.mvMatrix    = mat4.create();
    this.orbitMatrix = mat4.create();
    this.eyeMatrix   = mat4.create();
    this.pMatrix     = mat4.create();
    this.nMatrix     = mat4.create();
    this.cMatrix     = mat4.create();
    
    this.aspectRatio = 1.6;
    this.fov         = 1.0;

    this.orbit = [0, 0, 0]; // where we are orbiting
    this.eye   = [0, 0, 0]; // where eye/camera is   

    this.orbitRotation = quat.create();
    this.eyeRotation   = quat.create();
    
    this.rotYaw     = 0;
    this.orbitYaw   = 0;
    this.orbitPitch = 0;

    this.far  = 2000;
    this.near = 0.1;
    this.up   = [0, 1, 0];
    //this.update();
}

WebGLCamera.prototype.setAspectRatio = function(aspect){
    this.aspectRatio = aspect;
};

WebGLCamera.prototype.update = function(isOrbit){    
    if(isOrbit) {
        var eye = vec3.create();
                
        vec3.sub(eye, this.eye, this.orbit);
        
        mat4.fromRotationTranslation(this.orbitMatrix, this.orbitRotation, this.orbit);
        mat4.fromRotationTranslation(this.eyeMatrix,   this.eyeRotation,   eye);        
        mat4.multiply(this.mvMatrix, this.orbitMatrix, this.eyeMatrix);
    }
    else {
        mat4.fromRotationTranslation(this.mvMatrix, this.eyeRotation, this.eye);    
    }
};

WebGLCamera.prototype.getModelViewMatrix = function () {
    mat4.invert(this.cMatrix, this.mvMatrix);
    return this.cMatrix;
};

WebGLCamera.prototype.getProjectionMatrix = function () {
    mat4.perspective(this.pMatrix, this.fov, this.aspectRatio, this.near, this.far);
    return this.pMatrix;
};

WebGLCamera.prototype.getNormalMatrix = function () {    
    var mvMatrix = this.getModelViewMatrix();
    var nMatrix  = this.nMatrix;

    mat4.copy(nMatrix, mvMatrix);
    mat4.invert(nMatrix, nMatrix);
    mat4.transpose(nMatrix, nMatrix);

    return nMatrix;
};

WebGLCamera.prototype.setOrbit = function (newOrbit) {        
    vec3.copy(this.orbit, newOrbit);
    this.update();
};

WebGLCamera.prototype.setEye = function (eye) {
    vec3.copy(this.eye, eye);
    this.update();
};

WebGLCamera.prototype.changeOrbitYaw = function(amount){
    var rotYaw = quat.create();
    
    quat.setAxisAngle(rotYaw, this.up, amount);
    quat.multiply(this.orbitRotation, rotYaw, this.orbitRotation);
    quat.normalize(this.orbitRotation, this.orbitRotation);
    
    this.orbitYaw += amount;
    
    this.update(true);
};


WebGLCamera.prototype.changeOrbitPitch = function(amount){
    quat.rotateX(this.orbitRotation, this.orbitRotation, amount);
    quat.normalize(this.orbitRotation, this.orbitRotation);
    
    this.update(true);
};

WebGLCamera.prototype.changeEyeYaw = function (amount) {    
    var rotYaw = quat.create();    
    quat.setAxisAngle(rotYaw, this.up, amount);
    quat.multiply(this.eyeRotation, rotYaw, this.eyeRotation);
    
    this.rotYaw += amount;
    
    this.update();
};

WebGLCamera.prototype.changeEyePitch = function (amount) {
    quat.rotateX(this.eyeRotation, this.eyeRotation, amount);
    quat.normalize(this.eyeRotation, this.eyeRotation);
    this.update();
};

WebGLCamera.prototype.MoveEye = function(x,y){
   
}

WebGLCamera.prototype._MoveEye = function (direction, velocity) {
        vec3.scale(direction, direction, velocity);
        vec3.sub(this.eye, this.eye, direction);
        this.update();
    };

//============================ Forward / Backward ============================//
WebGLCamera.prototype.MoveEyeForward = function (velocity) {
        var dir   = vec3.fromValues(0, 0, 0);
        var right = this.getEyeRightVector();
        
        vec3.cross(dir, right, this.up);
        vec3.normalize(dir, dir);
    
        this._MoveEye(dir, velocity);
        this.update();
    };

WebGLCamera.prototype.MoveEyeBackward = function (velocity) {
        var dir   = vec3.fromValues(0, 0, 0);
        var right = this.getEyeRightVector();
        
        vec3.cross(dir, right, this.up);
        vec3.normalize(dir, dir);
        vec3.negate(dir, dir);
    
        this._MoveEye(dir, velocity);        
        this.update();
    };   

//============================ Left/rigt/top/down ============================//

WebGLCamera.prototype.MoveEyeLeft = function (velocity) {
        this._MoveEye(this.getEyeLeftVector(), velocity);
    };

WebGLCamera.prototype.MoveEyeRight = function (velocity) {
        this._MoveEye(this.getEyeRightVector(), velocity);
    };    

WebGLCamera.prototype.MoveEyeUp = function (velocity) {
        this.eye[1] += velocity;
        this.update();
    };

WebGLCamera.prototype.MoveEyeDown = function (velocity) {
        this.eye[1] -= velocity;
        this.update();
    };


WebGLCamera.prototype.getEyeForwardVector = function () {
        var q  = this.eyeRotation;
        var qx = q[0], qy = q[1], qz = q[2], qw = q[3];

        var x =     2 * (qx * qz + qw * qy);
        var y =     2 * (qy * qx - qw * qx);
        var z = 1 - 2 * (qx * qx + qy * qy);

        return vec3.fromValues(x, y, z);
    };

WebGLCamera.prototype.getEyeBackwardVector = function () {
        var v = this.getEyeForwardVector();
        vec3.negate(v, v);
        return v;
    };    

WebGLCamera.prototype.getEyeRightVector = function () {
        var q  = this.eyeRotation;
        var qx = q[0], qy = q[1], qz = q[2], qw = q[3];

        var x = 1 - 2 * (qy * qy + qz * qz);
        var y =     2 * (qx * qy + qw * qz);
        var z =     2 * (qx * qz - qw * qy);

        return vec3.fromValues(x, y, z);
    };

WebGLCamera.prototype.getEyeLeftVector = function () {
        var v = this.getEyeRightVector();
        vec3.negate(v, v);
        return v;
    };

WebGLCamera.prototype.getEyeUpVector = function () {
        var q  = this.eyeRotation;
        var qx = q[0], qy = q[1], qz = q[2], qw = q[3];

        var x =     2 * (qx * qy - qw * qz);
        var y = 1 - 2 * (qx * qx + qz * qz);
        var z =     2 * (qy * qz + qw * qx);

        return vec3.fromValues(x, y, z);
    };

WebGLCamera.prototype.getEyeDownVector = function () {
        var v = this.getEyeUpVector();
        vec3.negate(v, v);
        return v;
    };