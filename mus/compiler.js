//************************************************
// Helper functions
//************************************************

var end_time = function (time, expr) {
    // Base case
    if(expr.tag === 'note' || expr.tag === 'rest') {
        return time + expr.dur;
    }

    if(expr.tag === 'seq') {
        return end_time(time, expr.left) + end_time(time, expr.right);
    }

    if(expr.tag === 'par') {
        return Math.max(end_time(time, expr.left), end_time(time, expr.right));
    }
};

var convert_pitch = function (pitch) {
  var note   = pitch[0],
      octave = pitch[1];

  return 12 + 12 * octave + letter_pitch(note);
};

var letter_pitch = function (note_letter) {
  var _note_dictionary =
      { c  : 0,
        d  : 2,
        e  : 4,
        f  : 5,
        g  : 7,
        a  : 9,
        b  : 11 };

  return _note_dictionary[note_letter];
};

//************************************************
// Compiler
//************************************************

exports.compile = function(mus_expression, to_midi) {
    var _get_notes,
        _note_array = [];

    to_midi = typeof to_midi !== 'undefined' ? to_midi : false;

    _get_notes = function(node, start) {
        var _nextStart = 0;

        // Base case
        if(node.tag === 'note' || node.tag === 'rest') {
            node.start = start;
            if(to_midi && node.pitch) {
                node.pitch = convert_pitch(node.pitch);
            }
            start += node.dur;
            _note_array.push(node);
            return _note_array;
        }

        if(node.tag === 'seq') {
          _nextStart = end_time(start, node.left);
        }

        if(node.tag === 'par') {
          // need to capture start time for next seq and then use the current start for
          // all subsequent par notes
          _nextStart = start;
        }

        _get_notes(node.left, start);
        _get_notes(node.right, _nextStart);

        return _note_array;
    };

    _note_array = _get_notes(mus_expression, 0);
    return _note_array;
};
