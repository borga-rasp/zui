const hostConfig = {
  auto: false,
  default: 'https://registry.borgasecurity.xyz'
};

const host = (manualHost = null) => {
  if (hostConfig.auto) {
    return window.location.origin;
  } else if (manualHost) {
    return manualHost;
  }
  return hostConfig.default;
};

const hostRoot = () => {
  if (hostConfig.auto) {
    return window.location.host;
  }
  // remove http protocol
  return hostConfig.default.replace(/^https?:\/\//, '');
};

export { host, hostRoot };
