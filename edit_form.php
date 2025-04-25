<?php

class block_mat_explorer_edit_form extends block_edit_form {
    protected function specific_definition($mform)
    {
        // Note! Field names has to start with "config_" otherwise
        // they will not be available in $this->config object
        $mform->addElement('header', 'functional_configs', 'Functional configurations');

        $mform->addElement('text', 'config_category_ids', get_string('config:category_ids', 'block_mat_explorer'));
        $mform->addHelpButton('config_category_ids', 'config:category_ids', 'block_mat_explorer');
        $mform->setType('config_category_ids', PARAM_RAW);

        $mform->addElement('advcheckbox', 'config_mycourses', get_string('config:mycourses', 'block_mat_explorer'));
        $mform->setType('config_mycourses', PARAM_INT);
        $mform->setDefault('config_mycourses', 0);
    }
}
