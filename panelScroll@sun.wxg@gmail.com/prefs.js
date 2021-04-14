const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
let gsettings;

const SCHEMA_NAME = 'org.gnome.shell.extensions.panelScroll';
const KEY_LEFT = 'left';
const KEY_RIGHT = 'right';

function init() {
    gsettings = ExtensionUtils.getSettings(SCHEMA_NAME);
}

function buildPrefsWidget() {
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

    vbox.append(addSelection(KEY_LEFT, "Panel left side"));
    vbox.append(addSelection(KEY_RIGHT, "Panel right side"));

    widget.append(vbox);

    return widget;
}

function addSelection(key, text) {
    let label = new Gtk.Label({ label: text,
                                hexpand: true,
                                xalign: 0 });

    let timebox_comboBox= new Gtk.ComboBoxText();
    timebox_comboBox.connect('changed',
                             (box) => { gsettings.set_string(key, box.get_active_id()) });

    timebox_comboBox.append("window", "Switch windows");
    timebox_comboBox.append("workspace", "Switch workspacke");
    timebox_comboBox.set_active_id(gsettings.get_string(key));

    hbox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 5 });
    hbox.append(label);
    hbox.append(timebox_comboBox);

    return hbox;
}
