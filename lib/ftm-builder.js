function empty(value) {
  return value === '' ||
    typeof(value) === 'undefined' ||
    value === null;
}

class Square {
  constructor(attrs) {
    this.stop = attrs.stop;
    this.note = attrs.note;
    this.octave = attrs.octave;
    this.volume = attrs.volume;
    this.p = attrs.p;
    this.v = attrs.v;
  }
  empty() {
    return !this.stop &&
      empty(this.note) &&
      empty(this.octave) &&
      empty(this.volume) &&
      empty(this.p) &&
      empty(this.v);
  }
}

class Triangle {
  constructor(attrs) {
    this.stop = attrs.stop;
    this.note = attrs.note;
    this.octave = attrs.octave;
    this.p = attrs.p;
  }
  empty() {
    return !this.stop &&
      empty(this.note) &&
      empty(this.octave) &&
      empty(this.p);
  }
}

class Noise {
  constructor(attrs) {
    this.stop = attrs.stop;
    this.note = attrs.note;
    this.volume = attrs.volume;
    this.v = attrs.v;
  }
  empty() {
    return !this.stop &&
      empty(this.note) &&
      empty(this.volume) &&
      empty(this.v);
  }
}

class Frame {
  empty() {
    return this.square1.empty() &&
      this.square2.empty() &&
      this.triangle.empty() &&
      this.noise.empty();
  }
}

class FTM {
  constructor(frames) {
    this.frames = frames;
    this.removeTrailingEmpty();
  }
  removeTrailingEmpty() {
    for (let i = this.frames.length - 1; i > 0; i--) {
      if (this.frames[i].empty()) {
        this.frames.splice(i, 1);
      }else{
        break;
      }
    }
  }
}

const builder = {
  square(attrs) {
    return new Square(attrs);
  },
  triangle(attrs) {
    return new Triangle(attrs);
  },
  noise(attrs) {
    return new Noise(attrs);
  },
  frame(square1, square2, triangle, noise) {
    return new Frame(square1, square2, triangle, noise);
  },
  ftm(frames) {
    return new FTM(frames);
  }
};

export default builder;
