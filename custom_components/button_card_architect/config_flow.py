"""Config flow for the Button Builder integration."""
from __future__ import annotations

from homeassistant import config_entries

from . import DOMAIN


class ButtonBuilderConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle the config flow for Button Builder."""

    VERSION = 1

    async def async_step_user(self, user_input=None):
        """Handle a flow initiated by the user."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        return self.async_create_entry(title="Button Builder", data={})
