"""Button Builder - Custom Button Card Designer for Home Assistant."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components.frontend import async_register_built_in_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry
from homeassistant.helpers.event import async_call_later

_LOGGER = logging.getLogger(__name__)

DOMAIN = "button_card_architect"
PANEL_ID = "button-builder"


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Button Builder component."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Button Builder from a config entry."""
    _LOGGER.info("Setting up Button Builder config entry")
    
    async def register_panel_later(_now):
        """Register panel after a delay."""
        try:
            await async_register_panel(hass)
            _LOGGER.info("Panel registration completed successfully")
        except Exception as err:
            _LOGGER.error("Failed to register panel: %s", err, exc_info=True)
    
    # Register panel with 2 second delay to ensure frontend is ready
    async_call_later(hass, 2, register_panel_later)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    if hass.data.get(DOMAIN, {}).get("panel_registered"):
        hass.components.frontend.async_remove_panel(PANEL_ID)
        hass.data[DOMAIN]["panel_registered"] = False
    return True


async def async_register_panel(hass: HomeAssistant) -> None:
    """Register the Button Builder panel."""
    hass.data.setdefault(DOMAIN, {})

    if hass.data[DOMAIN].get("panel_registered"):
        return

    path = Path(__file__).parent / "www"

    # Register static assets via Home Assistant's async helper to ensure compatibility
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                url_path="/button_card_architect",
                path=str(path),
                cache_headers=False,
            )
        ]
    )
    _LOGGER.info("Static path registered for Button Builder at %s", path)
    
    # Add the panel to the sidebar using built-in panel (like HACS does)
    async_register_built_in_panel(
        hass,
        component_name="iframe",
        sidebar_title="Button Builder",
        sidebar_icon="mdi:gesture-tap-button",
        frontend_url_path=PANEL_ID,
        config={
            "url": "/button_card_architect/panel.html"
        },
        require_admin=False,
    )
    
    hass.data[DOMAIN]["panel_registered"] = True
    _LOGGER.info("Button Builder panel registered")
