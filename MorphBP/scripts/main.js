import { world, system, ItemStack, DynamicPropertiesDefinition } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

const PROPERTY_UNLOCKS = "morph:unlocked";
const PROPERTY_CURRENT = "morph:current";
const MENU_ITEM_ID = "morph:menu_orb";
const MAX_STRING = 32767;

const MORPHABLE = [
  "minecraft:chicken",
  "minecraft:cow",
  "minecraft:pig",
  "minecraft:sheep",
  "minecraft:wolf",
  "minecraft:zombie",
  "minecraft:skeleton",
  "minecraft:spider",
  "minecraft:creeper",
  "minecraft:enderman",
  "minecraft:slime"
];

const activeMorphEntities = new Map();

world.beforeEvents.worldInitialize.subscribe((ev) => {
  const def = new DynamicPropertiesDefinition();
  def.defineString(PROPERTY_UNLOCKS, MAX_STRING);
  def.defineString(PROPERTY_CURRENT, 64);
  ev.propertyRegistry.registerEntityTypeDynamicProperties(def, "minecraft:player");
});

function parseUnlocks(player) {
  const raw = player.getDynamicProperty(PROPERTY_UNLOCKS);
  if (!raw || typeof raw !== "string") return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function saveUnlocks(player, unlocks) {
  player.setDynamicProperty(PROPERTY_UNLOCKS, JSON.stringify(unlocks));
}

function ensureMenuItem(player) {
  const inv = player.getComponent("inventory")?.container;
  if (!inv) return;
  const slot0 = inv.getItem(0);
  if (!slot0 || slot0.typeId !== MENU_ITEM_ID) {
    inv.setItem(0, new ItemStack(MENU_ITEM_ID, 1));
  }
}

function clearMorph(player) {
  player.setDynamicProperty(PROPERTY_CURRENT, "");
  player.removeEffect("invisibility");
  const id = player.id;
  const old = activeMorphEntities.get(id);
  if (old) {
    try { old.triggerEvent("minecraft:despawn"); } catch {}
    try { old.remove(); } catch {}
    activeMorphEntities.delete(id);
  }
}

function applyMorph(player, entityTypeId) {
  clearMorph(player);
  player.addEffect("invisibility", 20 * 60 * 60 * 24, { amplifier: 0, showParticles: false });
  player.setDynamicProperty(PROPERTY_CURRENT, entityTypeId);

  const entity = player.dimension.spawnEntity(entityTypeId, player.location);
  if (entity) {
    entity.nameTag = "";
    activeMorphEntities.set(player.id, entity);
  }
}

async function openMorphMenu(player) {
  const unlocked = parseUnlocks(player);
  const options = ["Zurück zum Spieler", ...unlocked.map((u) => u.replace("minecraft:", ""))];

  const form = new ActionFormData()
    .title("Morph-Menü")
    .body("Wähle einen freigeschalteten Mob")
    .button("§aZurück zum Spieler");

  for (const id of unlocked) {
    form.button(`§b${id.replace("minecraft:", "")}`);
  }

  const result = await form.show(player);
  if (result.canceled || result.selection === undefined) return;

  if (result.selection === 0) {
    clearMorph(player);
    player.sendMessage("§aDu bist wieder normal.");
    return;
  }

  const chosen = unlocked[result.selection - 1];
  if (!chosen) return;
  applyMorph(player, chosen);
  player.sendMessage(`§bMorph aktiv: ${chosen}`);
}

world.afterEvents.playerSpawn.subscribe((ev) => {
  if (!ev.initialSpawn) return;
  system.runTimeout(() => ensureMenuItem(ev.player), 20);
});

world.afterEvents.entityDie.subscribe((ev) => {
  const killer = ev.damageSource?.damagingEntity;
  const dead = ev.deadEntity;
  if (!killer || killer.typeId !== "minecraft:player" || !dead) return;
  if (dead.typeId === "minecraft:player") return;

  const player = killer;
  const unlocks = parseUnlocks(player);
  if (!MORPHABLE.includes(dead.typeId)) return;
  if (unlocks.includes(dead.typeId)) return;

  unlocks.push(dead.typeId);
  saveUnlocks(player, unlocks);
  player.sendMessage(`§aNeuer Morph freigeschaltet: ${dead.typeId}`);
});

world.afterEvents.itemUse.subscribe((ev) => {
  if (ev.itemStack?.typeId !== MENU_ITEM_ID) return;
  openMorphMenu(ev.source);
});

system.runInterval(() => {
  for (const player of world.getPlayers()) {
    ensureMenuItem(player);
    const morph = player.getDynamicProperty(PROPERTY_CURRENT);
    if (!morph || typeof morph !== "string") continue;

    const mob = activeMorphEntities.get(player.id);
    if (!mob || !mob.isValid()) {
      applyMorph(player, morph);
      continue;
    }

    try {
      mob.teleport(player.location, { rotation: player.getRotation(), dimension: player.dimension });
    } catch {
      applyMorph(player, morph);
    }
  }
}, 1);
