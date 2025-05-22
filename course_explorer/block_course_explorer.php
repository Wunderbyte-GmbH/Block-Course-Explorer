<?php

//use block_course_explorer\course_repository;

class block_course_explorer extends block_base
{
    function init()
    {
        $this->title = get_string('pluginname', 'block_course_explorer');
    }

    function has_config() {
        return true;
    }

    function instance_allow_multiple() {
        return true;
    }

    private array $resources = [];

    /**
     * @throws dml_exception
     */
    private function _set_resources() {
        global $USER;
//$component = 'block_course_explorer';
//$this->resources['translations'] = get_string_manager()->load_component_strings($component, current_language());
        $this->resources['wsToken'] = get_config('block_course_explorer', 'ws_token');
        $categoryids = $this->config->category_ids ?? '';
        $this->resources['categoryids'] = $categoryids;
        $this->resources['userid'] = $USER->id;
        $this->resources['instanceId'] = uniqid();
        $this->resources['template']['instanceId'] = $this->resources['instanceId'];
    }


    /**
     * @throws coding_exception
     * @throws dml_exception
     */
    public function get_content()
    {
        global $OUTPUT, $CFG;

        if ($this->content !== null) {
            return $this->content;
        }
        $this->content = new stdClass();
        $this->_set_resources();

        $mycourses = $this->config->mycourses ?? 0;
        if ($mycourses) {
            $this->page->requires->js_call_amd('block_course_explorer/my-courses/main', 'init', [$this->resources]);
            $this->content->text = $OUTPUT->render_from_template('block_course_explorer/my-courses', $this->resources['template']);
        } else {
            $this->page->requires->js_call_amd('block_course_explorer/main', 'init', [$this->resources]);
            $this->content->text = $OUTPUT->render_from_template('block_course_explorer/explorer', $this->resources['template']);
        }

        if (get_config('block_course_explorer', 'preset_mintcampus')) {
            $this->page->requires->css(str_replace($CFG->dirroot, '', __DIR__) . '/resources/presets/mintcampus.css');
        }

        return $this->content;
    }
}
