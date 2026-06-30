// js/structures.js

/**
 * Helper function to anchor any trunk block down to the actual ground
 */
function anchorTrunkToGround(proceduralStructures, x, baseY, z, logType) {
    // Loop downwards from just below the tree base to fill any floating gaps
    let checkY = baseY - 1;
    // We limit it to 15 blocks down so it doesn't loop infinitely into the void
    for (let i = 0; i < 15; i++) {
        const key = `${x},${checkY},${z}`;
        
        // If there's already a block here (like grass or stone), stop extending roots!
        if (proceduralStructures.has(key)) break;
        
        // Place a log block to act as a solid root support
        proceduralStructures.set(key, logType);
        checkY--;
    }
}

/**
 * Generates a standard 1x1 trunk tree (Oak or Cherry)
 */
function generateStandardTree(proceduralStructures, baseX, baseY, baseZ, isCherry, hashFunc) {
    const rand = hashFunc(baseX, baseZ);
    let height = 5 + Math.floor(rand * 4); 
    let logType = isCherry ? 8 : 4;
    let leafType = isCherry ? 9 : 5;
    
    // ROOT FIX: Ensure the single trunk is anchored down the cliffside
    anchorTrunkToGround(proceduralStructures, baseX, baseY, baseZ, logType);
    
    // Trunk
    for (let y = 0; y < height; y++) {
        proceduralStructures.set(`${baseX},${baseY + y},${baseZ}`, logType);
    }
    
    // Canopy
    let leafTopY = baseY + height;
    for (let ox = -2; ox <= 2; ox++) {
        for (let oz = -2; oz <= 2; oz++) {
            for (let oy = -2; oy <= 2; oy++) {
                let currentLeafY = leafTopY + oy;
                if (Math.abs(ox) === 2 && Math.abs(oz) === 2 && oy > -1) continue;
                if (oy === 2 && (Math.abs(ox) > 1 || Math.abs(oz) > 1)) continue;

                const key = `${baseX + ox},${currentLeafY},${baseZ + oz}`;
                if (!proceduralStructures.has(key)) proceduralStructures.set(key, leafType);
            }
        }
    }
}

/**
 * Generates a 2x2 wide, 12 block tall tree with a Minecraft Jungle-style canopy!
 */
function generateMegaTree(proceduralStructures, baseX, baseY, baseZ, logType = 4, leafType = 5) {
    let height = 12; // Height of the giant trunk
    
    // ROOT FIX: Check all 4 columns of the 2x2 trunk and extend them down to solid ground individually!
    anchorTrunkToGround(proceduralStructures, baseX, baseY, baseZ, logType);
    anchorTrunkToGround(proceduralStructures, baseX + 1, baseY, baseZ, logType);
    anchorTrunkToGround(proceduralStructures, baseX, baseY, baseZ + 1, logType);
    anchorTrunkToGround(proceduralStructures, baseX + 1, baseY, baseZ + 1, logType);
    
    // 1. Build the 2x2 Thick Trunk
    for (let y = 0; y < height; y++) {
        proceduralStructures.set(`${baseX},${baseY + y},${baseZ}`, logType);
        proceduralStructures.set(`${baseX + 1},${baseY + y},${baseZ}`, logType);
        proceduralStructures.set(`${baseX},${baseY + y},${baseZ + 1}`, logType);
        proceduralStructures.set(`${baseX + 1},${baseY + y},${baseZ + 1}`, logType);
    }
    
    // 2. Main Jungle Dome Canopy on the very top
    let topY = baseY + height;

    // Layer +2 (The tiny top button)
    for (let x = -1; x <= 2; x++) {
        for (let z = -1; z <= 2; z++) {
            proceduralStructures.set(`${baseX + x},${topY + 2},${baseZ + z}`, leafType);
        }
    }

    // Layer +1 & 0 (The main wide layers with cut corners)
    for (let yOffset = 0; yOffset <= 1; yOffset++) {
        for (let x = -3; x <= 4; x++) {
            for (let z = -3; z <= 4; z++) {
                if ((x === -3 || x === 4) && (z === -3 || z === 4)) continue;
                if ((x === -3 || x === 4) && (z === -2 || z === 3)) continue;
                if ((x === -2 || x === 3) && (z === -3 || z === 4)) continue;

                proceduralStructures.set(`${baseX + x},${topY + yOffset},${baseZ + z}`, leafType);
            }
        }
    }

    // Layer -1 (The base skirt of the canopy)
    for (let x = -2; x <= 3; x++) {
        for (let z = -2; z <= 3; z++) {
            if ((x === -2 || x === 3) && (z === -2 || z === 3)) continue; // Cut corners
            proceduralStructures.set(`${baseX + x},${topY - 1},${baseZ + z}`, leafType);
        }
    }

    // 3. Side Branches
    spawnLeafClump(proceduralStructures, baseX - 2, topY - 4, baseZ, leafType);
    spawnLeafClump(proceduralStructures, baseX + 3, topY - 6, baseZ + 1, leafType);
}

/**
 * Helper function to create the tiny side leaf pods found on jungle trees
 */
function spawnLeafClump(proceduralStructures, cx, cy, cz, leafType) {
    for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
            for (let y = -1; y <= 0; y++) {
                const key = `${cx + x},${cy + y},${cz + z}`;
                proceduralStructures.set(key, leafType);
            }
        }
    }
}

// Make functions accessible globally
window.generateStandardTree = generateStandardTree;
window.generateMegaTree = generateMegaTree;