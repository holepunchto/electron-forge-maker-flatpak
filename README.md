# @holepunchto/electron-forge-maker-flatpak

An electron-forge builder for Flatpak.

## Usage

```bash
npm install @holepunchto/electron-forge-maker-flatpak --save-dev
```

## forge.config.js

```js
makers: [
  {
    name: '@holepunchto/electron-forge-maker-flatpak',
    platforms: ['linux'],
    config: {
      appId: 'io.keet.Keet',
      icon: 'build-assets/linux/assets/Keet/Keet-256x256.png'
      metainfo: 'metainfo.xml',
      entrypoint: 'entrypoint.sh',
      comment: 'Experience secure, private messaging and file sharing without intermediaries',
      categories: ['Network', 'P2P'],
    },
  },
]
```

## entrypoint.sh

```sh
#!/bin/sh

FLAGS="--disable-gpu"

if [ -n "$WAYLAND_DISPLAY" ] || [ "$XDG_SESSION_TYPE" = "wayland" ]; then
  FLAGS="$FLAGS --enable-features=UseOzonePlatform --ozone-platform=wayland"
fi

exec zypak-wrapper.sh /app/lib/${FLATPAK_ID}/Keet $FLAGS "$@"
```

## metainfo.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<component type="desktop-application">
  <id>io.keet.Keet</id>

  <name>Keet</name>
  <summary>Secure Messenger, No tracking</summary>

  <metadata_license>MIT</metadata_license>
  <project_license>LicenseRef-proprietary=https://keet.io/application-terms/</project_license>

  <developer id="io.tether">
    <name>Tether Data S.A. de C.V.</name>
  </developer>

  <content_rating type="oars-1.1" />

  <url type="homepage">
    https://keet.io
  </url>

  <releases>
    <release date="2026-05-13" version="4.15.0"/>
  </releases>

  <recommends>
    <display_length compare="ge">600</display_length>
  </recommends>
  <supports>
    <control>pointing</control>
    <control>keyboard</control>
    <control>touch</control>
  </supports>

  <description>
    <p>Discover Keet, the ultimate decentralized, peer-to-peer communication platform. Enjoy secure, private, and efficient messaging and file sharing without intermediaries. Experience true digital privacy and freedom with Keet.</p>
    <p>Features:</p>
    <ul>
      <li><em>Decentralized Communication</em>: No central servers, ensuring privacy.</li>
      <li><em>Peer-to-peer Messaging</em>: Direct, secure conversations.</li>
      <li><em>End-to-end Encryption</em>: Full privacy and security for all messages.</li>
      <li><em>Enhanced Video Calls</em>: High-quality, secure video communications.</li>
      <li><em>Unlimited File Sharing</em>: Share files without size limitations.</li>
    </ul>
  </description>

  <launchable type="desktop-id">io.keet.Keet.desktop</launchable>
  <screenshots>
    <screenshot type="default">
      <image>https://raw.githubusercontent.com/holepunchto/flathub/a63b2cfbe5da0cb1c1dc5934deb2852f67de7bd3/screenshots/1%20Keet%20profile.png</image>
    </screenshot>
    <screenshot>
      <image>https://raw.githubusercontent.com/holepunchto/flathub/a63b2cfbe5da0cb1c1dc5934deb2852f67de7bd3/screenshots/2%20Start%20chat.png</image>
    </screenshot>
    <screenshot>
      <image>https://raw.githubusercontent.com/holepunchto/flathub/a63b2cfbe5da0cb1c1dc5934deb2852f67de7bd3/screenshots/3%20Chat.png</image>
    </screenshot>
    <screenshot>
      <image>https://raw.githubusercontent.com/holepunchto/flathub/a63b2cfbe5da0cb1c1dc5934deb2852f67de7bd3/screenshots/4%20Group%20call.png</image>
    </screenshot>
  </screenshots>
</component>
```

## License

Apache-2.0
