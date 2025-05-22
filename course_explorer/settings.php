<?php

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

defined('MOODLE_INTERNAL') || die;

if ($ADMIN->fulltree) {
    $pluginname = 'block_course_explorer';

    // Presentation options heading.
    $settings->add(new admin_setting_heading('pluginname',
        get_string('pluginname', $pluginname),
        ''));

    $settings->add(new admin_setting_configtext(
        'block_course_explorer/ws_token',
        get_string('setting:ws_token', $pluginname),
        get_string('setting:ws_token_desc', $pluginname),
        ''));

    $settings->add(new admin_setting_configcheckbox(
        'block_course_explorer/preset_mintcampus',
        get_string('setting:preset_mintcampus', $pluginname),
        get_string('setting:preset_mintcampus_desc', $pluginname),
        0));
}
