import {Vector3} from 'three';
import {wrapPhysicsPrototype, onCopy, onWrap} from './physicsPrototype';

class API {
  applyCentralImpulse(force) {
    this.execute('applyCentralImpulse', {id: this.data.id, x: force.x, y: force.y, z: force.z});
  }

  applyImpulse(force, offset) {
    this.execute('applyImpulse', {
      id: this.data.id,
      impulse_x: force.x,
      impulse_y: force.y,
      impulse_z: force.z,
      x: offset.x,
      y: offset.y,
      z: offset.z
    });
  }

  applyTorque(force) {
    this.execute('applyTorque', {
      id: this.data.id,
      torque_x: force.x,
      torque_y: force.y,
      torque_z: force.z
    });
  }

  applyCentralForce(force) {
    this.execute('applyCentralForce', {
      id: this.data.id,
      x: force.x,
      y: force.y,
      z: force.z
    });
  }

  applyForce(force, offset) {
    this.execute('applyForce', {
      id: this.data.id,
      force_x: force.x,
      force_y: force.y,
      force_z: force.z,
      x: offset.x,
      y: offset.y,
      z: offset.z
    });
  }

  getAngularVelocity() {
    return this.data.angularVelocity;
  }

  setAngularVelocity(velocity) {
    this.execute(
      'setAngularVelocity',
      {id: this.data.id, x: velocity.x, y: velocity.y, z: velocity.z}
    );
  }

  getLinearVelocity() {
    return this.data.linearVelocity;
  }

  setLinearVelocity(velocity) {
    this.execute(
      'setLinearVelocity',
      {id: this.data.id, x: velocity.x, y: velocity.y, z: velocity.z}
    );
  }

  setAngularFactor(factor) {
    this.execute(
      'setAngularFactor',
      {id: this.data.id, x: factor.x, y: factor.y, z: factor.z}
    );
  }

  setLinearFactor(factor) {
    this.execute(
      'setLinearFactor',
      {id: this.data.id, x: factor.x, y: factor.y, z: factor.z}
    );
  }

  setDamping(linear, angular) {
    this.execute(
      'setDamping',
      {id: this.data.id, linear, angular}
    );
  }

  setCcdMotionThreshold(threshold) {
    this.execute(
      'setCcdMotionThreshold',
      {id: this.data.id, threshold}
    );
  }

  setCcdSweptSphereRadius(radius) {
    this.execute('setCcdSweptSphereRadius', {id: this.data.id, radius});
  }
}

export default class extends API {
  static rigidbody = () => ({
    touches: [],
    linearVelocity: new Vector3(),
    angularVelocity: new Vector3(),
    mass: 10,
    scale: new Vector3(1, 1, 1),
    restitution: 0.3,
    friction: 0.8,
    damping: 0,
    margin: 0
  });

  static softbody = () => ({
    touches: [],
    restitution: 0.3,
    friction: 0.8,
    damping: 0,
    scale: new Vector3(1, 1, 1),
    pressure: 100,
    margin: 0,
    klst: 0.9,
    kvst: 0.9,
    kast: 0.9,
    piterations: 1,
    viterations: 0,
    diterations: 0,
    citerations: 4,
    anchorHardness: 0.7,
    rigidHardness: 1,
    isSoftbody: true,
    isSoftBodyReset: false
  });

  static rope = () => ({
    touches: [],
    friction: 0.8,
    scale: new Vector3(1, 1, 1),
    damping: 0,
    margin: 0,
    klst: 0.9,
    kvst: 0.9,
    kast: 0.9,
    piterations: 1,
    viterations: 0,
    diterations: 0,
    citerations: 4,
    anchorHardness: 0.7,
    rigidHardness: 1,
    isSoftbody: true
  });

  static cloth = () => ({
    touches: [],
    friction: 0.8,
    damping: 0,
    margin: 0,
    scale: new Vector3(1, 1, 1),
    klst: 0.9,
    kvst: 0.9,
    kast: 0.9,
    piterations: 1,
    viterations: 0,
    diterations: 0,
    citerations: 4,
    anchorHardness: 0.7,
    rigidHardness: 1
  });

  constructor(defaults, data) {
    super();
    this.data = Object.assign(defaults, data);
  }

  integrate(self) {
    wrapPhysicsPrototype(this);
  }

  manager(manager) {
    manager.define('physics');

    this.execute = (...data) => {
      return manager.has('module:world')
      ? manager.get('module:world').execute(...data)
      : () => {};
    };
  }

  updateData(callback) {
    this.bridge.geometry = function (geometry, module) {
      if (!callback) return geometry;

      const result = callback(geometry, module);
      return result ? result : geometry;
    }
  }

  clone(manager) {
    const clone = new this.constructor();
    clone.data = {...this.data};
    clone.bridge.geometry = this.bridge.geometry;
    this.manager.apply(clone, [manager]);

    return clone;
  }

  bridge = {
    onCopy,
    onWrap
  };
}
