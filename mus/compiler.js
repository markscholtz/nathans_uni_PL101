var endTime = function (time, expr) {
    // Base case
    if(expr.tag === 'note') {
        return time + expr.dur;
    }

    if(expr.tag === 'seq') {
        return endTime(time, expr.left) + endTime(time, expr.right);
    }

    if(expr.tag === 'par') {
        return Math.max(endTime(time, expr.left), endTime(time, expr.right));
    }
};


var compile = function(musexpr) {
    var noteArray = [];

    var getNotes = function(node, start) {
        var nextStart = 0;
        console.log('-----> Tag: ' + node.tag + ' - start: ' + start);

        // Base case
        if(node.tag === 'note') {
            node.start = start;
            start += node.dur;
            noteArray.push(node);
            return noteArray;
        }

        if(node.tag === 'seq') {
          nextStart = endTime(start, node.left);
          console.log('----> nextStart: ' + nextStart);
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

var melody_mus_1 =
    { tag: 'seq',
      left:
       { tag: 'par',
         left: { tag: 'note', pitch: 'c3', dur: 250 },
         right: { tag: 'note', pitch: 'g4', dur: 500 } },
      right:
       { tag: 'par',
         left: { tag: 'note', pitch: 'd3', dur: 500 },
         right: { tag: 'note', pitch: 'f4', dur: 250 } } };

var melody_mus_2 =
    { tag: 'seq',
      left:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

var melody_1_expected_notes = [
    { tag: 'note', pitch: 'c3', start: 0, dur: 250 },
    { tag: 'note', pitch: 'g4', start: 0, dur: 500 },
    { tag: 'note', pitch: 'd3', start: 500, dur: 500 },
    { tag: 'note', pitch: 'f4', start: 500, dur: 250 } ];

var melody_2_expected_notes = [
    { tag: 'note', pitch: 'a4', start: 0, dur: 250 },
    { tag: 'note', pitch: 'b4', start: 250, dur: 250 },
    { tag: 'note', pitch: 'c3', start: 500, dur: 500 },
    { tag: 'note', pitch: 'd4', start: 1000, dur: 500 } ];


notes_1 = compile(melody_mus_1);
console.log('----> Compiled Notes PARALLEL:');
console.log(notes_1);
console.log('----> Goal Notes PARALLEL:');
console.log(melody_1_expected_notes);

notes_2 = compile(melody_mus_2);
console.log('----> Compiled Notes SEQUENTIAL:');
console.log(notes_2);
console.log('----> Goal Notes SEQUENTIAL:');
console.log(melody_2_expected_notes);
