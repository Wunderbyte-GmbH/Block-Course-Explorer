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

class block_course_explorer_edit_form extends block_edit_form {
    protected function specific_definition($mform) {
        // Note! Field names has to start with "config_" otherwise
        // they will not be available in $this->config object
        $mform->addElement('header', 'functional_configs', 'Functional configurations');

        $mform->addElement('text', 'config_category_ids', get_string('config:category_ids', 'block_course_explorer'));
        $mform->addHelpButton('config_category_ids', 'config:category_ids', 'block_course_explorer');
        $mform->setType('config_category_ids', PARAM_RAW);

        $mform->addElement('advcheckbox', 'config_mycourses', get_string('config:mycourses', 'block_course_explorer'));
        $mform->setType('config_mycourses', PARAM_INT);
        $mform->setDefault('config_mycourses', 0);
    }
}
