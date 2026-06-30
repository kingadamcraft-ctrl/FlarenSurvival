(function() {
    // Generates a multi-part voxel pig using native Three.js boxes
    function createVoxelPigMesh() {
        const pigGroup = new THREE.Group();

        // 1. Setup materials
        const pinkMat = new THREE.MeshLambertMaterial({ color: 0xffb6c1 }); // Light pink body
        const darkPinkMat = new THREE.MeshLambertMaterial({ color: 0xe5989b }); // Modified: A tighter, deeper pink for the nose
        const blackMat = new THREE.MeshLambertMaterial({ color: 0x000000 }); // Eyes

        // 2. Main Body (Width, Height, Depth)
        const bodyGeo = new THREE.BoxGeometry(0.8, 0.7, 1.2);
        const body = new THREE.Mesh(bodyGeo, pinkMat);
        body.position.set(0, 0.6, 0);
        body.castShadow = true;
        body.receiveShadow = true;
        pigGroup.add(body);

        // 3. Head
        const headGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const head = new THREE.Mesh(headGeo, pinkMat);
        head.position.set(0, 0.9, 0.7);
        head.castShadow = true;
        pigGroup.add(head);

        // 4. Snout (Modified: Shallower depth of 0.1 instead of 0.2, shifted to 1.0)
        const snoutGeo = new THREE.BoxGeometry(0.3, 0.2, 0.1);
        const snout = new THREE.Mesh(snoutGeo, darkPinkMat);
        snout.position.set(0, 0.8, 1.0);
        snout.castShadow = true;
        pigGroup.add(snout);

        // 5. Eyes (Left and Right)
        const eyeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.05);
        
        const leftEye = new THREE.Mesh(eyeGeo, blackMat);
        leftEye.position.set(-0.25, 0.95, 1.01);
        pigGroup.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeo, blackMat);
        rightEye.position.set(0.25, 0.95, 1.01);
        pigGroup.add(rightEye);

        // 6. Legs (Front Left, Front Right, Back Left, Back Right)
        const legGeo = new THREE.BoxGeometry(0.2, 0.4, 0.2);
        
        const legFL = new THREE.Mesh(legGeo, pinkMat);
        legFL.position.set(-0.25, 0.2, 0.4);
        legFL.castShadow = true;
        pigGroup.add(legFL);

        const legFR = new THREE.Mesh(legGeo, pinkMat);
        legFR.position.set(0.25, 0.2, 0.4);
        legFR.castShadow = true;
        pigGroup.add(legFR);

        const legBL = new THREE.Mesh(legGeo, pinkMat);
        legBL.position.set(-0.25, 0.2, -0.4);
        legBL.castShadow = true;
        pigGroup.add(legBL);

        const legBR = new THREE.Mesh(legGeo, pinkMat);
        legBR.position.set(0.25, 0.2, -0.4);
        legBR.castShadow = true;
        pigGroup.add(legBR);

        // Save reference to legs for walking animations
        pigGroup.userData = { legs: [legFL, legFR, legBL, legBR] };

        return pigGroup;
    }

    class MobManager {
        constructor(scene, getBlockAt) {
            this.scene = scene;
            this.getBlockAt = getBlockAt;
            this.mobs = [];
        }

        spawnMob(x, y, z) {
            // Instantly builds a proper multi-part pig group mesh!
            const visualMesh = createVoxelPigMesh();

            visualMesh.position.set(x, y, z);
            this.scene.add(visualMesh);

            const mob = {
                mesh: visualMesh,
                velocity: new THREE.Vector3((Math.random() - 0.5) * 2, 0, (Math.random() - 0.5) * 2),
                isGrounded: false,
                jumpTimer: Math.random() * 2,
                changeDirTimer: Math.random() * 3,
                walkCycle: Math.random() * 100 
            };

            this.mobs.push(mob);
        }

        update(delta) {
            if (!delta || delta <= 0) return;

            this.mobs.forEach(mob => {
                // AI Wandering Paths
                mob.changeDirTimer -= delta;
                if (mob.changeDirTimer <= 0) {
                    mob.velocity.x = (Math.random() - 0.5) * 2;
                    mob.velocity.z = (Math.random() - 0.5) * 2;
                    mob.changeDirTimer = Math.random() * 4 + 2;
                }

                // Gravity physics
                mob.velocity.y -= 9.8 * delta;

                // Move coordinates
                mob.mesh.position.x += mob.velocity.x * delta;
                mob.mesh.position.y += mob.velocity.y * delta;
                mob.mesh.position.z += mob.velocity.z * delta;

                // Block floor check
                const floorY = Math.floor(mob.mesh.position.y);
                const blockUnder = this.getBlockAt(mob.mesh.position.x, floorY, mob.mesh.position.z);

                if (blockUnder && blockUnder !== 0) {
                    if (mob.mesh.position.y < floorY + 1) {
                        mob.mesh.position.y = floorY + 1;
                        mob.velocity.y = 0;
                        mob.isGrounded = true;
                    }
                } else {
                    mob.isGrounded = false;
                }

                // AI Hop over obstacles
                if (mob.isGrounded) {
                    mob.jumpTimer -= delta;
                    
                    const forwardX = mob.mesh.position.x + (mob.velocity.x > 0 ? 0.6 : -0.6);
                    const forwardZ = mob.mesh.position.z + (mob.velocity.z > 0 ? 0.6 : -0.6);
                    const blockInFront = this.getBlockAt(forwardX, Math.floor(mob.mesh.position.y), forwardZ);

                    if ((blockInFront && blockInFront !== 0) || mob.jumpTimer <= 0) {
                        mob.velocity.y = 4.5; 
                        mob.isGrounded = false;
                        mob.jumpTimer = Math.random() * 3 + 1;
                    }
                }

                // Handle body orientation and leg swing animation
                if (Math.abs(mob.velocity.x) > 0.01 || Math.abs(mob.velocity.z) > 0.01) {
                    const angle = Math.atan2(mob.velocity.x, mob.velocity.z);
                    mob.mesh.rotation.y = angle;

                    // Leg swing calculation
                    mob.walkCycle += delta * 8;
                    if (mob.mesh.userData && mob.mesh.userData.legs) {
                        const legs = mob.mesh.userData.legs;
                        legs[0].rotation.x = Math.sin(mob.walkCycle) * 0.5; // Front Left
                        legs[1].rotation.x = -Math.sin(mob.walkCycle) * 0.5; // Front Right
                        legs[2].rotation.x = -Math.sin(mob.walkCycle) * 0.5; // Back Left
                        legs[3].rotation.x = Math.sin(mob.walkCycle) * 0.5; // Back Right
                    }
                } else {
                    // Stop swinging legs if standing completely still
                    if (mob.mesh.userData && mob.mesh.userData.legs) {
                        mob.mesh.userData.legs.forEach(leg => leg.rotation.x = 0);
                    }
                }
            });
        }
    }

    // Attach cleanly to global scope
    window.MobManager = MobManager;
})();