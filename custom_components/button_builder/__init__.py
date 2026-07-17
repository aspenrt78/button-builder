"""Button Builder - Custom Button Card Designer for Home Assistant."""
from __future__ import annotations

import logging
import json
from pathlib import Path

import homeassistant.helpers.config_validation as cv
from homeassistant.components.frontend import (
    async_register_built_in_panel,
    async_remove_panel,
)
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.event import async_call_later

_LOGGER = logging.getLogger(__name__)

DOMAIN = "button_builder"
PANEL_ID = "button-builder"
DATA_PANEL_REGISTERED = "panel_registered"
DATA_STATIC_REGISTERED = "static_path_registered"
DATA_REGISTER_TIMER = "register_timer_cancel"

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Button Builder component."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Button Builder from a config entry."""
    _LOGGER.info("Setting up Button Builder config entry")

    async def register_panel_later(_now):
        """Register panel after a delay."""
        hass.data[DOMAIN].pop(DATA_REGISTER_TIMER, None)
        try:
            await async_register_panel(hass)
            _LOGGER.info("Panel registration completed successfully")
        except Exception as err:
            _LOGGER.error("Failed to register panel: %s", err, exc_info=True)

    # Register panel with 2 second delay to ensure frontend is ready
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][DATA_REGISTER_TIMER] = async_call_later(
        hass, 2, register_panel_later
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    domain_data = hass.data.get(DOMAIN, {})

    cancel_timer = domain_data.pop(DATA_REGISTER_TIMER, None)
    if cancel_timer:
        cancel_timer()

    if domain_data.get(DATA_PANEL_REGISTERED):
        try:
            async_remove_panel(hass, PANEL_ID)
        except Exception as err:
            _LOGGER.warning("Failed to remove panel %s: %s", PANEL_ID, err)
        domain_data[DATA_PANEL_REGISTERED] = False
        _LOGGER.info("Button Builder panel removed")
    return True


async def async_register_panel(hass: HomeAssistant) -> None:
    """Register the Button Builder panel."""
    hass.data.setdefault(DOMAIN, {})

    if hass.data[DOMAIN].get(DATA_PANEL_REGISTERED):
        return

    path = Path(__file__).parent / "www"
    version = await hass.async_add_executor_job(_integration_version)
    domain_data = hass.data[DOMAIN]

    # Register static assets via Home Assistant's async helper
    if not domain_data.get(DATA_STATIC_REGISTERED):
        try:
            await hass.http.async_register_static_paths(
                [
                    StaticPathConfig(
                        url_path="/button_builder",
                        path=str(path),
                        cache_headers=False,
                    )
                ]
            )
            _LOGGER.info("Static path registered for Button Builder at %s", path)
        except ValueError:
            _LOGGER.debug("Static path already registered for Button Builder")
        domain_data[DATA_STATIC_REGISTERED] = True

    async_register_built_in_panel(
        hass,
        component_name="iframe",
        sidebar_title="Button Builder",
        sidebar_icon="mdi:gesture-tap-button",
        frontend_url_path=PANEL_ID,
        config={
            "url": f"/button_builder/panel.html?v={version}"
        },
        require_admin=False,
    )

    hass.data[DOMAIN][DATA_PANEL_REGISTERED] = True
    _LOGGER.info("Button Builder panel registered")


def _integration_version() -> str:
    """Return the integration version for cache busting."""
    import time
    manifest_path = Path(__file__).parent / "manifest.json"
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        version = manifest.get("version", "0")
        # Add timestamp to ensure cache is always busted on HA restart
        return f"{version}.{int(time.time())}"
    except Exception as err:  # pragma: no cover - best effort only
        _LOGGER.debug("Failed to read manifest for version: %s", err)
        return str(int(time.time()))
