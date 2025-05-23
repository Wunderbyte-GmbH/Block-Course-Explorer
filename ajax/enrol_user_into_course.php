<?php
// This file is part of Moodle - https://moodle.org/
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
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

require(dirname(__DIR__, 3) . '/config.php');
require_once($CFG->libdir . '/enrollib.php');
require_once($CFG->dirroot . '/enrol/locallib.php');

$courseid = required_param('courseid', PARAM_INT);

// Information whether a user is already enrolled into the course is provided to frontend
// by the webservice
// If enrollment exist, user is redirected directly to the course

global $USER, $PAGE, $DB;

$targetenrolmethod = 'manual';

$courseobj = new \stdClass();
$courseobj->id = $courseid;
$manager = new course_enrolment_manager($PAGE, $courseobj);
$enrol = $DB->get_record('enrol', ['enrol' => $targetenrolmethod, 'courseid' => $courseid]);

$instances = $manager->get_enrolment_instances();
$hasguestaccess = false;
foreach ($instances as $instance) {
    if ($instance->enrol === 'guest' && $instance->status == 0) {
        $hasguestaccess = true;
    }
}
if ($hasguestaccess) {
    echo json_encode(['enrolled' => true]);
} else {
    if ($USER->id == 1) {
        echo json_encode(['enrolled' => true]);
    } else {
        $instance = $instances[$enrol->id];
        $plugins = $manager->get_enrolment_plugins();
        $plugin = $plugins[$instance->enrol];

        try {
            $studentroleid = 5;
            $plugin->enrol_user($instance, $USER->id, $studentroleid);
            echo json_encode(['enrolled' => true]);
        } catch (\Error $e) {
            echo json_encode(
                [
                    'enrolled' => false,
                    'errormessage' => $e->getMessage(),
                ]
            );
        }
    }
}
