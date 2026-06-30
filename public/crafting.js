// crafting.js

// 1. Define what blocks are required to make new items
const CRAFTING_RECIPES = {
    // Recipe ID matches the item block ID it will produce
    // Let's assume ID 10 is your 'Crafting Table Block' item
    10: {
        name: "Crafting Table",
        requirements: { 4: 4 } // Needs 4 Wood blocks (ID 4)
    }
};

// 2. The main crafting action handler
function craftItem(recipeId) {
    const recipe = CRAFTING_RECIPES[recipeId];
    if (!recipe) {
        console.error("Recipe not found for ID:", recipeId);
        return;
    }

    // Check if the global inventory exists
    if (typeof inventory === 'undefined' || typeof hotbarSlots === 'undefined') {
        alert("Game inventory system is not fully loaded yet!");
        return;
    }

    // 3. Verify player has enough materials
    let canCraft = true;
    for (let materialId in recipe.requirements) {
        let requiredQty = recipe.requirements[materialId];
        if ((inventory[materialId] || 0) < requiredQty) {
            canCraft = false;
            break;
        }
    }

    // 4. If they pass the check, craft it!
    if (canCraft) {
        // Take away the ingredients
        for (let materialId in recipe.requirements) {
            inventory[materialId] -= recipe.requirements[materialId];
        }

        // Try to place the newly created item directly into an empty hotbar slot (0 = empty)
        let emptySlot = hotbarSlots.indexOf(0);
        
        if (emptySlot !== -1) {
            hotbarSlots[emptySlot] = parseInt(recipeId);
            alert(`Crafted ${recipe.name}! Added directly to your hotbar.`);
        } else {
            // Otherwise, store it into your global inventory object bank
            inventory[recipeId] = (inventory[recipeId] || 0) + 1;
            alert(`Crafted ${recipe.name}! Added to your inventory stack.`);
        }

        // 5. Force the game window rendering loops to refresh instantly
        if (typeof updateUI === 'function') updateUI();
        if (typeof buildInventoryGrid === 'function') buildInventoryGrid();
        
    } else {
        alert(`Missing items! You need more materials to craft a ${recipe.name}.`);
    }
}

// Make sure the browser HTML page can see this function globally
window.craftItem = craftItem;