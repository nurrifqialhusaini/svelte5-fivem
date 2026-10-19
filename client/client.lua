local isOpen = false
local count = 0
local lastMinute, lastStreet

RegisterCommand('svelte:show', function()
    -- data sent before the UI loaded is lost, clear it so the loop sends it again
    lastMinute, lastStreet = nil, nil
    SendNUIMessage({ action = 'setCount', data = count })
    SendNUIMessage({
        action = 'setVisible',
        data = true
    })
    SetNuiFocus(true, true)
    -- player can still walk while the UI is open
    SetNuiFocusKeepInput(true)
    isOpen = true
    print("Svelte showing")

    CreateThread(function()
        while isOpen do
            DisableControlAction(0, 1, true)   -- look left/right
            DisableControlAction(0, 2, true)   -- look up/down
            DisableControlAction(0, 24, true)  -- attack
            DisableControlAction(0, 25, true)  -- aim
            DisableControlAction(0, 257, true) -- attack 2
            DisableControlAction(0, 200, true) -- pause menu, ESC closes the UI instead
            DisableControlAction(0, 322, true) -- ESC
            Wait(0)
        end
    end)
end)

RegisterNUICallback('setCount', function(data, cb)
    count = tonumber(data.count) or count
    print(('Counter is %d'):format(count))
    cb({})
end)

RegisterNUICallback('getClientData', function(_, cb)
    local playerCoords = GetEntityCoords(PlayerPedId())
    cb({
        x = math.ceil(playerCoords.x),
        y = math.ceil(playerCoords.y),
        z = math.ceil(playerCoords.z)
    })
end)

RegisterNUICallback('hideUI', function(_, cb)
    cb({})
    isOpen = false
    SetNuiFocusKeepInput(false)
    SetNuiFocus(false, false)
end)

-- realtime example, only send when the value changed
CreateThread(function()
    while true do
        local minute = GetClockMinutes()
        if minute ~= lastMinute then
            lastMinute = minute
            SendNUIMessage({
                action = 'setClock',
                data = { hour = GetClockHours(), minute = minute }
            })
        end

        local coords = GetEntityCoords(PlayerPedId())
        local street = GetStreetNameFromHashKey(GetStreetNameAtCoord(coords.x, coords.y, coords.z))
        if street ~= lastStreet then
            lastStreet = street
            SendNUIMessage({ action = 'setStreet', data = street })
        end

        Wait(500)
    end
end)
