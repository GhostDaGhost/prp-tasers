let tasers: object[] = [];

const taserHash: string = 'WEAPON_STUNGUN';
const taserStateBagKeys: object = {
    'Flashlight': 'taserFlashlightActive',
    'Laser': 'taserLaserActive'
};

// KEY MAPPINGS
RegisterKeyMapping('taser_flashlight', '[Taser] Flashlight~', 'KEYBOARD', '');
RegisterKeyMapping('taser_laser', '[Taser] Laser~', 'KEYBOARD', '');

// ***********************
//       Functions
// ***********************
// WHEN TRIGGERED, TOGGLE TASER ACCESSORY LIKE LASER AND FLASHLIGHT
const ToggleTaserAccessory: any = (accessoryType: string = '') => {
    const playerPed: number = PlayerPedId();
    if (!playerPed || typeof playerPed !== 'number' || playerPed <= 0) {
        return;
    }

    // GET CURRENT WEAPON
    const playerPedWeapon: number = GetSelectedPedWeapon(playerPed);
    if (playerPedWeapon !== GetHashKey(taserHash)) {
        return;
    }

    // UPDATE STATE BAG
    const stateBagKey: string = taserStateBagKeys[accessoryType];
    if (stateBagKey && stateBagKey !== '') {
        const entityState: object = Entity(playerPed).state;
        global.exports['prp-sync'].SetEntityFlag(playerPed, stateBagKey, !entityState[stateBagKey]);
    }
}

// WHEN TRIGGERED, COMPILE A LIST OF ACTIVE TASER ACCESSORIES LIKE LASER AND FLASHLIGHT
const SyncTaserAccessories: any = () => {
    tasers = [];

    // ITERATE THROUGH NEARBY PLAYERS
    const activePlayers: number[] = GetActivePlayers();
    for (const player of activePlayers) {
        const playerPed: number = GetPlayerPed(player);
        const playerState: object = Entity(playerPed).state;

        if (playerState['taserLaserActive']) {
            tasers.push({ 'ped': playerPed, 'type': 'Laser' });
        } else if (playerState['taserFlashlightActive']) {
            tasers.push({ 'ped': playerPed, 'type': 'Flashlight' });
        }
    }
}

// WHEN TRIGGERED, ITERATE THROUGH THE LIST OF ACTIVE TASERS AND DRAW THEIR LASER AND/OR FLASHLIGHT
const DrawActiveTaserAccessories: any = () => {
    if (tasers && typeof tasers === 'object' && tasers.length > 0) {
        for (const taser of tasers) {
            const accessoryType: string = taser['type'];
            if (accessoryType === 'Flashlight') {
                const taserPed: number = taser['ped'];
                const [coordsX, coordsY, coordsZ]: number[] = GetEntityCoords(taserPed, false);

                const [dirX, dirY, dirZ]: number[] = GetEntityForwardVector(taserPed);
                DrawSpotLight(coordsX, coordsY, coordsZ, dirX, dirY + 1.2, dirZ, 221, 221, 221, 10.0, 70.0, 4.3, 18.0, 28.6);
            } else if (accessoryType === 'Laser') {
                const taserPed: number = taser['ped'];
            }
        }
    }
}

// ***********************
//        Commands
// ***********************
// WHEN TRIGGERED, TOGGLE TASER FLASHLIGHT
RegisterCommand('taser_flashlight', () => ToggleTaserAccessory('Flashlight'), false);

// WHEN TRIGGERED, TOGGLE TASER LASER
RegisterCommand('taser_laser', () => ToggleTaserAccessory('Laser'), false);

// **********************
//         Loops
// **********************
// WHEN TRIGGERED, ITERATE THROUGH THE LIST OF ACTIVE TASERS AND DRAW THEIR LASER AND/OR FLASHLIGHT
setTick(() => {
    Wait(0);
    DrawActiveTaserAccessories();
});

// WHEN TRIGGERED, COMPILE A LIST OF ACTIVE TASER ACCESSORIES LIKE LASER AND FLASHLIGHT
setTick(() => {
    Wait(1100);
    SyncTaserAccessories();
});
