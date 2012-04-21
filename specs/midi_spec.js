var compiler = require('../mus/compiler.js');

var midi_melody_input =
    { tag: 'seq',
      left:
       { tag: 'par',
         left: { tag: 'note', pitch: 'c3', dur: 250 },
         right: { tag: 'note', pitch: 'g4', dur: 500 } },
      right:
       { tag: 'par',
         left: { tag: 'note', pitch: 'd3', dur: 500 },
         right: { tag: 'note', pitch: 'f4', dur: 250 } } };

var midi_melody_expected_output = [
    { tag: 'note', pitch: 48, dur: 250, start: 0 },
    { tag: 'note', pitch: 67, dur: 500, start: 0 },
    { tag: 'note', pitch: 50, dur: 500, start: 500 },
    { tag: 'note', pitch: 65, dur: 250, start: 500 } ];

midi_melody_output = compiler.compile(midi_melody_input, true);
console.log('----> MIDI melody output:');
console.log(midi_melody_output);
console.log('');
console.log('----> MIDI melody expected output:');
console.log(midi_melody_expected_output);
console.log('');
console.log('');
console.log('');
