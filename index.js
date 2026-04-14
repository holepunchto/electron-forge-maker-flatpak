const { MakerBase } = require('@electron-forge/maker-base')
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

class MakerFlatpak extends MakerBase {
  name = 'flatpak'

  defaultPlatforms = ['linux']

  requiredExternalBinaries = ['tar']

  isSupportedOnCurrentPlatform() {
    return process.platform === 'linux'
  }

  async make({ dir, appName, packageJSON, targetArch, makeDir, forgeConfig }) {
    console.log(this.config)

    if (!this.config.appId) {
      throw new Error(`MakerFlatpak: appId needs to be defined: ${this.config.appId}`)
    }

    if (!this.config.icon) {
      throw new Error(`MakerFlatpak: icon needs to be defined: ${this.config.icon}`)
    }

    if (!this.config.metainfo) {
      throw new Error(`MakerFlatpak: metainfo needs to be defined: ${this.config.metainfo}`)
    }

    if (!this.config.comment) {
      throw new Error(`MakerFlatpak: comment needs to be defined: ${this.config.comment}`)
    }

    if (!this.config.categories) {
      throw new Error(`MakerFlatpak: categories needs to be defined: ${this.config.categories}`)
    }

    if (!fs.existsSync(this.config.icon)) {
      throw new Error(`MakerFlatpak: icon not found at ${this.config.icon}`)
    }

    if (!fs.existsSync(this.config.metainfo)) {
      throw new Error(`MakerFlatpak: metainfo not found at ${this.config.metainfo}`)
    }

    // Parse protocols
    const protocols = forgeConfig?.packagerConfig?.protocols || []
    const schemes = protocols.flatMap((p) => p?.schemes || []).filter(Boolean)
    const mimeTypes = schemes.map((s) => `x-scheme-handler/${s}`).join(';')
    const execValue = schemes.length ? `${appName} %U` : appName

    // Create flatpak directory
    const buildDir = path.dirname(dir)
    const flatpakDir = path.join(buildDir, 'flatpak')
    fs.rmSync(flatpakDir, { recursive: true, force: true })
    fs.mkdirSync(flatpakDir)

    // Write flatpak files
    const metainfoFile = path.join(flatpakDir, `${this.config.appId}.metainfo.xml`)
    const iconFile = path.join(flatpakDir, `${this.config.appId}.png`)
    const desktopFile = path.join(flatpakDir, `${this.config.appId}.desktop`)
    const desktop = {
      Name: appName,
      Type: 'Application',
      Exec: execValue,
      Icon: this.config.appId,
      ...(mimeTypes ? { MimeType: `${mimeTypes};` } : {}),
      Comment: this.config.comment,
      Categories: this.config.categories.join(';') + ';'
    }
    const desktopLines = [
      '[Desktop Entry]',
      ...Object.entries(desktop).map(([k, v]) => `${k}=${v}`)
    ]
    fs.copyFileSync(this.config.metainfo, metainfoFile)
    fs.copyFileSync(this.config.icon, iconFile)
    fs.writeFileSync(desktopFile, desktopLines.join('\n'), 'utf8')

    const flatpakName = appName.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const { version } = packageJSON
    const outputFile = path.join(makeDir, `${flatpakName}_${version}_${targetArch}_flatpak.tar.gz`)

    execSync(
      `tar \
      --exclude='${path.relative(buildDir, dir)}/snap' \
      --exclude='${path.relative(buildDir, dir)}/AppRun' \
      -czvf ${outputFile} \
      ${path.relative(buildDir, metainfoFile)} \
      ${path.relative(buildDir, iconFile)} \
      ${path.relative(buildDir, desktopFile)} \
      ${path.relative(buildDir, dir)}`,
      {
        cwd: buildDir,
        stdio: 'inherit',
        shell: true,
        env: {
          ...process.env
        }
      }
    )

    return [outputFile]
  }
}

module.exports = MakerFlatpak
