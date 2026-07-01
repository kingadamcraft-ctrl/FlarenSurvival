const CHUNK_SIZE = 16;
const CHUNK_HEIGHT = 128;
const SEA_LEVEL = 32;
const RENDER_DISTANCE = 4;
const SEED_OFFSET_X = Math.random() * 50000 + 12345;
        const SEED_OFFSET_Y = Math.random() * 50000 + 23456;
        const SEED_OFFSET_Z = Math.random() * 50000 + 34567;

        function getNoise2D(x, z, scale = 0.006) {
            let nx = x + SEED_OFFSET_X;
            let nz = z + SEED_OFFSET_Y;
            return (Math.sin(nx * scale) * Math.cos(nz * scale) * 0.55 +
                    Math.sin(nx * scale * 2.8) * Math.sin(nz * scale * 2.1) * 0.35);
        }

        function getNoise3D(x, y, z, scaleX = 0.02, scaleY = 0.03, scaleZ = 0.02) {
            let nx = x + SEED_OFFSET_X;
            let ny = y + SEED_OFFSET_Y;
            let nz = z + SEED_OFFSET_Z;
            return (Math.sin(nx * scaleX) * Math.cos(ny * scaleY) * Math.sin(nz * scaleZ) * 0.4 +
                    Math.sin(nx * scaleX * 2.1) * Math.sin(ny * scaleY * 1.8) * Math.cos(nz * scaleZ * 2.3) * 0.2);
        }

        function hash2D(x, z) {
            let h = Math.sin((x + SEED_OFFSET_X) * 12.9898 + (z + SEED_OFFSET_Y) * 78.233) * 43758.5453123;
            return h - Math.floor(h);
        }

        // BIOME WEIGHTS: 1. Forest (Most Common) | 2. Cherry Hills (Second) | 3. Steep Mountains (Third) | 4. Plains
        function getBiomeType(x, z) {
            let v = (getNoise2D(x, z, 0.003) + 1) * 0.5; 
            if (v < 0.40) return 'FOREST';
            if (v < 0.72) return 'CHERRY_HILLS'; 
            if (v < 0.90) return 'MOUNTAINS';
            return 'PLAINS';
        }

        function getNoiseHeight(x, z) {
            let biome = getBiomeType(x, z);
            let baseHeight = SEA_LEVEL + 4;

            if (biome === 'PLAINS') {
                baseHeight += (getNoise2D(x, z, 0.015) + 0.5) * 4;
            } else if (biome === 'FOREST') {
                baseHeight += 4 + (getNoise2D(x, z, 0.01) + 0.5) * 8;
            } else if (biome === 'CHERRY_HILLS') {
                // TALL STEEP HILLS FOR CHERRY TREES
                let hillNoise = Math.abs(getNoise2D(x, z, 0.012));
                baseHeight += 12 + Math.pow(hillNoise * 2.5, 1.8) * 28;
            } else if (biome === 'MOUNTAINS') {
                // EXTREMELY RUGGED STEED MOUNTAINS
                let mountNoise = Math.abs(getNoise2D(x, z, 0.007) + getNoise2D(x, z, 0.02) * 0.25);
                baseHeight += 16 + Math.pow(mountNoise * 3.0, 2.2) * 62;
            }

            // FLUID WATERWAYS: Lakes, Rivers, and Ravines integrated into ALL biomes
            let riverNoise = Math.abs(getNoise2D(x, z, 0.008));
            if (riverNoise < 0.05) {
                let targetFloor = SEA_LEVEL - 6;
                let t = riverNoise / 0.05;
                baseHeight = THREE.MathUtils.lerp(targetFloor, baseHeight, Math.pow(t, 0.6));
            }
            return baseHeight;
        }