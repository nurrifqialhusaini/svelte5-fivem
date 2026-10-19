RegisterCommand('svelte:show', function()
    SendNUIMessage({
        action = 'setVisible',
        data = true
    })
    SetNuiFocus(true, true)
    print("Svelte showing")
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
    SetNuiFocus(false, false)
end)

-- realtime example, only send when the value changed
CreateThread(function()
    local lastMinute, lastStreet

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