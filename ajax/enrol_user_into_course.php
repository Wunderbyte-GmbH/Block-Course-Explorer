<?php

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
$enrol = $DB->get_record('enrol', array('enrol' => $targetenrolmethod, 'courseid' => $courseid));

$instances = $manager->get_enrolment_instances();
$hasguestaccess = false;
foreach ($instances as $instance) {
    if ($instance->enrol === 'guest' && $instance->status == 0) {
        $hasguestaccess = true;
    }
}
if ($hasguestaccess) {
    echo json_encode(array('enrolled' => true));
} else {
    if ($USER->id == 1) {
        echo json_encode(array('enrolled' => true));
    } else {
        $instance = $instances[$enrol->id];
        $plugins = $manager->get_enrolment_plugins();
        $plugin = $plugins[$instance->enrol];

        try {
            $studentroleid = 5;
            $plugin->enrol_user($instance, $USER->id, $studentroleid);
            echo json_encode(array('enrolled' => true));
        } catch(\Error $e) {
            echo json_encode(
                array(
                    'enrolled' => false,
                    'errormessage' => $e->getMessage()
                )
            );
        }
    }
}