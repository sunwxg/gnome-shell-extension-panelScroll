import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

const SCHEMA_NAME = 'org.gnome.shell.extensions.panelScroll';
const KEY_LEFT = 'left';
const KEY_RIGHT = 'right';
const KEY_PRIMARY = 'primary';

function buildPrefsWidget(settings) {
    let widget = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        margin_top: 10,
        margin_bottom: 10,
        margin_start: 10,
        margin_end: 10,
    });

    let vbox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        margin_top: 10
    });
    vbox.set_size_request(550, 350);

    vbox.append(addSelection(KEY_LEFT, "Panel left side", settings));
    vbox.append(addSelection(KEY_RIGHT, "Panel right side", settings));
    vbox.append(addItemSwitch("Apps on primay monitor", KEY_PRIMARY, settings));

    widget.append(vbox);

    return widget;
}

function addSelection(key, text, gsettings) {
    let label = new Gtk.Label({ label: text,
                                hexpand: true,
                                xalign: 0 });

    let timebox_comboBox= new Gtk.ComboBoxText();
    timebox_comboBox.connect('changed',
                             (box) => { gsettings.set_string(key, box.get_active_id()) });

    timebox_comboBox.append("window", "Switch windows");
    timebox_comboBox.append("workspace", "Switch workspace");
    timebox_comboBox.set_active_id(gsettings.get_string(key));

    let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
    hbox.append(label);
    hbox.append(timebox_comboBox);

    return hbox;
}

function addItemSwitch(string, key, gsettings) {
        let hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 20});
        let info = new Gtk.Label({xalign: 0, hexpand: true});
        info.set_markup(string);
        hbox.append(info);

        let button = new Gtk.Switch({ active: gsettings.get_boolean(key) });
        button.connect('notify::active', (button) => { gsettings.set_boolean(key, button.active); });
        hbox.append(button);
        return hbox;
    }

export default class PanelScrollPrefs extends ExtensionPreferences {
    getPreferencesWidget() {
        return buildPrefsWidget(this.getSettings());
    }
}
