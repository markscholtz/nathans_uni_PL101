//************************************************
// Helper functions
//************************************************

var endTime = function (time, expr) {
    // Base case
    if(expr.tag === 'note' || expr.tag === 'rest') {
        return time + expr.dur;
    }

    if(expr.tag === 'seq') {
        return endTime(time, expr.left) + endTime(time, expr.right);
    }

    if(expr.tag === 'par') {
        return Math.max(endTime(time, expr.left), endTime(time, expr.right));
    }
};

var convertPitch = function (pitch) {
  var note = pitch[0];
  var octave = pitch[1];
  return 12 + 12 * octave + letterPitch(note);
}

var letterPitch = function (note_letter) {
  var note_dictionary =
      { c  : 0,
        d  : 2,
        e  : 4,
        f  : 5,
        g  : 7,
        a  : 9,
        b  : 11 };

  return note_dictionary[note_letter];
}

//************************************************
// Compiler
//************************************************

var compile = function(musexpr, to_midi) {
    var noteArray = [];
    to_midi = typeof to_midi !== 'undefined' ? to_midi : false;

    var getNotes = function(node, start) {
        var nextStart = 0;

        // Base case
        if(node.tag === 'note' || node.tag === 'rest') {
            node.start = start;
            if(to_midi && node.pitch) {
                node.pitch = convertPitch(node.pitch);
            }
            start += node.dur;
            noteArray.push(node);
            return noteArray;
        }

        if(node.tag === 'seq') {
          nextStart = endTime(start, node.left);
        }

        if(node.tag === 'par') {
          // need to capture start time for next seq and then use the current start for
          // all subsequent par notes
          nextStart = start;
        }

        getNotes(node.left, start);
        getNotes(node.right, nextStart);

        return noteArray;
    };

    noteArray = getNotes(musexpr, 0);
    return noteArray;
};

//************************************************
// "Tests"
//************************************************

//************************************************
// "Tests: sequential"
//************************************************

var sequential_melody_input =
    { tag: 'seq',
      left:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

var sequential_melody_expected_output = [
    { tag: 'note', pitch: 'a4', dur: 250, start: 0 },
    { tag: 'note', pitch: 'b4', dur: 250, start: 250 },
    { tag: 'note', pitch: 'c4', dur: 500, start: 500 },
    { tag: 'note', pitch: 'd4', dur: 500, start: 1000 } ];

sequential_melody_output = compile(sequential_melody_input);
console.log('----> SEQUENTIAL melody output:');
console.log(sequential_melody_expected_output);
console.log('');
console.log('----> SEQUENTIAL melody expected output:');
console.log(sequential_melody_output);
console.log('');
console.log('');
console.log('');

//************************************************
// "Tests: sequential with rests"
//************************************************

var sequential_melody_rests_input =
    { tag: 'seq',
      left:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'rest', dur: 100 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

var sequential_melody_rests_expected_output = [
    { tag: 'note', pitch: 'a4', dur: 250, start: 0 },
    { tag: 'note', dur: 100, start: 250 },
    { tag: 'note', pitch: 'c4', dur: 500, start: 350 },
    { tag: 'note', pitch: 'd4', dur: 500, start: 850 } ];

sequential_melody_rests_output = compile(sequential_melody_rests_input);
console.log('----> SEQUENTIAL melody rests output:');
console.log(sequential_melody_rests_output);
console.log('');
console.log('----> SEQUENTIAL melody rests expected output:');
console.log(sequential_melody_rests_expected_output);
console.log('');
console.log('');
console.log('');

//************************************************
// "Tests: parallel"
//************************************************

var parallel_melody_input =
    { tag: 'seq',
      left:
       { tag: 'par',
         left: { tag: 'note', pitch: 'c3', dur: 250 },
         right: { tag: 'note', pitch: 'g4', dur: 500 } },
      right:
       { tag: 'par',
         left: { tag: 'note', pitch: 'd3', dur: 500 },
         right: { tag: 'note', pitch: 'f4', dur: 250 } } };

var parallel_melody_expected_output = [
    { tag: 'note', pitch: 'c3', dur: 250, start: 0 },
    { tag: 'note', pitch: 'g4', dur: 500, start: 0 },
    { tag: 'note', pitch: 'd3', dur: 500, start: 500 },
    { tag: 'note', pitch: 'f4', dur: 250, start: 500 } ];

parallel_melody_output = compile(parallel_melody_input);
console.log('----> PARALLEL melody output:');
console.log(parallel_melody_output);
console.log('');
console.log('----> PARALLEL melody expected output:');
console.log(parallel_melody_expected_output);
console.log('');
console.log('');
console.log('');

//************************************************
// "Tests: midi"
//************************************************

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

midi_melody_output = compile(midi_melody_input, true);
console.log('----> MIDI melody output:');
console.log(midi_melody_output);
console.log('');
console.log('----> MIDI melody expected output:');
console.log(midi_melody_expected_output);
console.log('');
console.log('');
console.log('');
