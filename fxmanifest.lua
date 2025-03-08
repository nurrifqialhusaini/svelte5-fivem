fx_version 'bodacious'
game 'gta5'
use_fxv2_oal 'yes'

description 'Svelte5 Boilerplate with TailwindCSS 3'
author 'alhuscode.my.id'
version '1.0.0'
lua54 'yes'

-- ui_page 'http://localhost:5173/' -- Uncomment this if you are using Vite (live preview when developing)
ui_page 'web/build/index.html'

client_script "client/**/*"
server_script "server/**/*"

files {
  'web/build/index.html',
  'web/build/**/*'
}