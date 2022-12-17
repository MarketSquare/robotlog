#!/usr/bin/env python
import sys

from overrides import override
from robot.conf.settings import RebotSettings
from robot.reporting.resultwriter import Results
from robot.reporting.jswriter import JsResultWriter, JsonWriter, SuiteWriter
from robot.utils import file_writer


class JsonResultWriter(JsResultWriter):
    def __int__(self, output):
        JsResultWriter.__init__(self, output, '', '', float('inf'))

    @override
    def _start_output_block(self):
        self._write('{', postfix='\n')

    @override
    def _write_suite(self, suite):
        self._write_json('"suite": ', suite, postfix=',\n')

    @override
    def _write_strings(self, strings):
        self._write_json('"strings": ', strings, postfix=',\n')

    @override
    def _write_data(self, data):
        for key in data:
            self._write_json('"%s": ' % self._output_var(key), data[key], postfix=',\n')

    @override
    def _write_settings_and_end_output_block(self, settings):
        self._write_json('"settings": ', settings, separator=False, postfix='\n')
        self._write('}', postfix='', separator=False)

    @override
    def _output_var(self, key):
        return key



def create_jsdata(outxml, target):
    settings = RebotSettings()
    result = Results(settings, outxml).js_result
    with file_writer(target) as output:
        writer = JsonResultWriter(output, start_block='', end_block='')
        writer.write(result, {})


if __name__ == '__main__':
    output_xml = sys.argv[1]
    print(sys.argv)
    create_jsdata(output_xml, "target.json")
    print("Created target.json")

