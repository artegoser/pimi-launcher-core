const axios = require("axios");

async function getVersions() {
  return (
    await axios.get(
      "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json"
    )
  ).data.versions;
}

async function getLatestVersion() {
  return getVersions()[0];
}

async function getLatestRelease() {
  return (
    await axios.get(
      "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json"
    )
  ).data.latest.release;
}

async function getLatestSnapshot() {
  return (
    await axios.get(
      "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json"
    )
  ).data.latest.snapshot;
}

module.exports = {
  getVersions,
  getLatestVersion,
  getLatestRelease,
  getLatestSnapshot,
};
