"""Button Builder - Custom Button Card Designer for Home Assistant."""
from __future__ import annotations

import logging
from pathlib import Path

from homeassistant.components import frontend
from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry

_LOGGER = logging.getLogger(__name__)

DOMAIN = "button_card_architect"


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Button Builder component."""
    await async_register_panel(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Button Builder from a config entry."""
    # Register the panel
    await async_register_panel(hass)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    return True


async def async_register_panel(hass: HomeAssistant) -> None:
    """Register the Button Builder panel."""
    hass.data.setdefault(DOMAIN, {})

    if hass.data[DOMAIN].get("panel_registered"):
        return

    path = Path(__file__).parent / "www"
    
    # Register the panel's static files
    await hass.http.async_register_static_path(
        "/button_card_architect",
        str(path),
        cache_headers=False,
    )
    
    # Add the panel to the sidebar
    hass.components.frontend.async_register_built_in_panel(
        component_name="iframe",
        sidebar_title="Button Builder",
        sidebar_icon="mdi:gesture-tap-button",
        frontend_url_path="button-builder",
        config={
            "url": "/button_card_architect/panel.html"
        },
        require_admin=False,
    )
    
    hass.data[DOMAIN]["panel_registered"] = True
    _LOGGER.info("Button Builder panel registered")
