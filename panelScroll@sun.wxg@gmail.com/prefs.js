import Adw from 'gi://Adw';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const KEY_LEFT = 'left';
const KEY_RIGHT = 'right';
const KEY_PRIMARY = 'primary';
const KEY_WRAP_AROUND = 'wrap';
const KEY_DEBOUNCE = 'debounce';

const ACTIONS = ['window', 'workspace'];

function addSelection(group, key, title, settings) {
    let row = new Adw.ComboRow({
        title,
        model: new Gtk.StringList({
            strings: [_("Switch windows"), _("Switch workspace")],
        }),
    });

    row.selected = Math.max(0, ACTIONS.indexOf(settings.get_string(key)));
    row.connect('notify::selected', () => {
        settings.set_string(key, ACTIONS[row.selected]);
    });

    group.add(row);
}

function addItemSwitch(group, title, key, settings) {
    let row = new Adw.SwitchRow({ title });
    settings.bind(key, row, 'active', Gio.SettingsBindFlags.DEFAULT);
    group.add(row);
}

function addSpinButton(group, title, key, settings) {
    let row = new Adw.SpinRow({
        title,
        adjustment: new Gtk.Adjustment({ lower: 0, upper: 1000, step_increment: 50 }),
    });
    settings.bind(key, row, 'value', Gio.SettingsBindFlags.DEFAULT);
    group.add(row);
}

export default class PanelScrollPrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        let settings = this.getSettings();

        let page = new Adw.PreferencesPage();
        let group = new Adw.PreferencesGroup();

        addSelection(group, KEY_LEFT, _("Panel left side"), settings);
        addSelection(group, KEY_RIGHT, _("Panel right side"), settings);
        addItemSwitch(group, _("Apps on primary monitor"), KEY_PRIMARY, settings);
        addItemSwitch(group, _("Workspace wrap around"), KEY_WRAP_AROUND, settings);
        addSpinButton(group, _("Debounce time (ms)"), KEY_DEBOUNCE, settings);

        page.add(group);
        window.add(page);
    }
}
