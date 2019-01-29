// -*- mode: js2; indent-tabs-mode: nil; js2-basic-offset: 4 -*-

const Clutter = imports.gi.Clutter;
const Meta = imports.gi.Meta;
const Gdk = imports.gi.Gdk;

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

const Main = imports.ui.main;
const WorkspaceSwitcherPopup = imports.ui.workspaceSwitcherPopup;
const Conf = imports.misc.config;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;


class PanelScroll {
    constructor() {
        this._allMonitor = false;

        if (this.isLess30())
            this.wm = global.screen;
        else
            this.wm = global.workspace_manager;

        this.scrollEventId = Main.panel.actor.connect('scroll-event', this.scrollEvent.bind(this));
    }

    scrollEvent(actor, event) {
        let direction;
        switch (event.get_scroll_direction()) {
        case Clutter.ScrollDirection.UP:
            direction = Meta.MotionDirection.UP;
            break;
        case Clutter.ScrollDirection.DOWN:
            direction = Meta.MotionDirection.DOWN;
            break;
        default:
            return Clutter.EVENT_STOP;
        }

        if (this.pointerOnLeftPanel())
            this.switchWindows(direction);
        else
            this.switchWorkspace(direction);

        return Clutter.EVENT_STOP;
    }

    pointerOnLeftPanel() {
        let [x, y, mod] =global.get_pointer();

        let currentMonitor;
        if (this.isLess30()) {
            let currentMonitorIndex = global.screen.get_current_monitor();
            currentMonitor = global.screen.get_monitor_geometry(currentMonitorIndex);
        } else {
            let currentMonitorIndex = global.display.get_current_monitor();
            currentMonitor = global.display.get_monitor_geometry(currentMonitorIndex);
        }

        if (x < (currentMonitor.x + currentMonitor.width / 2))
            return true;
        else
            return false;
    }

    switchWindows(direction) {
        let windows = this.getWindows();
        if (windows.length <= 1)
            return;

        windows[windows.length - 1].activate(global.get_current_time());
    }

    switchWorkspace(direction) {
        let ws = this.getWorkSpace();

        let activeIndex = this.wm.get_active_workspace().index();

        let newWs;
        if (direction == Meta.MotionDirection.UP) {
            if (activeIndex == 0 )
                newWs = ws.length - 1;
            else
                newWs = activeIndex - 1;
        } else {
            if (activeIndex == (ws.length - 1) )
                newWs = 0;
            else
                newWs = activeIndex + 1;
        }

        this.actionMoveWorkspace(ws[newWs]);
        this.switcherPopup(direction, ws[newWs]);
    }

    switcherPopup(direction, newWs) {
        if (!Main.overview.visible) {
            if (this._workspaceSwitcherPopup == null) {
                Main.wm._workspaceTracker.blockUpdates();
                this._workspaceSwitcherPopup = new WorkspaceSwitcherPopup.WorkspaceSwitcherPopup();
                this._workspaceSwitcherPopup.connect('destroy', () => {
                    Main.wm._workspaceTracker.unblockUpdates();
                    this._workspaceSwitcherPopup = null;
                });
            }
            this._workspaceSwitcherPopup.display(direction, newWs.index());
        }
    }

    getWorkSpace() {
        let activeWs = this.wm.get_active_workspace();

        let activeIndex = activeWs.index();
        let ws = [];

        ws[activeIndex] = activeWs;

        for (let i = activeIndex - 1; i >= 0; i--) {
            ws[i] = ws[i + 1].get_neighbor(Meta.MotionDirection.UP);
        }

        for (let i = activeIndex + 1; i < this.wm.n_workspaces; i++) {
            ws[i] = ws[i - 1].get_neighbor(Meta.MotionDirection.DOWN);
        }

        return ws;
    }

    actionMoveWorkspace(workspace) {
        if (!Main.sessionMode.hasWorkspaces)
            return;

        let activeWorkspace = this.wm.get_active_workspace();

        if (activeWorkspace != workspace)
            workspace.activate(global.get_current_time());
    }

    getWindows() {
        let currentWorkspace = this.wm.get_active_workspace();

        let windows = global.display.get_tab_list(Meta.TabList.NORMAL_ALL, currentWorkspace);
        windows.map(w => {
            return w.is_attached_dialog() ? w.get_transient_for() : w;
        }).filter((w, i, a) => !w.skip_taskbar && a.indexOf(w) == i);

        return windows;
    }

    isLess30() {
        let version = Conf.PACKAGE_VERSION.split('.');
        if (version[0] == 3 && version[1] < 30)
            return true;

        return false;
    }

    destroy() {
        if (this.scrollEventId != null) {
            Main.panel.actor.disconnect(this.scrollEventId);
            this.scrollEventId = null;
        }
    }
}

let panelScroll;

function init(metadata) {
}

function enable() {
    panelScroll = new PanelScroll();
}

function disable() {
    panelScroll.destroy();
    panelScroll = null;
}
